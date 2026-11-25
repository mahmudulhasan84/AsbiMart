/**
 * ============================================================================
 * AsbiMart — Real OAuth 2.0 (Google & Facebook) + Real OTP (Email & SMS) Engine
 * ============================================================================
 * - Google OAuth 2.0 Authorization Code Flow (prompt=select_account)
 * - Facebook OAuth 2.0 Graph API v19.0 Flow
 * - Cryptographic 6-digit OTP generation, HMAC-SHA256 hashing, 5-min expiry,
 *   60-sec resend cooldown, max 5 failed attempts protection
 * - Real Email OTP delivery via Nodemailer (Gmail SMTP / Custom SMTP)
 * - Real SMS OTP delivery via BD SMS Gateway (BulkSMSBD / Custom HTTP API)
 */

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const OTP_TTL_MS = 5 * 60 * 1000;       // ৫ মিনিট মেয়াদ
const RESEND_COOLDOWN_MS = 60 * 1000;   // ৬০ সেকেন্ড পর পুনরায় পাঠানো যাবে
const MAX_OTP_ATTEMPTS = 5;             // সর্বোচ্চ ৫ বার ভুল চেষ্টা
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000; // ১০ মিনিট OAuth স্টেট মেয়াদ

// ইন-মেমোরি OTP এবং OAuth CSRF State স্টোর
const otpSessions = new Map();
const oauthStates = new Map();

// নিয়মিত মেয়াদোত্তীর্ণ সেশন ক্লিনআপ
setInterval(() => {
  const now = Date.now();
  for (const [id, sess] of otpSessions.entries()) {
    if (now > sess.expiresAt + 60 * 1000) otpSessions.delete(id);
  }
  for (const [st, info] of oauthStates.entries()) {
    if (now > info.expiresAt) oauthStates.delete(st);
  }
}, 2 * 60 * 1000);

function getSecret() {
  return process.env.AUTH_SECRET || 'asbi_secret_key_super_secure_organic_mart_2026';
}

function getBaseUrl(req) {
  if (req && req.headers) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || (typeof req.get === 'function' ? req.get('host') : req.headers.host);
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      return `${proto}://${host}`;
    }
  }
  if (process.env.BASE_URL && process.env.BASE_URL.trim()) {
    const b = process.env.BASE_URL.trim().replace(/\/+$/, '');
    if (!b.includes('localhost') || process.env.NODE_ENV !== 'production') {
      return b;
    }
  }
  if (req && req.headers) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || (typeof req.get === 'function' ? req.get('host') : req.headers.host);
    if (host) return `${proto}://${host}`;
  }
  return `http://localhost:${process.env.PORT || 5000}`;
}

function isConfigured(val) {
  if (!val) return false;
  const v = String(val).trim();
  if (!v) return false;
  if (v.startsWith('your_') || v.includes('REPLACE_ME')) return false;
  return true;
}

function getAuthProvidersStatus(req) {
  const baseUrl = getBaseUrl(req);
  const auth0 = isConfigured(process.env.AUTH0_DOMAIN) && isConfigured(process.env.AUTH0_CLIENT_ID);
  const google = isConfigured(process.env.GOOGLE_CLIENT_ID) && isConfigured(process.env.GOOGLE_CLIENT_SECRET);
  const facebook = isConfigured(process.env.FACEBOOK_APP_ID) && isConfigured(process.env.FACEBOOK_APP_SECRET);
  const emailOtp = isConfigured(process.env.SMTP_USER) && isConfigured(process.env.SMTP_PASS);
  const smsOtp = isConfigured(process.env.SMS_API_KEY) && isConfigured(process.env.SMS_API_URL);

  return {
    auth0,
    google,
    facebook,
    emailOtp,
    smsOtp,
    baseUrl,
    callbacks: {
      auth0: `${baseUrl}/api/auth/auth0/callback`,
      google: `${baseUrl}/api/auth/google/callback`,
      facebook: `${baseUrl}/api/auth/facebook/callback`
    }
  };
}

// ==========================================
// OAuth CSRF State টোকেন ব্যবস্থাপনা
// ==========================================
function createOAuthState(provider, returnTo = 'index.html') {
  const state = crypto.randomBytes(24).toString('hex');
  oauthStates.set(state, {
    provider,
    returnTo,
    expiresAt: Date.now() + OAUTH_STATE_TTL_MS
  });
  return state;
}

