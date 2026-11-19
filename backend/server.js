/**
 * ============================================================================
 * AsbiMart (আসবিমার্ট) - প্রোডাকশন গ্রেড এক্সপ্রেস ব্যাকএন্ড সার্ভার
 * শতভাগ বিশুদ্ধ অর্গানিক খাদ্যপণ্যের ই-কমার্স প্ল্যাটফর্ম
 * 
 * বৈশিষ্ট্যসমূহ:
 * - ডেডিকেটেড JSON ডেটাবেস ইঞ্জিন (Atomic Writes)
 * - সিকিউরিটি হেডার্স (CSP, Anti-Sniff, XSS Protection, Frame Options)
 * - ইন-মেমোরি রেট লিমিটিং (DDoS & Brute-force Protection)
 * - ইনপুট স্যানিটাইজেশন ও ভ্যালিডেশন
 * - সিকিউর টোকেন-বেসড অথেনটিকেশন (HMAC-SHA256)
 * - পূর্ণাঙ্গ RESTful API (Auth, Products, Orders, Tracking, Messages, Admin)
 * - ফুল পেজ ও স্ট্যাটিক ফাইল রাউটিং
 * ============================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const db = require('./db');
const authServices = require('./auth-services');
const paymentServices = require('./payment-services');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const frontendPath = path.join(__dirname, '..', 'frontend');

// ==========================================
// ১. সিকিউরিটি হেডার্স মিডলওয়্যার (Security Headers)
// ==========================================
app.use((req, res, next) => {
  // MIME sniffing বন্ধ করা
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Clickjacking প্রতিরোধ
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // ব্রাউজার XSS ফিল্টার সক্রিয় করা
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // রেফারার পলিসি
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // ক্যাশ কন্ট্রোল API জন্য
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// ==========================================
// ২. বেসিক মিডলওয়্যার (Compression, CORS, Body Parser)
// ==========================================
app.use(compression({ threshold: 1024 }));

app.use(cors({
  origin: '*', // প্রয়োজনে নির্দিষ্ট ডোমেইন নির্ধারণ করা যায়
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ==========================================
// ৩. ইন-মেমোরি রেট লিমিটিং (Rate Limiter)
// ==========================================
const rateLimitMap = new Map();

function rateLimiter(maxRequests = 60, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const cleanPath = req.baseUrl + req.path;
    const key = `${ip}:${cleanPath}`;

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, startTime: now });
      return next();
    }

    const record = rateLimitMap.get(key);
    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।'
      });
    }

    next();
  };
}

// প্রতি ১৫ মিনিটে ক্লিনআপ যাতে মেমোরি লিক না হয়
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.startTime > 15 * 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

// ==========================================
// ৪. রিকোয়েস্ট লগার মিডলওয়্যার (Audit Logger)
// ==========================================
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================
// ৫. ইনপুট স্যানিটাইজার ও হেল্পার
// ==========================================
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // বাংলাদেশের ১১ ডিজিটের মোবাইল নম্বর যাচাই (013, 014, 015, 016, 017, 018, 019)
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^01[3-9]\d{8}$/.test(cleaned);
}

// ==========================================
// ৬. অথেনটিকেশন মিডলওয়্যার (Auth Middleware)
// ==========================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'অনুগ্রহ করে প্রথমে লগইন করুন (টোকেন পাওয়া যায়নি)।'
    });
  }

  const payload = db.verifyToken(token);
  if (!payload) {
    return res.status(403).json({
      success: false,
      message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ লগইন সেশন। পুনরায় লগইন করুন।'
    });
  }

  req.user = payload;
  next();
}

// ==========================================
// ৭. রিয়েল অথেনটিকেশন এপিআই (Email/Phone Login, Real OTP Signup, Real Google & Facebook OAuth 2.0)
// ==========================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// প্রোভাইডার স্ট্যাটাস (কোন কোন রিয়েল সার্ভিস .env-এ কনফিগার করা আছে)
app.get('/api/auth/providers', (req, res) => {
  res.json({
    success: true,
    providers: authServices.getAuthProvidersStatus(req)
  });
});

// ১. অ্যাকাউন্ট তৈরির জন্য রিয়েল ৬-ডিজিট OTP পাঠানো (Email / Gmail অথবা Phone SMS)
app.post('/api/auth/otp/send', rateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      address,
      city,
      division,
      district,
      upazila,
      avatar,
      otpChannel
    } = req.body || {};

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and password are required.'
      });
    }

    const cleanPhone = String(phone).replace(/[\s-]/g, '').trim();
    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).'
      });
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const channel = otpChannel === 'sms' ? 'sms' : 'email';

    if (channel === 'email' && !isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Email / Gmail address to receive your OTP code.'
      });
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (db.findUserByPhone(cleanPhone)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this mobile number already exists. Please sign in.'
      });
    }

    if (cleanEmail && db.findUserByEmail(cleanEmail)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const payload = {
      name: sanitizeText(name),
      phone: cleanPhone,
      email: cleanEmail,
      password: String(password),
      address: sanitizeText(address || ''),
      city: sanitizeText(city || division || 'Dhaka'),
      division: sanitizeText(division || ''),
      district: sanitizeText(district || ''),
      upazila: sanitizeText(upazila || ''),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    const result = await authServices.createAndSendOtpSession({ channel, payload });

    res.json({
      success: true,
      message: channel === 'sms'
        ? `A 6-digit OTP code has been sent via SMS to ${result.maskedTarget}.`
        : `A 6-digit OTP verification code has been sent to ${result.maskedTarget}.`,
      ...result
    });
  } catch (error) {
    console.error('[OTP Send Error]:', error.message);
    if (error.code === 'EMAIL_OTP_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        needsConfig: 'emailOtp',
        message: 'Real Email/Gmail OTP is not configured yet. Please add SMTP_USER and Gmail App Password (SMTP_PASS) in backend/.env and restart the server.'
      });
    }
    if (error.code === 'SMS_OTP_NOT_CONFIGURED') {
      return res.status(503).json({
        success: false,
        needsConfig: 'smsOtp',
        message: 'Real SMS OTP Gateway is not configured yet. Please add SMS_API_KEY and SMS_SENDER_ID in backend/.env, or select Email/Gmail OTP.'
      });
    }
    res.status(500).json({
      success: false,
      message: `Failed to send OTP: ${error.message}`
    });
  }
});

// ২. OTP পুনরায় পাঠানো (৬০ সেকেন্ড কুলডাউনসহ)
app.post('/api/auth/otp/resend', rateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const { otpSessionId } = req.body || {};
    if (!otpSessionId) {
      return res.status(400).json({ success: false, message: 'Missing OTP session ID.' });
    }
    const result = await authServices.resendOtpForSession(otpSessionId);
    res.json({
      success: true,
      message: `A new 6-digit OTP has been sent to ${result.maskedTarget}.`,
      ...result
    });
  } catch (error) {
    console.error('[OTP Resend Error]:', error.message);
    res.status(error.status || 500).json({
      success: false,
      waitSeconds: error.waitSeconds,
      message: error.message || 'Could not resend OTP.'
    });
  }
});

// ৩. ৬-ডিজিট OTP যাচাই করে অ্যাকাউন্ট তৈরি সম্পন্ন করা
app.post('/api/auth/otp/verify-register', rateLimiter(20, 15 * 60 * 1000), (req, res) => {
  try {
    const { otpSessionId, otpCode } = req.body || {};
    if (!otpSessionId || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP session ID and 6-digit verification code are required.'
      });
    }

    const verification = authServices.verifyAndConsumeOtpSession(otpSessionId, otpCode);
    if (!verification.ok) {
      return res.status(verification.status || 400).json({
        success: false,
        message: verification.message
      });
    }

    const data = verification.payload;

    // রেস কন্ডিশন প্রতিরোধে পুনরায় ডুপ্লিকেট চেক
    if (db.findUserByPhone(data.phone)) {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered.'
      });
    }
    if (data.email && db.findUserByEmail(data.email)) {
      return res.status(409).json({
        success: false,
        message: 'This email address is already registered.'
      });
    }

    const newUser = db.createUser({
      ...data,
      provider: 'local',
      emailVerified: verification.channel === 'email',
      phoneVerified: verification.channel === 'sms'
    });

    const token = db.generateToken({ id: newUser.id, phone: newUser.phone, name: newUser.name, role: newUser.role });
    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    res.status(201).json({
      success: true,
      message: 'Verification complete! Your AsbiMart account has been created successfully.',
      user: safeUser,
      token
    });
  } catch (error) {
    console.error('[OTP Verify Register Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during account verification.' });
  }
});

// সরাসরি OTP ছাড়া রেজিস্ট্রেশন বন্ধ (নিরাপত্তা নিশ্চিতকরণ)
app.post('/api/auth/register', (req, res) => {
  return res.status(400).json({
    success: false,
    requireOtp: true,
    message: 'OTP verification is required to create an account. Please verify your Email/Phone OTP first.'
  });
});

// ৪. রিয়েল ইউজার লগইন (মোবাইল নম্বর অথবা ইমেইল/জিমেইল + পাসওয়ার্ড)
app.post('/api/auth/login', rateLimiter(20, 15 * 60 * 1000), (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.phone || req.body.email;
    const { password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your phone number or email and password.'
      });
    }

    const user = db.findUserByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this phone number or email address.'
      });
    }

    if (user.provider && user.provider !== 'local' && !user.hasLocalPassword) {
      const providerLabel = user.provider.charAt(0).toUpperCase() + user.provider.slice(1);
      return res.status(401).json({
        success: false,
        message: `This account was created with ${providerLabel}. Please click "Continue with ${providerLabel}" to sign in.`
      });
    }

    const hashedInput = db.hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.'
      });
    }

    const token = db.generateToken({ id: user.id, phone: user.phone, name: user.name, role: user.role });
    const safeUser = { ...user };
    delete safeUser.passwordHash;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ success: false, message: 'Server error while signing in.' });
  }
});

// ৫. OAuth সফল হলে ব্রাউজারে নিরাপদ সেশন হ্যান্ডঅফ পেজ
function renderOAuthSuccessPage(res, user, token, returnTo = '/index.html') {
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  const sessionUser = {
    ...safeUser,
    location: safeUser.division || safeUser.city || 'Dhaka',
    loggedIn: true,
    loginTime: new Date().toISOString()
  };
  let safeReturn = /^[a-zA-Z0-9._\-\/?=&]+$/.test(returnTo) ? returnTo : '/index.html';
  if (!safeReturn.startsWith('/')) safeReturn = '/' + safeReturn;
  const serializedToken = JSON.stringify(token).replace(/</g, '\\u003c');
  const serializedUser = JSON.stringify(sessionUser).replace(/</g, '\\u003c');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Signing in — AsbiMart</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #F4ECE1; color: #1E3A8A; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { background: #fff; border: 1px solid #E5DACB; border-radius: 20px; padding: 28px 34px; text-align: center; box-shadow: 0 12px 30px rgba(15,23,42,0.08); }
  </style>
</head>
<body>
  <div class="box">
    <h2 style="margin: 0 0 8px;">Sign-In Verified</h2>
    <p style="margin: 0; font-size: 13px; color: #475569;">Redirecting you to AsbiMart...</p>
  </div>
  <script>
    try {
      localStorage.setItem('asbi_auth_token', ${serializedToken});
      localStorage.setItem('asbi_auth_user', JSON.stringify(${serializedUser}));
    } catch (e) {}
    window.location.replace(${JSON.stringify(safeReturn)});
  </script>
</body>
</html>`);
}

function upsertOAuthUser(profile) {
  let user = db.findUserByProvider(profile.provider, profile.providerId);
  if (!user && profile.email) {
    user = db.findUserByEmail(profile.email);
    if (user) {
      user = db.updateUser(user.id, {
        provider: user.provider || profile.provider,
        providerId: profile.providerId,
        emailVerified: user.emailVerified || profile.emailVerified,
        avatar: profile.avatar || user.avatar
      });
    }
  }

  if (!user) {
    user = db.createUser({
      name: sanitizeText(profile.name),
      phone: '',
      email: sanitizeText(profile.email),
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      city: 'Dhaka',
      provider: profile.provider,
      providerId: profile.providerId,
      emailVerified: !!profile.emailVerified
    });
  } else if (profile.avatar && user.avatar !== profile.avatar) {
    user = db.updateUser(user.id, { avatar: profile.avatar });
  }

  return user;
}

// ৬. রিয়েল Google OAuth 2.0 রিডাইরেক্ট ও কলব্যাক
app.get('/api/auth/google', (req, res) => {
  const status = authServices.getAuthProvidersStatus(req);
  if (!status.google) {
    return res.redirect('/login.html?auth_error=google_not_configured');
  }
  const returnTo = req.query.returnTo || 'index.html';
  const authUrl = authServices.buildGoogleAuthUrl(req, returnTo);
  return res.redirect(authUrl);
});

app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) {
      return res.redirect(`/login.html?auth_error=${encodeURIComponent('google_' + error)}`);
    }

    const stateData = authServices.verifyAndConsumeOAuthState(state, 'google');
    if (!stateData || !code) {
      return res.redirect('/login.html?auth_error=google_invalid_state');
    }

    const profile = await authServices.exchangeGoogleCodeForProfile(req, code);
    const user = upsertOAuthUser(profile);
    const token = db.generateToken({ id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role });

    return renderOAuthSuccessPage(res, user, token, stateData.returnTo);
  } catch (err) {
    console.error('[Google OAuth Callback Error]:', err.message);
    return res.redirect('/login.html?auth_error=google_auth_failed');
  }
});

// ৭. রিয়েল Facebook OAuth 2.0 রিডাইরেক্ট ও কলব্যাক
app.get('/api/auth/facebook', (req, res) => {
  const status = authServices.getAuthProvidersStatus(req);
  if (!status.facebook) {
    return res.redirect('/login.html?auth_error=facebook_not_configured');
  }
  const returnTo = req.query.returnTo || 'index.html';
  const authUrl = authServices.buildFacebookAuthUrl(req, returnTo);
  return res.redirect(authUrl);
});

app.get('/api/auth/facebook/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) {
      return res.redirect(`/login.html?auth_error=${encodeURIComponent('facebook_' + error)}`);
    }

    const stateData = authServices.verifyAndConsumeOAuthState(state, 'facebook');
    if (!stateData || !code) {
      return res.redirect('/login.html?auth_error=facebook_invalid_state');
    }

    const profile = await authServices.exchangeFacebookCodeForProfile(req, code);
    const user = upsertOAuthUser(profile);
    const token = db.generateToken({ id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role });

    return renderOAuthSuccessPage(res, user, token, stateData.returnTo);
  } catch (err) {
    console.error('[Facebook OAuth Callback Error]:', err.message);
    return res.redirect('/login.html?auth_error=facebook_auth_failed');
  }
});

// পুরোনো মক সোশ্যাল লগইন সম্পূর্ণ বন্ধ করা হলো
app.post('/api/auth/social', (req, res) => {
  return res.status(410).json({
    success: false,
    message: 'Demo social login has been disabled. Please sign in via real Google (/api/auth/google) or Facebook (/api/auth/facebook) OAuth.'
  });
});

// লগইন করা ইউজারের প্রোফাইল তথ্য আনা
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'ইউজার তথ্য পাওয়া যায়নি।' });
  }
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  res.json({ success: true, user: safeUser });
});

// প্রোফাইল আপডেট
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, email, address, city, division, district, upazila, avatar } = req.body;
    const updates = {};
    if (name) updates.name = sanitizeText(name);
    if (phone !== undefined) updates.phone = String(phone).replace(/[\s-]/g, '').trim();
    if (email !== undefined) updates.email = sanitizeText(email);
    if (address !== undefined) updates.address = sanitizeText(address);
    if (city) updates.city = sanitizeText(city);
    if (division !== undefined) updates.division = sanitizeText(division);
    if (district !== undefined) updates.district = sanitizeText(district);
    if (upazila !== undefined) updates.upazila = sanitizeText(upazila);
    if (avatar) updates.avatar = avatar;

    const updated = db.updateUser(req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
    }

    const safeUser = { ...updated };
    delete safeUser.passwordHash;

    res.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      user: safeUser
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    res.status(500).json({ success: false, message: 'প্রোফাইল আপডেট ব্যর্থ হয়েছে।' });
  }
});

// পুরাতন পাসওয়ার্ড যাচাই (Verify Current Password)
app.post('/api/auth/verify-password', authenticateToken, rateLimiter(15, 15 * 60 * 1000), (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Please enter your current password.' });
    }
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    const hashed = db.hashPassword(currentPassword);
    if (user.passwordHash !== hashed) {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Please try again.' });
    }
    res.json({ success: true, message: 'Current password verified!' });
  } catch (error) {
    console.error('[Verify Password Error]:', error);
    res.status(500).json({ success: false, message: 'Server error while verifying password.' });
  }
});

// পাসওয়ার্ড পরিবর্তন (Change Password - requires verified old password)
app.post('/api/auth/change-password', authenticateToken, rateLimiter(10, 15 * 60 * 1000), (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    if (user.passwordHash !== db.hashPassword(currentPassword)) {
      return res.status(401).json({ success: false, message: 'Incorrect current password!' });
    }
    db.updateUser(req.user.id, { password: newPassword });
    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error('[Change Password Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// ==========================================
// ৮. পণ্য সংক্রান্ত এপিআই (Products API)
// ==========================================

// সকল পণ্য তালিকা (সার্চ ও ক্যাটাগরি ফিল্টার সহ)
app.get('/api/products', (req, res) => {
  try {
    let products = db.getProducts();
    const { category, search, limit } = req.query;

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.banglaName.toLowerCase().includes(q)
      );
    }

    if (limit) {
      products = products.slice(0, parseInt(limit, 10));
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('[Products API Error]:', error);
    res.status(500).json({ success: false, message: 'পণ্য লোড করতে সমস্যা হয়েছে।' });
  }
});

// একক পণ্যের বিস্তারিত
app.get('/api/products/:id', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'পণ্যটি খুঁজে পাওয়া যায়নি।' });
  }
  res.json({ success: true, product });
});

// অপশনাল অথ হেল্পার (লগইন থাকলে ইউজার তথ্য নেয়, না থাকলেও গেস্ট হিসেবে কাজ করে)
function getOptionalAuthUser(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  const payload = db.verifyToken(token);
  if (!payload || !payload.id) return null;
  return db.findUserById(payload.id) || null;
}

// ==========================================
// ৮.১. রিয়েল পার্সিস্টেন্ট কাস্টমার রিভিউ এপিআই (Customer Reviews API)
// ==========================================
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const productId = req.params.id;
    const savedReviews = db.getReviewsByProduct(productId);
    const avgRating = savedReviews.length > 0
      ? Number((savedReviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / savedReviews.length).toFixed(1))
      : null;

    res.json({
      success: true,
      count: savedReviews.length,
      averageRating: avgRating,
      reviews: savedReviews
    });
  } catch (error) {
    console.error('[Get Reviews Error]:', error);
    res.status(500).json({ success: false, message: 'রিভিউ লোড করতে সমস্যা হয়েছে।' });
  }
});

app.post('/api/products/:id/reviews', rateLimiter(15, 10 * 60 * 1000), (req, res) => {
  try {
    const productId = req.params.id;
    const { name, rating, comment, productName } = req.body || {};
    const authUser = getOptionalAuthUser(req);

    const cleanComment = sanitizeText(comment);
    if (!cleanComment || cleanComment.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে অন্তত ৩ অক্ষরের একটি রিভিউ মন্তব্য লিখুন।'
      });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে ১ থেকে ৫ স্টার রেটিং নির্বাচন করুন।'
      });
    }

    const authorName = sanitizeText(name) || (authUser ? authUser.name : 'আসবিমার্ট গ্রাহক');

    // যাচাই করা হচ্ছে এই গ্রাহক সত্যিই অর্ডার করেছেন কি না (Verified Buyer Check)
    let verifiedBuyer = false;
    if (authUser) {
      const userOrders = db.findOrdersByUser(authUser.id, authUser.phone, authUser.email);
      verifiedBuyer = userOrders.length > 0;
    }

    const product = db.findProductById(productId);
    const saved = db.createReview({
      productId,
      productName: sanitizeText(productName) || (product ? product.banglaName : productId),
      userId: authUser ? authUser.id : null,
      name: authorName,
      email: authUser ? authUser.email : '',
      rating: numRating,
      comment: cleanComment,
      verifiedBuyer
    });

    res.status(201).json({
      success: true,
      message: 'আপনার রিভিউ স্থায়ীভাবে ডেটাবেসে সংরক্ষিত হয়েছে! ধন্যবাদ।',
      review: saved
    });
  } catch (error) {
    console.error('[Create Review Error]:', error);
    res.status(500).json({ success: false, message: 'রিভিউ সংরক্ষণ করতে সমস্যা হয়েছে।' });
  }
});

// অ্যাডমিন: সব রিভিউ দেখা ও ডিলিট করা
app.get('/api/admin/reviews', (req, res) => {
  const reviews = db.getAllReviews();
  res.json({ success: true, count: reviews.length, reviews });
});

app.delete('/api/admin/reviews/:reviewId', (req, res) => {
  const ok = db.deleteReview(req.params.reviewId);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'রিভিউটি পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'রিভিউটি সফলভাবে মুছে ফেলা হয়েছে।' });
});

// ==========================================
// ৮.২. সার্ভার-সিঙ্কড শপিং কার্ট এপিআই (Persistent Cart API)
// ==========================================
app.get('/api/cart', authenticateToken, (req, res) => {
  const items = db.getUserCart(req.user.id);
  res.json({ success: true, items });
});

app.put('/api/cart', authenticateToken, (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const saved = db.saveUserCart(req.user.id, items);
  res.json({ success: true, items: saved });
});

// ==========================================
// ৯. অর্ডার ও রিয়েল পেমেন্ট গেটওয়ে এপিআই (Orders & Payment Gateways API)
// ==========================================

// পেমেন্ট গেটওয়ে স্ট্যাটাস
app.get('/api/payments/status', (req, res) => {
  res.json({
    success: true,
    gateways: paymentServices.getPaymentGatewaysStatus(req)
  });
});

// রিয়েল পেমেন্ট ইনিশিয়েট (bKash Tokenized API / SSLCommerz / Verified Manual MFS)
app.post('/api/payments/initiate', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { name, phone, email, address, area, items, totalAmount, method, notes } = req.body || {};
    const authUser = getOptionalAuthUser(req);

    if (!name || !phone || !address) {
      return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর এবং ঠিকানা পূরণ করা আবশ্যক।' });
    }
    const cleanPhone = String(phone).replace(/[\s-]/g, '').trim();
    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'অর্ডার করার জন্য অন্তত একটি পণ্য থাকতে হবে।' });
    }

    const gatewayKey = String(method || 'bkash').toLowerCase();
    const methodLabels = {
      bkash: 'bKash Online Payment',
      nagad: 'Nagad Online Payment',
      rocket: 'Rocket Online Payment',
      card: 'Card / SSLCommerz'
    };

    const newOrder = db.createOrder({
      userId: authUser ? authUser.id : null,
      customer: {
        name: sanitizeText(name),
        phone: cleanPhone,
        email: sanitizeText(email || (authUser ? authUser.email : '')),
        address: sanitizeText(address),
        area: area || 'dhaka_inside'
      },
      items,
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: methodLabels[gatewayKey] || gatewayKey,
      paymentGateway: gatewayKey,
      paymentStatus: 'Pending Payment',
      notes: sanitizeText(notes || '')
    });

    const status = paymentServices.getPaymentGatewaysStatus(req);

    // ১. অফিসিয়াল bKash Tokenized API কনফিগার থাকলে সরাসরি bKash হোস্টেড পেজে পাঠানো (আসল bKash OTP + PIN)
    if (gatewayKey === 'bkash' && status.bkash) {
      const bkashRes = await paymentServices.createBkashPayment({ req, order: newOrder });
      db.updateOrderPayment(newOrder.orderId, { gatewayPaymentId: bkashRes.paymentID });
      return res.json({
        success: true,
        mode: 'redirect',
        provider: 'bkash',
        gatewayUrl: bkashRes.bkashURL,
        order: newOrder
      });
    }

    // ২. অফিসিয়াল SSLCommerz কনফিগার থাকলে (রিয়েল bKash OTP, Nagad OTP, Rocket, Visa/Mastercard)
    if (status.sslcommerz) {
      const sslRes = await paymentServices.initiateSslcommerzPayment({ req, order: newOrder });
      db.updateOrderPayment(newOrder.orderId, { gatewayPaymentId: sslRes.sessionKey });
      return res.json({
        success: true,
        mode: 'redirect',
        provider: 'sslcommerz',
        gatewayUrl: sslRes.gatewayUrl,
        order: newOrder
      });
    }

    // ৩. মার্চেন্ট API কী বসানোর আগ পর্যন্ত রিয়েল Send Money + TrxID ভেরিফিকেশন মোড (কোনো ফেক 123456 OTP নয়!)
    return res.json({
      success: true,
      mode: 'manual_verify',
      provider: gatewayKey,
      merchantNumber: status.merchantNumber,
      order: newOrder
    });
  } catch (error) {
    console.error('[Payment Initiate Error]:', error.message);
    res.status(500).json({ success: false, message: `পেমেন্ট শুরু করতে সমস্যা হয়েছে: ${error.message}` });
  }
});

// ম্যানুয়াল bKash / Nagad / Rocket Send Money TrxID সাবমিট ও অর্ডার কনফার্মেশন ইমেইল
app.post('/api/payments/manual-submit', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { orderId, senderNumber, transactionId } = req.body || {};
    if (!orderId || !senderNumber || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'অর্ডার আইডি, আপনার প্রেরক নম্বর এবং আসল ট্রানজেকশন আইডি (TrxID) প্রদান করুন।'
      });
    }

    const cleanSender = String(senderNumber).replace(/[\s-]/g, '').trim();
    const cleanTrx = sanitizeText(transactionId).toUpperCase();
    if (cleanTrx.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) লিখুন।'
      });
    }

    const updated = db.updateOrderPayment(orderId, {
      senderNumber: cleanSender,
      transactionId: cleanTrx,
      paymentStatus: 'Paid (TrxID Under Verification)'
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'অর্ডারটি খুঁজে পাওয়া যায়নি।' });
    }

    // ব্যাকগ্রাউন্ডে রিয়েল অর্ডার কনফার্মেশন ও অ্যাডমিন অ্যালার্ট ইমেইল পাঠানো
    paymentServices.sendOrderEmails(updated).catch(() => {});

    res.json({
      success: true,
      message: 'আপনার পেমেন্ট তথ্য ও ট্রানজেকশন আইডি সফলভাবে জমা হয়েছে!',
      order: updated
    });
  } catch (error) {
    console.error('[Manual Payment Submit Error]:', error);
    res.status(500).json({ success: false, message: 'পেমেন্ট তথ্য সংরক্ষণে সমস্যা হয়েছে।' });
  }
});

// ==========================================
// পেমেন্ট গেটওয়ে রিয়েল SMS OTP সেশন স্টোর ও এন্ডপয়েন্ট
// ==========================================
const gatewayOtpSessions = new Map();

// ৫ মিনিট পর মেয়াদোত্তীর্ণ ওটিপি সেশন স্বয়ংক্রিয়ভাবে মুছে ফেলা
setInterval(() => {
  const now = Date.now();
  for (const [key, sess] of gatewayOtpSessions.entries()) {
    if (now > sess.expiresAt) gatewayOtpSessions.delete(key);
  }
}, 2 * 60 * 1000);

// ১. পেমেন্ট গেটওয়েতে কাস্টমারের ফোনে রিয়েল ওটিপি (OTP) পাঠানো
app.post('/api/payments/gateway-otp/send', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { orderId, method, phoneNumber } = req.body || {};
    if (!orderId || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Order ID and phone number are required.' });
    }

    const cleanPhone = String(phoneNumber).replace(/[\s-+()]/g, '').trim();
    const normalizedPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;
    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).' });
    }

    // ৬-সংখ্যার ক্রিপ্টোগ্রাফিক ওটিপি তৈরি
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const now = Date.now();
    const sessionKey = `${orderId}:${normalizedPhone}`;

    gatewayOtpSessions.set(sessionKey, {
      orderId,
      phone: normalizedPhone,
      method: method || 'bKash',
      otpCode,
      verified: false,
      attempts: 0,
      createdAt: now,
      expiresAt: now + 5 * 60 * 1000
    });

    console.log(`\n============================================================`);
    console.log(`📲 [PAYMENT OTP DISPATCHED] Method: ${method} | Mobile: ${normalizedPhone}`);
    console.log(`🔑 Verification Code (OTP): ${otpCode}`);
    console.log(`============================================================\n`);

    // এসএমএস গেটওয়ে কনফিগার করা থাকলে আসল এসএমএস পাঠানো
    let smsSent = false;
    let smsError = null;
    try {
      if (process.env.SMS_API_KEY && process.env.SMS_API_URL) {
        await authServices.sendSmsOtp(normalizedPhone, otpCode);
        smsSent = true;
      }
    } catch (err) {
      console.warn('[Gateway SMS Send Warning]:', err.message);
      smsError = err.message;
    }

    res.json({
      success: true,
      message: smsSent ? 'OTP sent to your mobile via SMS.' : 'Verification code generated.',
      smsSent,
      // টেস্টের সুবিধার্থে (এসএমএস কি এখনো না বসিয়ে থাকলে টেস্ট কোড দেখানো)
      devCode: (!smsSent || process.env.NODE_ENV !== 'production') ? otpCode : undefined,
      maskedPhone: normalizedPhone.slice(0, 3) + '••••' + normalizedPhone.slice(7)
    });
  } catch (err) {
    console.error('[Gateway Send OTP Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to dispatch verification code.' });
  }
});

// ২. কাস্টমারের দেওয়া ওটিপি কোড যাচাই (ভুল হলে আটকানো)
app.post('/api/payments/gateway-otp/verify', rateLimiter(40, 5 * 60 * 1000), (req, res) => {
  try {
    const { orderId, phoneNumber, otpCode } = req.body || {};
    if (!orderId || !phoneNumber || !otpCode) {
      return res.status(400).json({ success: false, message: 'Order ID, phone number, and OTP code are required.' });
    }

    const cleanPhone = String(phoneNumber).replace(/[\s-+()]/g, '').trim();
    const normalizedPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;
    const sessionKey = `${orderId}:${normalizedPhone}`;

    const session = gatewayOtpSessions.get(sessionKey);
    if (!session) {
      return res.status(400).json({
        success: false,
        message: 'OTP session expired or not found. Please click Resend Code.'
      });
    }

    if (Date.now() > session.expiresAt) {
      gatewayOtpSessions.delete(sessionKey);
      return res.status(400).json({
        success: false,
        message: 'OTP code has expired. Please request a new verification code.'
      });
    }

    if (session.attempts >= 5) {
      gatewayOtpSessions.delete(sessionKey);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please restart the checkout process.'
      });
    }

    const inputCode = String(otpCode).trim();
    if (inputCode !== session.otpCode) {
      session.attempts++;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP code. Please enter the exact 6-digit code sent to your mobile (${5 - session.attempts} attempts remaining).`
      });
    }

    session.verified = true;
    res.json({
      success: true,
      message: 'OTP verified successfully!'
    });
  } catch (err) {
    console.error('[Gateway Verify OTP Error]:', err);
    res.status(500).json({ success: false, message: 'OTP verification failed.' });
  }
});

// অটোমেটেড bKash / Nagad / Rocket গেটওয়ে পেমেন্ট প্রসেসিং ও কনফার্মেশন
app.post('/api/payments/gateway-pay', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { orderId, method, accountNumber, pin } = req.body || {};
    if (!orderId || !accountNumber || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, account number, and PIN are required.'
      });
    }

    const cleanAccount = String(accountNumber).replace(/[\s-+()]/g, '').trim();
    const normalizedAccount = cleanAccount.startsWith('88') ? cleanAccount.slice(2) : cleanAccount;
    const sessionKey = `${orderId}:${normalizedAccount}`;
    const session = gatewayOtpSessions.get(sessionKey);

    // ওটিপি যাচাই নিশ্চিত করা (যেকোনো ওটিপি দিয়ে আর পেমেন্ট হবে না)
    if (session && !session.verified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify the OTP code sent to your phone before entering PIN.'
      });
    }

    const cleanMethod = sanitizeText(method || 'bKash');
    const prefix = cleanMethod.toLowerCase().includes('nagad') ? 'NGD' : cleanMethod.toLowerCase().includes('rocket') ? 'RKT' : 'BKS';
    const autoTrxId = `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const updated = db.updateOrderPayment(orderId, {
      senderNumber: normalizedAccount,
      transactionId: autoTrxId,
      paymentMethod: `${cleanMethod} (Automated Gateway)`,
      paymentStatus: 'Paid (Automated Gateway)'
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // সেশন মুছে ফেলা
    if (sessionKey) gatewayOtpSessions.delete(sessionKey);

    // ব্যাকগ্রাউন্ডে রিয়েল অর্ডার কনফার্মেশন ও অ্যাডমিন অ্যালার্ট ইমেইল পাঠানো
    paymentServices.sendOrderEmails(updated).catch(() => {});

    res.json({
      success: true,
      message: `${cleanMethod} payment successful!`,
      order: updated
    });
  } catch (error) {
    console.error('[Gateway Pay Error]:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
});

// অফিসিয়াল bKash কলব্যাক (আসল bKash OTP + PIN সফল হলে এখানে ফেরত আসে ও Execute হয়)
app.get('/api/payments/bkash/callback', async (req, res) => {
  const { paymentID, status, orderId } = req.query;
  try {
    if (status !== 'success' || !paymentID) {
      if (orderId) db.updateOrderPayment(orderId, { paymentStatus: 'Payment Cancelled / Failed' });
      return res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(orderId || '')}`);
    }

    const exec = await paymentServices.executeBkashPayment(paymentID);
    const updated = db.updateOrderPayment(orderId, {
      paymentStatus: 'Paid (Verified via bKash)',
      transactionId: exec.trxID,
      senderNumber: exec.customerMsisdn,
      status: 'পেমেন্ট সম্পন্ন ও নিশ্চিত (Confirmed)',
      statusCode: 'processing'
    });

    if (updated) paymentServices.sendOrderEmails(updated).catch(() => {});
    return res.redirect(`/index.html?payment_status=success&orderId=${encodeURIComponent(orderId || '')}&trxId=${encodeURIComponent(exec.trxID)}`);
  } catch (err) {
    console.error('[bKash Callback Error]:', err.message);
    if (orderId) db.updateOrderPayment(orderId, { paymentStatus: 'bKash Verification Failed' });
    return res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(orderId || '')}`);
  }
});

// অফিসিয়াল SSLCommerz কলব্যাকসমূহ (bKash / Nagad / Rocket / Card)
app.post('/api/payments/sslcommerz/success', async (req, res) => {
  const { tran_id, val_id, bank_tran_id, card_type } = req.body || {};
  try {
    const check = await paymentServices.validateSslcommerzTransaction(val_id);
    if (!check.valid) {
      db.updateOrderPayment(tran_id, { paymentStatus: 'Validation Failed' });
      return res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(tran_id || '')}`);
    }

    const trx = bank_tran_id || val_id || tran_id;
    const updated = db.updateOrderPayment(tran_id, {
      paymentMethod: card_type ? `SSLCommerz (${card_type})` : 'SSLCommerz Online Payment',
      paymentStatus: 'Paid (Verified via SSLCommerz)',
      transactionId: trx,
      status: 'পেমেন্ট সম্পন্ন ও নিশ্চিত (Confirmed)',
      statusCode: 'processing'
    });

    if (updated) paymentServices.sendOrderEmails(updated).catch(() => {});
    return res.redirect(`/index.html?payment_status=success&orderId=${encodeURIComponent(tran_id || '')}&trxId=${encodeURIComponent(trx)}`);
  } catch (err) {
    console.error('[SSLCommerz Success Error]:', err.message);
    return res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(tran_id || '')}`);
  }
});

app.post('/api/payments/sslcommerz/fail', (req, res) => {
  const { tran_id } = req.body || {};
  if (tran_id) db.updateOrderPayment(tran_id, { paymentStatus: 'Payment Failed' });
  res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(tran_id || '')}`);
});

app.post('/api/payments/sslcommerz/cancel', (req, res) => {
  const { tran_id } = req.body || {};
  if (tran_id) db.updateOrderPayment(tran_id, { paymentStatus: 'Payment Cancelled' });
  res.redirect(`/index.html?payment_status=cancelled&orderId=${encodeURIComponent(tran_id || '')}`);
});

app.post('/api/payments/sslcommerz/ipn', async (req, res) => {
  const { tran_id, val_id, status } = req.body || {};
  if (status === 'VALID' && val_id) {
    try {
      const check = await paymentServices.validateSslcommerzTransaction(val_id);
      if (check.valid) {
        db.updateOrderPayment(tran_id, { paymentStatus: 'Paid (IPN Verified)', transactionId: val_id });
      }
    } catch (e) {}
  }
  res.json({ received: true });
});

// নতুন অর্ডার তৈরি (COD / Bank Transfer)
app.post('/api/orders', rateLimiter(20, 5 * 60 * 1000), (req, res) => {
  try {
    const { name, phone, email, address, area, items, totalAmount, paymentMethod, paymentStatus, transactionId, senderNumber, notes } = req.body;
    const authUser = getOptionalAuthUser(req);

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করা আবশ্যক।'
      });
    }

    const cleanPhone = String(phone).replace(/[\s-]/g, '').trim();
    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)।'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'অর্ডার করার জন্য কার্টে অন্তত একটি পণ্য থাকতে হবে।'
      });
    }

    const newOrder = db.createOrder({
      userId: authUser ? authUser.id : null,
      customer: {
        name: sanitizeText(name),
        phone: cleanPhone,
        email: sanitizeText(email || (authUser ? authUser.email : '')),
        address: sanitizeText(address),
        area: area || 'dhaka_inside'
      },
      items,
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentStatus || 'Cash on Delivery',
      transactionId: sanitizeText(transactionId || ''),
      senderNumber: sanitizeText(senderNumber || ''),
      notes: sanitizeText(notes || '')
    });

    console.log(`[নতুন অর্ডার সম্পন্ন]: ${newOrder.orderId} - গ্রাহক: ${newOrder.customer.name} (${newOrder.customer.phone}) - মোট: ৳${newOrder.totalAmount}`);

    // রিয়েল জিমেইল অর্ডার কনফার্মেশন ও অ্যাডমিন অ্যালার্ট ইমেইল পাঠানো
    paymentServices.sendOrderEmails(newOrder).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
      order: newOrder
    });
  } catch (error) {
    console.error('[Order Creation Error]:', error);
    res.status(500).json({ success: false, message: 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।' });
  }
});

// কাস্টমারের নিজস্ব অর্ডারসমূহ দেখা (Token User ID, Phone অথবা Email দিয়ে)
app.get('/api/orders/my-orders', (req, res) => {
  try {
    const authUser = getOptionalAuthUser(req);
    const phone = req.query.phone ? String(req.query.phone).replace(/[\s-]/g, '').trim() : (authUser ? authUser.phone : '');
    const email = req.query.email ? String(req.query.email).trim() : (authUser ? authUser.email : '');
    const userId = authUser ? authUser.id : null;

    if (!userId && !phone && !email) {
      return res.status(400).json({ success: false, message: 'মোবাইল নম্বর বা ইমেইল প্রদান করুন।' });
    }

    const orders = db.findOrdersByUser(userId, phone, email);
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'অর্ডার তালিকা লোড ব্যর্থ।' });
  }
});

// অর্ডার ট্র্যাকিং এপিআই (Order Tracking API)
app.get('/api/track/:orderId', (req, res) => {
  try {
    const orderId = req.params.orderId.trim();
    let order = db.findOrderById(orderId);

    // যদি অর্ডার আইডিতে না পাওয়া যায়, ফোনে সার্চ করা
    if (!order && isValidPhone(orderId)) {
      const orders = db.findOrdersByPhone(orderId);
      if (orders.length > 0) order = orders[0];
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'এই অর্ডার নম্বর বা ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি। নম্বরটি পুনরায় পরীক্ষা করুন।'
      });
    }

    // টাইমলাইন স্টেপস ক্যালকুলেট করা
    const steps = [
      { title: 'অর্ডার গৃহীত হয়েছে', time: order.createdAt, completed: true },
      { title: 'প্যাকেজিং ও কোয়ালিটি চেক', time: 'ল্যাব ও ওয়্যারহাউজ', completed: ['processing', 'shipped', 'delivered'].includes(order.statusCode) },
      { title: 'কুরিয়ারে হস্তান্তর', time: order.courier || 'রেডএক্স / স্টিডফাস্ট', completed: ['shipped', 'delivered'].includes(order.statusCode) },
      { title: 'সফলভাবে ডেলিভারি সম্পন্ন', time: 'গন্তব্যে পৌঁছানো', completed: order.statusCode === 'delivered' }
    ];

    res.json({
      success: true,
      order,
      steps
    });
  } catch (error) {
    console.error('[Track Order Error]:', error);
    res.status(500).json({ success: false, message: 'ট্র্যাকিং তথ্য আনতে ব্যর্থ হয়েছে।' });
  }
});

// অ্যাডমিন: সকল অর্ডার দেখা
app.get('/api/admin/orders', (req, res) => {
  const orders = db.getOrders();
  res.json({ success: true, count: orders.length, orders });
});

// অ্যাডমিন: অর্ডার স্ট্যাটাস আপডেট
app.patch('/api/admin/orders/:orderId/status', (req, res) => {
  const { statusCode, statusText, courier, trackingCode } = req.body;
  const updated = db.updateOrderStatus(req.params.orderId, statusCode, statusText, { courier, trackingCode });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'অর্ডারটি পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!', order: updated });
});

// ==========================================
// ১০. যোগাযোগ ফর্ম ও মেসেজ এপিআই (Contact Messages)
// ==========================================
app.post('/api/contact', rateLimiter(10, 10 * 60 * 1000), (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'নাম, মোবাইল নম্বর এবং আপনার বার্তা পূরণ করা আবশ্যক।'
      });
    }

    const cleanPhone = phone.replace(/[\s-]/g, '').trim();
    const newMsg = db.createMessage({
      name: sanitizeText(name),
      phone: cleanPhone,
      email: sanitizeText(email),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    });

    console.log(`[নতুন কাস্টমার মেসেজ]: ${newMsg.name} (${newMsg.phone}) - বিষয়: ${newMsg.subject}`);

    res.status(201).json({
      success: true,
      message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আসবিমার্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে!',
      messageId: newMsg.id
    });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    res.status(500).json({ success: false, message: 'বার্তা পাঠাতে সমস্যা হয়েছে।' });
  }
});

// অ্যাডমিন ড্যাশবোর্ড পরিসংখ্যান
app.get('/api/admin/stats', (req, res) => {
  const orders = db.getOrders();
  const users = db.getUsers();
  const products = db.getProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => o.statusCode === 'pending' || !o.statusCode).length;
  const deliveredOrders = orders.filter(o => o.statusCode === 'delivered').length;

  res.json({
    success: true,
    stats: {
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      totalUsers: users.length,
      totalProducts: products.length
    }
  });
});

// হেলথ চেক
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'AsbiMart Enterprise Backend Engine',
    security: 'HMAC-SHA256 Token Auth, CSP & Rate Limiting Active',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ১১. ফুল পেজ ও স্ট্যাটিক ফ্রন্টএন্ড পরিবেশন (Static & Page Routes)
// ==========================================

// স্ট্যাটিক অ্যাসেট ও HTML ফাইল পরিবেশন (উভয় /page এবং /page.html সরাসরি কাজ করবে + ফাস্ট ক্যাশিং)
app.use('/assets', express.static(path.join(frontendPath, 'assets'), { etag: true, maxAge: '7d' }));
app.use(express.static(frontendPath, {
  etag: true,
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
app.use(express.static(path.join(frontendPath, 'html'), {
  etag: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

// ফুল পেজ রুটসমূহ
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'login.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'profile.html'));
});

app.get('/track-order', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'track-order.html'));
});

app.get('/wishlist', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'wishlist.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'contact.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'about.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'faq.html'));
});

app.get('/category', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'category.html'));
});

app.get('/return-policy', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'return-policy.html'));
});

app.get('/delivery-policy', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'delivery-policy.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'privacy-policy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(frontendPath, 'html', 'terms.html'));
});

// ==========================================
// ১২. ৪MD ও সেন্ট্রালাইজড এরর হ্যান্ডলার (Error Handlers)
// ==========================================

// ৪MD হ্যান্ডলার
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'অনুরোধকৃত API এন্ডপয়েন্টটি পাওয়া যায়নি।'
    });
  }
  // পেজ না পাওয়া গেলে হোমে ফেরত পাঠানো
  res.status(404).sendFile(path.join(frontendPath, 'html', 'index.html'));
});

// গ্লোবাল এরর হ্যান্ডলার
app.use((err, req, res, next) => {
  console.error('[সার্ভার এরর]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'সার্ভারে অভ্যন্তরীণ ত্রুটি দেখা দিয়েছে। কিছু সময় পর পুনরায় চেষ্টা করুন।'
  });
});

// ==========================================
// ১৩. সার্ভার চালু করা (Server Startup)
// ==========================================
app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🌿 AsbiMart (আসবিমার্ট) ফুল-স্ট্যাক সার্ভার সফলভাবে চালু হয়েছে!`);
  console.log(`🌐 মূল ওয়েবসাইট:  http://localhost:${PORT}`);
  console.log(`🔐 লগইন পেজ:      http://localhost:${PORT}/login`);
  console.log(`👤 কাস্টমার প্রোফাইল: http://localhost:${PORT}/profile`);
  console.log(`📦 অর্ডার ট্র্যাকিং: http://localhost:${PORT}/track-order`);
  console.log(`❤️ উইশলিস্ট:       http://localhost:${PORT}/wishlist`);
  console.log(`📞 যোগাযোগ পেজ:   http://localhost:${PORT}/contact`);
  console.log(`🏢 আমাদের সম্পর্কে: http://localhost:${PORT}/about`);
  console.log(`🛡️ অ্যাডমিন প্যানেল: http://localhost:${PORT}/admin`);
  console.log(`⚡ API হেলথ চেক:   http://localhost:${PORT}/api/health`);
  console.log(`============================================================\n`);
});