function verifyAndConsumeOAuthState(state, expectedProvider) {
  if (!state || !oauthStates.has(state)) return null;
  const data = oauthStates.get(state);
  oauthStates.delete(state);
  if (Date.now() > data.expiresAt) return null;
  if (data.provider !== expectedProvider) return null;
  return data;
}

// ==========================================
// ১. রিয়েল Google OAuth 2.0 লজিক
// ==========================================
function buildGoogleAuthUrl(req, returnTo = 'index.html') {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
  const state = createOAuthState('google', returnTo);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account', // সবসময় আসল গুগল অ্যাকাউন্ট বাছাইয়ের স্ক্রিন দেখাবে
    state
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeGoogleCodeForProfile(req, code) {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Google token exchange failed');
  }

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const profile = await profileRes.json();
  if (!profileRes.ok || !profile.sub) {
    throw new Error('Failed to fetch Google user profile');
  }

  return {
    provider: 'google',
    providerId: String(profile.sub),
    name: profile.name || (profile.email ? profile.email.split('@')[0] : 'Google User'),
    email: profile.email || '',
    emailVerified: !!profile.email_verified,
    avatar: profile.picture || ''
  };
}

// ==========================================
// ২. রিয়েল Facebook OAuth 2.0 লজিক
// ==========================================
function buildFacebookAuthUrl(req, returnTo = 'index.html') {
  const appId = (process.env.FACEBOOK_APP_ID || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/facebook/callback`;
  const state = createOAuthState('facebook', returnTo);

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'public_profile,email',
    auth_type: 'rerequest',
    state
  });

  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

async function exchangeFacebookCodeForProfile(req, code) {
  const appId = (process.env.FACEBOOK_APP_ID || '').trim();
  const appSecret = (process.env.FACEBOOK_APP_SECRET || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/facebook/callback`;

  const tokenParams = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code
  });

  const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`);
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error((tokenData.error && tokenData.error.message) || 'Facebook token exchange failed');
  }

  const profileParams = new URLSearchParams({
    fields: 'id,name,email,picture.type(large)',
    access_token: tokenData.access_token
  });

  const profileRes = await fetch(`https://graph.facebook.com/v19.0/me?${profileParams.toString()}`);
  const profile = await profileRes.json();
  if (!profileRes.ok || !profile.id) {
    throw new Error((profile.error && profile.error.message) || 'Failed to fetch Facebook user profile');
  }

  return {
    provider: 'facebook',
    providerId: String(profile.id),
    name: profile.name || 'Facebook User',
    email: profile.email || '',
    emailVerified: !!profile.email,
    avatar: (profile.picture && profile.picture.data && profile.picture.data.url) ? profile.picture.data.url : ''
  };
}

// ==========================================
// ৩. রিয়েল Email (Nodemailer Gmail SMTP) & SMS OTP ডেলিভারি
// ==========================================
function hashOtp(sessionId, otpCode) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(`${sessionId}:${String(otpCode).trim()}`)
    .digest('hex');
}

function generateSixDigitOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0] || '*'}***@${domain}`;
  return `${local.slice(0, 2)}${'*'.repeat(Math.min(5, local.length - 2))}${local.slice(-1)}@${domain}`;
}

function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone || '';
  return `${phone.slice(0, 3)}*****${phone.slice(-3)}`;
}

async function sendEmailOtp(toEmail, otpCode, userName) {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();
  const fromName = (process.env.SMTP_FROM_NAME || 'AsbiMart Security').trim();

  if (!isConfigured(user) || !isConfigured(pass)) {
    const err = new Error('SMTP credentials not configured in backend/.env');
    err.code = 'EMAIL_OTP_NOT_CONFIGURED';
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const safeName = String(userName || 'Valued Customer').replace(/[<>]/g, '');

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #F4ECE1; padding: 28px; border-radius: 18px; border: 1px solid #E5DACB;">
      <div style="background: #1E3A8A; color: #ffffff; padding: 22px 24px; border-radius: 14px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">Asbi<span style="color: #F59E0B;">Mart</span></h1>
        <p style="margin: 6px 0 0; font-size: 12px; color: #BFDBFE;">Account Verification One-Time Password (OTP)</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border-radius: 14px; margin-top: 16px; border: 1px solid #E5DACB; text-align: center;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #334155;">Hello <strong>${safeName}</strong>,</p>
        <p style="margin: 0 0 18px; font-size: 13px; color: #475569; line-height: 1.6;">
          Use the 6-digit verification code below to complete your AsbiMart account registration:
        </p>
        <div style="display: inline-block; background: #F8FAFC; border: 2px dashed #1E3A8A; border-radius: 12px; padding: 14px 28px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1E3A8A;">
          ${otpCode}
        </div>
        <p style="margin: 18px 0 0; font-size: 12px; color: #64748B;">
          This code expires in <strong>5 minutes</strong>. Never share your OTP with anyone.
        </p>
      </div>
      <p style="text-align: center; font-size: 11px; color: #64748B; margin: 16px 0 0;">
        © 2026 AsbiMart • Satarkul, Badda, Dhaka, Bangladesh • Hotline: 01821-296056
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to: toEmail,
    subject: `${otpCode} is your AsbiMart Verification OTP`,
    text: `Hello ${safeName}, your AsbiMart account verification OTP code is ${otpCode}. It is valid for 5 minutes. Do not share this code with anyone.`,
    html: htmlBody
  });

  return { channel: 'email', maskedTarget: maskEmail(toEmail) };
}

async function sendSmsOtp(toPhone, otpCode) {
  const apiUrl = (process.env.SMS_API_URL || '').trim();
  const apiKey = (process.env.SMS_API_KEY || '').trim();
  const senderId = (process.env.SMS_SENDER_ID || '').trim();
  const provider = (process.env.SMS_PROVIDER || 'bulksmsbd').toLowerCase();

  if (!isConfigured(apiUrl) || !isConfigured(apiKey)) {
    const err = new Error('SMS gateway credentials not configured in backend/.env');
    err.code = 'SMS_OTP_NOT_CONFIGURED';
    throw err;
  }

  // বাংলাদেশি নাম্বার 8801XXXXXXXXX ফরম্যাটে নেওয়া
  const clean = toPhone.replace(/[\s-+()]/g, '');
  const normalizedPhone = clean.startsWith('88') ? clean : `88${clean}`;
  const message = `Your AsbiMart verification OTP is ${otpCode}. Valid for 5 minutes. Never share this code.`;

  // ১. Textbee REST API সাপোর্ট (ফ্রি অ্যান্ড্রয়েড গেটওয়ে)
  if (provider === 'textbee' || apiUrl.includes('textbee')) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        recipients: [normalizedPhone],
        message
      })
    });
    if (!res.ok) {
      throw new Error(`Textbee API error HTTP ${res.status}`);
    }
    return { channel: 'sms', maskedTarget: maskPhone(toPhone) };
  }

  // ২. BD Bulk SMS / Alpha Net / GotiSMS সাধারণ GET/POST এপিআই
  const params = new URLSearchParams({
    api_key: apiKey,
    type: 'text',
    number: normalizedPhone,
    senderid: senderId || 'AsbiMart',
    message
  });

  const smsRes = await fetch(`${apiUrl}?${params.toString()}`, { method: 'GET' });
  if (!smsRes.ok) {
    throw new Error(`SMS gateway responded with HTTP ${smsRes.status}`);
  }

  return { channel: 'sms', maskedTarget: maskPhone(toPhone) };
}

async function createAndSendOtpSession({ channel, payload }) {
  const sessionId = 'otp_' + crypto.randomBytes(16).toString('hex');
  const otpCode = generateSixDigitOtp();
  const now = Date.now();

  let deliveryResult;
  if (channel === 'sms') {
    deliveryResult = await sendSmsOtp(payload.phone, otpCode);
  } else {
    deliveryResult = await sendEmailOtp(payload.email, otpCode, payload.name);
  }

  otpSessions.set(sessionId, {
    sessionId,
    channel: deliveryResult.channel,
    maskedTarget: deliveryResult.maskedTarget,
    otpHash: hashOtp(sessionId, otpCode),
    payload,
    attempts: 0,
    createdAt: now,
    resendAvailableAt: now + RESEND_COOLDOWN_MS,
    expiresAt: now + OTP_TTL_MS
  });

  return {
    otpSessionId: sessionId,
    channel: deliveryResult.channel,
    maskedTarget: deliveryResult.maskedTarget,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    resendCooldownSeconds: Math.floor(RESEND_COOLDOWN_MS / 1000)
  };
}

async function resendOtpForSession(sessionId) {
  const session = otpSessions.get(sessionId);
  if (!session) {
    const err = new Error('Verification session expired. Please submit your registration details again.');
    err.status = 404;
    throw err;
  }

  const now = Date.now();
  if (now < session.resendAvailableAt) {
    const waitSec = Math.ceil((session.resendAvailableAt - now) / 1000);
    const err = new Error(`Please wait ${waitSec} seconds before requesting a new OTP.`);
    err.status = 429;
    err.waitSeconds = waitSec;
    throw err;
  }

  const newOtpCode = generateSixDigitOtp();
  if (session.channel === 'sms') {
    await sendSmsOtp(session.payload.phone, newOtpCode);
  } else {
    await sendEmailOtp(session.payload.email, newOtpCode, session.payload.name);
  }

  session.otpHash = hashOtp(sessionId, newOtpCode);
  session.attempts = 0;
  session.resendAvailableAt = now + RESEND_COOLDOWN_MS;
  session.expiresAt = now + OTP_TTL_MS;

  return {
    otpSessionId: sessionId,
    channel: session.channel,
    maskedTarget: session.maskedTarget,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    resendCooldownSeconds: Math.floor(RESEND_COOLDOWN_MS / 1000)
  };
}

function verifyAndConsumeOtpSession(sessionId, otpCode) {
  const session = otpSessions.get(sessionId);
  if (!session) {
    return { ok: false, status: 400, message: 'Verification session not found or expired. Please request a new OTP.' };
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(sessionId);
    return { ok: false, status: 400, message: 'OTP code has expired. Please request a new OTP.' };
  }

  const cleanCode = String(otpCode || '').replace(/\s+/g, '').trim();
  if (!/^\d{6}$/.test(cleanCode)) {
    return { ok: false, status: 400, message: 'Please enter a valid 6-digit OTP code.' };
  }

  const candidateHash = hashOtp(sessionId, cleanCode);
  const expectedBuf = Buffer.from(session.otpHash, 'hex');
  const candidateBuf = Buffer.from(candidateHash, 'hex');

  const isMatch =
    expectedBuf.length === candidateBuf.length &&
    crypto.timingSafeEqual(expectedBuf, candidateBuf);

  if (!isMatch) {
    session.attempts += 1;
    const remaining = MAX_OTP_ATTEMPTS - session.attempts;
    if (remaining <= 0) {
      otpSessions.delete(sessionId);
      return { ok: false, status: 400, message: 'Too many incorrect OTP attempts. Please request a new OTP.' };
    }
    return { ok: false, status: 401, message: `Invalid OTP code. ${remaining} attempt(s) remaining.` };
  }

  // সঠিক OTP — একবার ব্যবহারের পর মুছে ফেলা (One-Time Use)
  otpSessions.delete(sessionId);
  return {
    ok: true,
    channel: session.channel,
    payload: session.payload
  };
}

// ==========================================
// ৩. রিয়েল Auth0 OAuth 2.0 / Universal Login লজিক
// ==========================================
function buildAuth0Url(req, returnTo = 'index.html') {
  const domain = (process.env.AUTH0_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const clientId = (process.env.AUTH0_CLIENT_ID || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/auth0/callback`;
  const state = createOAuthState('auth0', returnTo);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state
  });

  return `https://${domain}/authorize?${params.toString()}`;
}

async function exchangeAuth0CodeForProfile(req, code) {
  const domain = (process.env.AUTH0_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const clientId = (process.env.AUTH0_CLIENT_ID || '').trim();
  const clientSecret = (process.env.AUTH0_CLIENT_SECRET || '').trim();
  const redirectUri = `${getBaseUrl(req)}/api/auth/auth0/callback`;

  const tokenRes = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Auth0 token exchange failed');
  }

  const profileRes = await fetch(`https://${domain}/userinfo`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const profile = await profileRes.json();
  if (!profileRes.ok || !profile.sub) {
    throw new Error('Failed to retrieve user profile from Auth0');
  }

  return {
    provider: 'auth0',
    providerId: profile.sub,
    email: profile.email || '',
    name: profile.name || profile.nickname || 'Auth0 User',
    avatar: profile.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    emailVerified: !!profile.email_verified
  };
}

module.exports = {
  getAuthProvidersStatus,
  verifyAndConsumeOAuthState,
  buildGoogleAuthUrl,
  exchangeGoogleCodeForProfile,
  buildFacebookAuthUrl,
  exchangeFacebookCodeForProfile,
  buildAuth0Url,
  exchangeAuth0CodeForProfile,
  createAndSendOtpSession,
  resendOtpForSession,
  verifyAndConsumeOtpSession
};
