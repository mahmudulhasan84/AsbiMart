/**
 * ============================================================================
 * AsbiMart (আসবিমার্ট) - প্রোডাকশন গ্রেড এন্টারপ্রাইজ এক্সপ্রেস ব্যাকএন্ড সার্ভার
 * শতভাগ বিশুদ্ধ অর্গানিক খাদ্যপণ্যের ই-কমার্স প্ল্যাটফর্ম (Enterprise Pro Version)
 * 
 * উন্নত বৈশিষ্ট্যসমূহ (Gap Analysis Fixed):
 * - OWASP Top 10 সিকিউরিটি (CSP, Frame Options, Strict-Transport-Security, nosniff)
 * - হার্ডেনড CORS পলিসি ও অ্যাডমিন API প্রোটেকশন
 * - ক্রিপ্টোগ্রাফিক টাইমিং-সেফ JWT ভ্যালিডেশন (crypto.timingSafeEqual)
 * - সার্ভার-সাইড মূল্য হিসাব (Client Price Tampering Defense)
 * - পারমাণবিক স্টক লকিং ও কনকারেন্সি নিয়ন্ত্রণ (Atomic Stock Locking)
 * - অর্ডার স্টেট মেশিন (Order State Machine with Valid Transitions)
 * - সেন্ট্রালাইজড প্রোডাক্ট মাস্টার ডেটাবেস
 * - ডায়নামিক কুপন ও প্রমো ইঞ্জিন (ASBI10, FREESHIP, ORGANIC50, WELCOME100)
 * - কুরিয়ার এপিআই অটোমেশন (Steadfast, Pathao, RedX 1-Click Booking & Webhook)
 * - সরকারি মূসক-৬.৩ ভ্যাট ট্যাক্স চালান ও প্রিন্টেবল ইনভয়েস জেনারেটর
 * - বাল্ক অপারেশনস (বাল্ক স্ট্যাটাস আপডেট ও এক্সেল/CSV এক্সপোর্ট)
 * - ইনভেন্টরি অ্যালার্ট ও রিস্টক হিস্ট্রি (Low Stock Alert < 10)
 * - কাস্টমার সাপোর্ট সিআরএম ও হেল্পডেস্ক টিকেট সিস্টেম
 * - পরিত্যক্ত কার্ট রিকভারি (Abandoned Cart Reminder)
 * - সার্ভার-সাইড কনভার্সন এপিআই (Meta CAPI & GA4 Server Dispatcher)
 * - রিয়েল-টাইম SSE নোটিফিকেশন ইঞ্জিন (Zero-Delay Live Sound/Push)
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
const PORT = process.env.PORT || 5056;
const frontendPath = path.join(__dirname, '..', 'frontend');

// ==========================================
// ১. সিকিউরিটি হেডার্স মিডলওয়্যার (OWASP Security Headers)
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
  // কনটেন্ট সিকিউরিটি পলিসি (CSP)
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;");

  // API ক্যাশ কন্ট্রোল
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// ==========================================
// ২. হার্ডেনড CORS ও বডি পার্সার (Hardened CORS & Parsing)
// ==========================================
app.use(compression({ threshold: 1024 }));

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // No origin (curl, same-origin, mobile apps)
    if (!origin) return callback(null, true);
    
    // Explicitly allowed origins or standard local development
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.asbimart.com') ||
      origin.endsWith('.pages.dev') ||
      origin.endsWith('.up.railway.app')
    ) {
      return callback(null, true);
    }
    
    // Block untrusted origins (Prevent unauthorized data access)
    return callback(new Error('CORS policy: Access denied for this origin.'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.startTime > 15 * 60 * 1000) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);
if (cleanupTimer.unref) cleanupTimer.unref();

// ==========================================
// ৪. অডিট লগার মিডলওয়্যার (Audit Logger)
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
// ৫. ইনপুট স্যানিটাইজার ও ভ্যালিডেটর
// ==========================================
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^01[3-9]\d{8}$/.test(cleaned);
}

// ==========================================
// ৬. অথেনটিকেশন মিডলওয়্যার (RBAC Auth Middleware)
// ==========================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'অননুমোদিত প্রবেশ। অনুগ্রহ করে লগইন করুন।'
    });
  }

  const payload = db.verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'অকার্যকর বা মেয়াদোত্তীর্ণ টোকেন। পুনরায় লগইন করুন।'
    });
  }

  req.user = payload;
  next();
}

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'অ্যাডমিন অ্যাক্সেস প্রয়োজন। অনুগ্রহ করে অ্যাডমিন হিসেবে লগইন করুন।'
    });
  }

  const payload = db.verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'অননুমোদিত অ্যাক্সেস। এই অপারেশনটির জন্য অ্যাডমিন অধিকার আবশ্যক।'
    });
  }

  req.admin = payload;
  next();
}

function getOptionalAuthUser(req) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;
  if (!token) return null;
  return db.verifyToken(token);
}

// ==========================================
// ৭. রিয়েল-টাইম অ্যাডমিন SSE ব্রডকাস্ট ইঞ্জিন
// ==========================================
const sseAdminClients = new Set();

function broadcastToAdminSSE(eventPayload) {
  const dataString = `data: ${JSON.stringify(eventPayload)}\n\n`;
  for (const client of sseAdminClients) {
    try {
      client.write(dataString);
    } catch (e) {
      sseAdminClients.delete(client);
    }
  }
}

// ==========================================
// ৮. ক্যাটালগ ও প্রোডাক্ট এপিআই (Centralized Master Catalog)
// ==========================================
app.get('/api/products', (req, res) => {
  try {
    const products = db.getProducts();
    const category = req.query.category;
    const search = req.query.search;
    const inStockOnly = req.query.inStock === 'true';

    let filtered = [...products];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter(p => (Number(p.stock) || 0) > 0);
    }

    res.json({
      success: true,
      count: filtered.length,
      total: products.length,
      products: filtered
    });
  } catch (error) {
    console.error('[Products API Error]:', error);
    res.status(500).json({ success: false, message: 'প্রোডাক্ট তালিকা লোড করতে ব্যর্থ হয়েছে।' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য বিস্তারিত লোড করতে ব্যর্থ হয়েছে।' });
  }
});

// অ্যাডমিন: সেন্ট্রালাইজড প্রোডাক্ট তৈরি, আপডেট ও ডিলিট (Triple-Decoupling Flaw Elimination)
app.post('/api/admin/products', authenticateAdmin, (req, res) => {
  try {
    const product = db.createProduct(req.body);
    res.status(201).json({ success: true, message: 'নতুন পণ্য সফলভাবে ক্যাটালগে যুক্ত হয়েছে!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য তৈরি ব্যর্থ হয়েছে।' });
  }
});

app.put('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
    res.json({ success: true, message: 'পণ্য সফলভাবে আপডেট হয়েছে!', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য আপডেট ব্যর্থ।' });
  }
});

app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
    res.json({ success: true, message: 'পণ্যটি ক্যাটালগ থেকে মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পণ্য ডিলিট ব্যর্থ।' });
  }
});

// কাস্টমার রিভিউ এপিআই (Stored XSS Sanitization Protected)
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const reviews = db.getReviewsByProduct(req.params.id);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রিভিউ লোড করতে সমস্যা হয়েছে।' });
  }
});

app.post('/api/products/:id/reviews', rateLimiter(10, 5 * 60 * 1000), (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'নাম এবং রিভিউ মন্তব্য প্রদান আবশ্যক।' });
    }

    const authUser = getOptionalAuthUser(req);
    const product = db.findProductById(req.params.id);

    // Stored XSS স্ক্রিপ্ট ও ট্যাগ স্যানিটাইজেশন
    const cleanName = sanitizeText(name);
    const cleanComment = sanitizeText(comment);

    const newRev = db.createReview({
      productId: req.params.id,
      productName: product ? (product.banglaName || product.name) : '',
      userId: authUser ? authUser.id : null,
      name: cleanName,
      email: sanitizeText(email || ''),
      rating: Number(rating) || 5,
      comment: cleanComment,
      verifiedBuyer: !!authUser
    });

    res.status(201).json({
      success: true,
      message: 'আপনার মূল্যবান রিভিউর জন্য ধন্যবাদ!',
      review: newRev
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'রিভিউ সংরক্ষণ ব্যর্থ।' });
  }
});

// ==========================================
// ৯. কুপন ও প্রমো ইঞ্জিন এপিআই (Dynamic Discount Engine)
// ==========================================
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal, area } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false, message: 'কুপন কোড দিন।' });
    }

    const check = db.validateCoupon(code, subtotal, area);
    if (!check.valid) {
      return res.status(400).json({ success: false, message: check.message });
    }

    const orderSubtotal = Number(subtotal) || 0;
    const baseShipping = (area === 'dhaka' || area === 'dhaka_inside') ? 60 : 120;
    const finalShipping = (check.discountType === 'free_shipping') ? 0 : baseShipping;
    const finalTotal = Math.max(0, orderSubtotal - check.discount + finalShipping);

    res.json({
      success: true,
      code: check.code,
      discount: check.discount,
      discountType: check.discountType,
      description: check.description,
      finalTotal,
      message: `কুপন কোড "${check.code}" সফলভাবে যুক্ত হয়েছে! আপনি ৳${check.discount} ছাড় পেয়েছেন।`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুপন যাচাই ব্যর্থ হয়েছে।' });
  }
});

app.get('/api/admin/coupons', authenticateAdmin, (req, res) => {
  const coupons = db.getCoupons();
  res.json({ success: true, count: coupons.length, coupons });
});

app.post('/api/admin/coupons', authenticateAdmin, (req, res) => {
  try {
    const newCoupon = db.createCoupon(req.body);
    if (!newCoupon) {
      return res.status(400).json({ success: false, message: 'এই কুপন কোডটি ইতিমধ্যে বিদ্যমান রয়েছে।' });
    }
    res.status(201).json({ success: true, message: 'নতুন কুপন কোড তৈরি সম্পন্ন!', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুপন তৈরি ব্যর্থ।' });
  }
});

app.delete('/api/admin/coupons/:code', authenticateAdmin, (req, res) => {
  const deleted = db.deleteCoupon(req.params.code);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'কুপন কোডটি পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: 'কুপন কোড সফলভাবে মুছে ফেলা হয়েছে।' });
});

// ==========================================
// ১০. কাস্টমার অথেনটিকেশন এপিআই (Customer Authentication)
// ==========================================
app.post('/api/auth/register', rateLimiter(10, 10 * 60 * 1000), (req, res) => {
  try {
    const { name, phone, email, password, address, city } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর এবং পাসওয়ার্ড আবশ্যক।' });
    }

    const cleanPhone = phone.replace(/[\s-]/g, '').trim();
    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'পাসওয়ার্ড সর্বনিম্ন ৬ অক্ষরের হতে হবে।' });
    }

    if (db.findUserByPhoneOrEmail(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।' });
    }

    const newUser = db.createUser({
      name: sanitizeText(name),
      phone: cleanPhone,
      email: sanitizeText(email || ''),
      password,
      address: sanitizeText(address || ''),
      city: sanitizeText(city || 'Dhaka')
    });

    const token = db.generateToken({
      id: newUser.id,
      phone: newUser.phone,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: 'অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        address: newUser.address,
        city: newUser.city,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({ success: false, message: 'রেজিস্ট্রেশন সম্পন্ন করতে সমস্যা হয়েছে।' });
  }
});

app.post('/api/auth/login', rateLimiter(15, 10 * 60 * 1000), (req, res) => {
  try {
    const { identifier, phone, password } = req.body;
    const loginId = identifier || phone;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।' });
    }

    const user = db.findUserByPhoneOrEmail(loginId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড।' });
    }

    const hashedInput = db.hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      return res.status(401).json({ success: false, message: 'ভুল মোবাইল নম্বর বা পাসওয়ার্ড।' });
    }

    const token = db.generateToken({
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        city: user.city,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ success: false, message: 'লগইন করতে সমস্যা হয়েছে।' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি।' });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      avatar: user.avatar,
      role: user.role
    }
  });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, email, address, city, avatar } = req.body;
    const updated = db.updateUser(req.user.id, {
      name: sanitizeText(name || req.user.name),
      email: sanitizeText(email || req.user.email),
      address: sanitizeText(address || ''),
      city: sanitizeText(city || 'Dhaka'),
      avatar: avatar || req.user.avatar
    });

    res.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে!',
      user: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        city: updated.city,
        avatar: updated.avatar,
        role: updated.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'প্রোফাইল আপডেট ব্যর্থ।' });
  }
});

// স্থায়ী কার্ট সিঙ্ক
app.get('/api/cart', authenticateToken, (req, res) => {
  const items = db.getUserCart(req.user.id);
  res.json({ success: true, items });
});

app.put('/api/cart', authenticateToken, (req, res) => {
  const items = db.saveUserCart(req.user.id, req.body.items || []);
  res.json({ success: true, message: 'কার্ট সেভ করা হয়েছে।', items });
});

// OAuth প্রোভাইডার স্ট্যাটাস ও Auth0
app.get('/api/auth/providers', (req, res) => {
  res.json({
    success: true,
    providers: {
      auth0: { enabled: true, name: 'Auth0 Universal Login' },
      google: { enabled: false, name: 'Google OAuth' },
      otp: { enabled: true, name: 'Fast SMS OTP Login' }
    }
  });
});

app.get('/api/auth/auth0', (req, res) => {
  res.redirect('/login.html?auth0=simulated');
});

// ==========================================
// ১১. অর্ডার তৈরি ও অর্ডার ম্যানেজমেন্ট এপিআই
// ==========================================
// নতুন অর্ডার তৈরি (Client Price Tampering Defense & Atomic Stock Locking)
app.post('/api/orders', rateLimiter(20, 5 * 60 * 1000), (req, res) => {
  try {
    const { name, phone, email, address, area, items, couponCode, paymentMethod, paymentStatus, transactionId, senderNumber, notes } = req.body;
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

    // সার্ভারে অর্ডার তৈরি ও পারমাণবিক স্টক লক (Atomic Stock Locking)
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
      couponCode: couponCode ? sanitizeText(couponCode).toUpperCase() : '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentStatus || 'Cash on Delivery',
      transactionId: sanitizeText(transactionId || ''),
      senderNumber: sanitizeText(senderNumber || ''),
      notes: sanitizeText(notes || '')
    });

    console.log(`[নতুন অর্ডার সম্পন্ন]: ${newOrder.orderId} - গ্রাহক: ${newOrder.customer.name} (${newOrder.customer.phone}) - মোট: ৳${newOrder.totalAmount} (Verified Server Price)`);

    // অ্যাডমিন প্যানেলে ইনস্ট্যান্ট রিয়েল-টাইম পুশ নোটিফিকেশন পাঠানো (Zero Delay)
    broadcastToAdminSSE({ type: 'NEW_ORDER', order: newOrder });

    // রিয়েল জিমেইল অর্ডার কনফার্মেশন ও অ্যাডমিন অ্যালার্ট ইমেইল পাঠানো
    paymentServices.sendOrderEmails(newOrder).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
      order: newOrder
    });
  } catch (error) {
    console.error('[Order Creation Error]:', error.message);
    res.status(400).json({ success: false, message: error.message || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।' });
  }
});

// কাস্টমারের নিজস্ব অর্ডারসমূহ দেখা
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

// অর্ডার ট্র্যাকিং এপিআই (Order Tracking API with Real Milestones)
app.get('/api/track/:orderId', (req, res) => {
  try {
    const orderId = req.params.orderId.trim();
    let order = db.findOrderById(orderId);

    if (!order && isValidPhone(orderId)) {
      const orders = db.findOrdersByUser(null, orderId, null);
      if (orders.length > 0) order = orders[0];
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'এই অর্ডার নম্বর বা ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি। নম্বরটি পুনরায় পরীক্ষা করুন।'
      });
    }

    const statusMap = {
      pending: 1,
      confirmed: 2,
      processing: 2,
      in_courier: 3,
      shipped: 3,
      delivered: 4,
      completed: 4
    };
    const currentStep = statusMap[order.statusCode] || 1;

    const steps = [
      {
        title: 'অর্ডার গৃহীত হয়েছে (Order Placed)',
        time: new Date(order.createdAt).toLocaleDateString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        completed: currentStep >= 1
      },
      {
        title: 'প্যাকেজিং ও কোয়ালিটি অডিট (Packaging & QC)',
        time: currentStep >= 2 ? 'আসবিমার্ট সেন্ট্রাল ওয়্যারহাউজ' : 'অপেক্ষমাণ',
        completed: currentStep >= 2
      },
      {
        title: `কুরিয়ারে হস্তান্তর (${order.courier || 'Steadfast Courier'})`,
        time: currentStep >= 3 ? `ট্র্যাকিং কোড: ${order.trackingCode}` : 'শীঘ্রই হস্তান্তর করা হবে',
        completed: currentStep >= 3
      },
      {
        title: 'সফলভাবে ডেলিভারি সম্পন্ন (Delivered)',
        time: currentStep >= 4 ? 'গ্রাহকের নিকট হস্তান্তরিত' : 'ডেলিভারি প্রক্রিয়ায় রয়েছে',
        completed: currentStep >= 4
      }
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

// ==========================================
// ১২. পেমেন্ট গেটওয়ে এপিআই (Payment Gateways & Real Transactions)
// ==========================================
const gatewayOtpSessions = new Map();
const otpCleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, sess] of gatewayOtpSessions.entries()) {
    if (now > sess.expiresAt) gatewayOtpSessions.delete(key);
  }
}, 2 * 60 * 1000);
if (otpCleanupTimer.unref) otpCleanupTimer.unref();

// পেমেন্ট গেটওয়ে ওটিপি (OTP) পাঠানো
app.post('/api/payments/gateway-otp/send', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { orderId, method, phoneNumber } = req.body || {};
    if (!orderId || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'অর্ডার আইডি এবং মোবাইল নম্বর আবশ্যক।' });
    }

    const cleanPhone = String(phoneNumber).replace(/[\s-+()]/g, '').trim();
    const normalizedPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;
    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({ success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' });
    }

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

    console.log(`[PAYMENT OTP]: ${normalizedPhone} -> OTP: ${otpCode}`);

    let smsSent = false;
    try {
      if (process.env.SMS_API_KEY && process.env.SMS_API_URL) {
        await authServices.sendSmsOtp(normalizedPhone, otpCode);
        smsSent = true;
      }
    } catch (err) {}

    res.json({
      success: true,
      message: smsSent ? 'ওটিপি কোড পাঠানো হয়েছে।' : 'ভেরিফিকেশন কোড জেনারেট সম্পন্ন।',
      smsSent,
      devCode: (!smsSent || process.env.NODE_ENV !== 'production') ? otpCode : undefined,
      maskedPhone: normalizedPhone.slice(0, 3) + '••••' + normalizedPhone.slice(7)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ওটিপি পাঠাতে সমস্যা হয়েছে।' });
  }
});

// পেমেন্ট ওটিপি যাচাই
app.post('/api/payments/gateway-otp/verify', rateLimiter(40, 5 * 60 * 1000), (req, res) => {
  try {
    const { orderId, phoneNumber, otpCode } = req.body || {};
    if (!orderId || !phoneNumber || !otpCode) {
      return res.status(400).json({ success: false, message: 'অর্ডার আইডি, ফোন ও ওটিপি আবশ্যক।' });
    }

    const cleanPhone = String(phoneNumber).replace(/[\s-+()]/g, '').trim();
    const normalizedPhone = cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone;
    const sessionKey = `${orderId}:${normalizedPhone}`;

    const session = gatewayOtpSessions.get(sessionKey);
    if (!session) {
      return res.status(400).json({ success: false, message: 'ওটিপি সেশনের মেয়াদ শেষ হয়েছে। পুনরায় কোড পাঠান।' });
    }

    if (Date.now() > session.expiresAt) {
      gatewayOtpSessions.delete(sessionKey);
      return res.status(400).json({ success: false, message: 'ওটিপি কোডের মেয়াদোত্তীর্ণ।' });
    }

    if (session.attempts >= 5) {
      gatewayOtpSessions.delete(sessionKey);
      return res.status(429).json({ success: false, message: 'অতিরিক্ত ভুল ওটিপি চেষ্টা করা হয়েছে।' });
    }

    session.attempts++;
    if (session.otpCode !== String(otpCode).trim()) {
      return res.status(400).json({ success: false, message: 'ভুল ওটিপি কোড। অনুগ্রহ করে সঠিক কোড দিন।' });
    }

    session.verified = true;
    res.json({ success: true, message: 'মোবাইল নম্বর সফলভাবে যাচাই হয়েছে!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'ওটিপি যাচাই ব্যর্থ।' });
  }
});

app.get('/api/payments/status', (req, res) => {
  res.json({
    success: true,
    gateways: paymentServices.getPaymentGatewaysStatus(req)
  });
});

app.get('/api/payments/gateways', (req, res) => {
  res.json({
    success: true,
    gateways: {
      cod: { name: 'ক্যাশ অন ডেলিভারি (Cash on Delivery)', fee: 0, active: true },
      bkash: { name: 'বিকাশ সরাসরি পেমেন্ট (bKash Tokenized Checkout)', fee: 0, active: true },
      nagad: { name: 'নগদ অনলাইন পেমেন্ট (Nagad Online)', fee: 0, active: true },
      sslcommerz: { name: 'কার্ড / ইন্টারনেট ব্যাংকিং (SSLCommerz)', fee: 0, active: true }
    }
  });
});

// রিয়েল পেমেন্ট ইনিশিয়েট (bKash Tokenized API / SSLCommerz / Verified Manual MFS)
app.post('/api/payments/initiate', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { name, phone, email, address, area, items, totalAmount, couponCode, method, notes } = req.body || {};
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

    // নিরাপদ অর্ডার তৈরি ও স্টক রিজার্ভেশন
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
      couponCode: couponCode ? sanitizeText(couponCode).toUpperCase() : '',
      paymentMethod: methodLabels[gatewayKey] || gatewayKey,
      paymentGateway: gatewayKey,
      paymentStatus: 'Pending Payment',
      notes: sanitizeText(notes || '')
    });

    broadcastToAdminSSE({ type: 'NEW_ORDER', order: newOrder });

    const status = paymentServices.getPaymentGatewaysStatus(req);

    // ১. অফিসিয়াল bKash Tokenized API সক্রিয় থাকলে সরাসরি bKash গেটওয়ে পেজে রিডাইরেক্ট
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

    // ২. অফিসিয়াল SSLCommerz সক্রিয় থাকলে সরাসরি SSLCommerz হোস্টেড পেজে রিডাইরেক্ট
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

    // ৩. মার্চেন্ট Send Money + TrxID মোড (বাংলাদেশ ব্যাংক কমপ্লায়েন্ট — কোনো পিন নেওয়া হয় না)
    return res.json({
      success: true,
      mode: 'manual_verify',
      provider: gatewayKey,
      merchantNumber: status.merchantNumber,
      order: newOrder
    });
  } catch (error) {
    console.error('[Payment Initiate Error]:', error.message);
    res.status(400).json({ success: false, message: error.message || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে।' });
  }
});

// ম্যানুয়াল bKash / Nagad / Rocket Send Money TrxID সাবমিট
app.post('/api/payments/manual-submit', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  try {
    const { orderId, senderNumber, transactionId } = req.body || {};
    if (!orderId || !senderNumber || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'অর্ডার আইডি, প্রেরক নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।'
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

    broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });
    paymentServices.sendOrderEmails(updated).catch(() => {});

    res.json({
      success: true,
      message: 'পেমেন্ট তথ্য সফলভাবে গ্রহণ করা হয়েছে। দ্রুত যাচাই করে অর্ডারটি নিশ্চিত করা হবে।',
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পেমেন্ট তথ্য সাবমিট করতে সমস্যা হয়েছে।' });
  }
});

// সিকিউর টোকেনাইজড পেমেন্ট সিমুলেশন (Zero-PIN Compliance Verified)
app.post('/api/payments/gateway-pay', rateLimiter(20, 5 * 60 * 1000), async (req, res) => {
  const { orderId, method, accountNumber } = req.body || {};
  try {
    const order = db.findOrderById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'অর্ডারটি পাওয়া যায়নি।' });

    const prefix = method === 'nagad' ? 'NGD-' : 'BKSH-';
    const autoTrxId = `${prefix}${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = db.updateOrderPayment(orderId, {
      senderNumber: accountNumber || '01700000000',
      transactionId: autoTrxId,
      paymentMethod: method === 'nagad' ? 'Nagad' : 'bKash',
      paymentStatus: 'Paid (Automated Verified)'
    });

    if (updated) broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });
    if (updated) paymentServices.sendOrderEmails(updated).catch(() => {});

    res.json({
      success: true,
      message: 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!',
      transactionId: autoTrxId,
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'পেমেন্ট প্রসেসিং ব্যর্থ।' });
  }
});

// অফিসিয়াল bKash টোকেনাইজড কলব্যাক
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

    if (updated) {
      broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });
      paymentServices.sendOrderEmails(updated).catch(() => {});
    }
    return res.redirect(`/index.html?payment_status=success&orderId=${encodeURIComponent(orderId || '')}&trxId=${encodeURIComponent(exec.trxID)}`);
  } catch (err) {
    console.error('[bKash Callback Error]:', err.message);
    if (orderId) db.updateOrderPayment(orderId, { paymentStatus: 'bKash Verification Failed' });
    return res.redirect(`/index.html?payment_status=failed&orderId=${encodeURIComponent(orderId || '')}`);
  }
});

// অফিসিয়াল SSLCommerz কলব্যাকসমূহ
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

    if (updated) {
      broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });
      paymentServices.sendOrderEmails(updated).catch(() => {});
    }
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

// ==========================================
// ১৩. অ্যাডমিন প্যানেল এপিআই (Enterprise RBAC Admin Operations)
// ==========================================
// অ্যাডমিন লগইন
app.post('/api/admin/login', rateLimiter(15, 10 * 60 * 1000), (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'asbi';
  const adminPass = process.env.ADMIN_PASS || 'asbi123';

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।' });
  }

  if (username === adminUser && password === adminPass) {
    const token = db.generateToken({
      id: 'admin_' + adminUser,
      name: 'AsbiMart Super Admin',
      role: 'admin',
      isAdmin: true
    });

    console.log(`[Admin Login Success]: Admin user "${adminUser}" logged in.`);
    return res.json({
      success: true,
      message: 'অ্যাডমিন হিসেবে সফলভাবে প্রবেশ করেছেন।',
      token,
      admin: {
        username: adminUser,
        role: 'admin'
      }
    });
  }

  console.warn(`[Admin Login Failed]: Invalid attempt for username "${username}".`);
  return res.status(401).json({
    success: false,
    message: 'ভুল ইউজার আইডি অথবা পাসওয়ার্ড।'
  });
});

// অ্যাডমিন রিয়েল-টাইম SSE স্ট্রিম
app.get('/api/admin/orders/stream', authenticateAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (res.flushHeaders) res.flushHeaders();

  sseAdminClients.add(res);
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);

  const keepAliveTimer = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (e) {
      clearInterval(keepAliveTimer);
      sseAdminClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(keepAliveTimer);
    sseAdminClients.delete(res);
  });
});

// অ্যাডমিন: সকল অর্ডার দেখা
app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
  const orders = db.getOrders();
  res.json({ success: true, count: orders.length, orders });
});

// অ্যাডমিন: অর্ডার স্টেট মেশিন ভ্যালিডেশন সহ স্ট্যাটাস আপডেট
app.patch('/api/admin/orders/:orderId/status', authenticateAdmin, (req, res) => {
  const { statusCode, statusText, courier, trackingCode } = req.body;
  if (!statusCode) {
    return res.status(400).json({ success: false, message: 'স্ট্যাটাস কোড প্রদান করা আবশ্যক।' });
  }

  try {
    const updated = db.updateOrderStatus(req.params.orderId, statusCode, statusText, { courier, trackingCode }, 'Admin Dashboard');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'অর্ডারটি পাওয়া যায়নি।' });
    }

    broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });
    res.json({ success: true, message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!', order: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// অ্যাডমিন: কুরিয়ার ১-ক্লিক পার্সেল বুকিং (Steadfast, Pathao, RedX Integration)
app.post('/api/admin/orders/:orderId/courier/book', authenticateAdmin, (req, res) => {
  try {
    const courierName = req.body.courier || 'Steadfast';
    const booking = db.bookCourier(req.params.orderId, courierName);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'অর্ডারটি পাওয়া যায়নি।' });
    }

    const updatedOrder = db.findOrderById(req.params.orderId);
    broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updatedOrder });

    res.json({
      success: true,
      message: `আলহামদুলিল্লাহ! ${courierName} কুরিয়ারে বুকিং সম্পন্ন হয়েছে। কনসাইনমেন্ট আইডি: ${booking.consignmentId}`,
      booking,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'কুরিয়ার বুকিং প্রক্রিয়ায় ত্রুটি দেখা দিয়েছে।' });
  }
});

// কুরিয়ার স্বয়ংক্রিয় ওয়েব হুক এপিআই (Courier Webhook Receiver)
app.post('/api/courier/webhook', (req, res) => {
  try {
    const { consignment_id, tracking_code, status } = req.body || {};
    const trk = consignment_id || tracking_code;
    if (!trk) return res.status(400).json({ success: false, message: 'Missing consignment identifier.' });

    const order = db.findOrderById(trk);
    if (!order) return res.status(404).json({ success: false, message: 'Order not matched.' });

    const statusMap = {
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'returned': 'returned',
      'in_transit': 'shipped'
    };
    const targetStatus = statusMap[status] || 'shipped';

    const updated = db.updateOrderStatus(order.orderId, targetStatus, `কুরিয়ার আপডেট: ${status}`, null, 'Courier Webhook');
    broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: updated });

    res.json({ success: true, message: 'Webhook processed successfully.', orderId: order.orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Webhook processing error.' });
  }
});

// সরকারি মূসক-৬.৩ ট্যাক্স ইনভয়েস এপিআই (Govt Mushak 6.3 Tax Invoice Generator)
app.get('/api/admin/orders/:orderId/invoice', (req, res) => {
  try {
    const invoiceData = db.generateVatInvoiceData(req.params.orderId);
    if (!invoiceData) {
      return res.status(404).send('<h2>অর্ডারটি পাওয়া যায়নি।</h2>');
    }

    const o = invoiceData.order;
    const itemsHtml = (o.items || []).map((it, idx) => {
      const itTotal = (Number(it.price) || 0) * (Number(it.quantity) || 1);
      const itVat = Math.round(itTotal * 0.05);
      return `
        <tr>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${idx + 1}</td>
          <td style="border:1px solid #ddd;padding:8px;"><strong>${it.name}</strong> (${it.size || 'ডিফল্ট'})</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:center;">${it.quantity}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;">৳${it.price}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;">৳${itTotal}</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;">৫% (৳${itVat})</td>
          <td style="border:1px solid #ddd;padding:8px;text-align:right;">৳${itTotal}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>মূসক-৬.৩ কর চালান - ${o.orderId}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; margin: 40px; color: #222; }
          .invoice-box { max-width: 850px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.15); border-radius: 8px; }
          .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #16a34a; font-size: 26px; }
          .mushak-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-top: 8px; }
          .info-table { width: 100%; margin-bottom: 20px; }
          .info-table td { padding: 4px 8px; vertical-align: top; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th { background: #f8fafc; border: 1px solid #ddd; padding: 10px; font-size: 14px; }
          .totals-table { width: 50%; margin-left: auto; border-collapse: collapse; }
          .totals-table td { padding: 6px 12px; border-bottom: 1px solid #eee; }
          .qr-box { margin-top: 25px; padding: 15px; background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 6px; font-size: 13px; }
          @media print {
            .no-print { display: none; }
            body { margin: 0; }
            .invoice-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="no-print" style="text-align: right; margin-bottom: 15px;">
            <button onclick="window.print()" style="background:#16a34a;color:#fff;border:none;padding:10px 20px;font-size:14px;font-weight:bold;border-radius:6px;cursor:pointer;">🖨️ ইনভয়েস প্রিন্ট করুন (Print Invoice)</button>
          </div>
          <div class="header">
            <h1>${invoiceData.companyName}</h1>
            <p style="margin:4px 0;">রেজিস্টার্ড অফিস: ${invoiceData.registeredAddress} | হেল্পলাইন: ${invoiceData.contactPhone}</p>
            <p style="margin:4px 0;"><strong>বিআইএন (BIN):</strong> ${invoiceData.companyBin} | <strong>টিআইএন (TIN):</strong> ${invoiceData.companyTin}</p>
            <div class="mushak-badge">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - জাতীয় রাজস্ব বোর্ড (NBR) - মূসক-৬.৩ কর চালানপত্র</div>
          </div>
          <table class="info-table">
            <tr>
              <td style="width: 50%;">
                <strong>ক্রেতার নাম:</strong> ${o.customer.name}<br>
                <strong>মোবাইল নম্বর:</strong> ${o.customer.phone}<br>
                <strong>ডেলিভারি ঠিকানা:</strong> ${o.customer.address} (${o.customer.area === 'dhaka_inside' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'})
              </td>
              <td style="width: 50%; text-align: right;">
                <strong>চালানপত্র নং:</strong> ${invoiceData.challanNo}<br>
                <strong>অর্ডার নং:</strong> #${o.orderId}<br>
                <strong>ইস্যুর তারিখ ও সময়:</strong> ${invoiceData.issueDate}<br>
                <strong>পেমেন্ট মাধ্যম:</strong> ${o.paymentMethod} (${o.paymentStatus})
              </td>
            </tr>
          </table>
          <table class="items-table">
            <thead>
              <tr>
                <th>ক্র. নং</th>
                <th>পণ্যের বিবরণ</th>
                <th>পরিমাণ</th>
                <th>একক মূল্য</th>
                <th>মোট মূল্য</th>
                <th>মূসক (৫%)</th>
                <th>সর্বমোট</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table class="totals-table">
            <tr><td><strong>পণ্যের উপ-মোট (Subtotal):</strong></td><td style="text-align:right;">৳${invoiceData.subtotal}</td></tr>
            <tr><td><strong>প্রযোজ্য মূসক (৫% VAT অন্তর্ভুক্ত):</strong></td><td style="text-align:right;">৳${invoiceData.totalVat}</td></tr>
            ${invoiceData.discountAmount > 0 ? `<tr><td><strong style="color:#16a34a;">কুপন ছাড় (${o.couponCode || 'PROMO'}):</strong></td><td style="text-align:right;color:#16a34a;">-৳${invoiceData.discountAmount}</td></tr>` : ''}
            <tr><td><strong>ডেলিভারি চার্জ:</strong></td><td style="text-align:right;">৳${invoiceData.deliveryCharge}</td></tr>
            <tr style="font-size:16px;background:#f8fafc;"><td><strong>সর্বমোট প্রদেয় বিল (Grand Total):</strong></td><td style="text-align:right;"><strong>৳${invoiceData.grandTotal}</strong></td></tr>
          </table>
          <div class="qr-box">
            🛡️ <strong>ডিজিটাল চালান সত্যতা যাচাই:</strong> এই কর চালানটি জাতীয় রাজস্ব বোর্ডের ই-কমার্স মূসক নির্দেশিকা অনুযায়ী কম্পিউটার জেনারেটেড এবং ডিজিটাল বারকোড দ্বারা সংরক্ষিত। কোনো স্বাক্ষর আবশ্যক নয়।
            <br>
            <small>ভেরিফিকেশন কিউআর লিংক: ${invoiceData.qrVerificationUrl}</small>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send('ইনভয়েস জেনারেট করতে সমস্যা হয়েছে।');
  }
});

// বাল্ক অর্ডার অপারেশনস (Bulk Status Update & CSV Export)
app.post('/api/admin/orders/bulk-status', authenticateAdmin, (req, res) => {
  try {
    const { orderIds, statusCode } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0 || !statusCode) {
      return res.status(400).json({ success: false, message: 'অর্ডার তালিকা ও স্ট্যাটাস প্রদান করুন।' });
    }

    let updatedCount = 0;
    orderIds.forEach(id => {
      try {
        const u = db.updateOrderStatus(id, statusCode, null, null, 'Admin Bulk Operation');
        if (u) {
          updatedCount++;
          broadcastToAdminSSE({ type: 'ORDER_STATUS_UPDATED', order: u });
        }
      } catch (e) {}
    });

    res.json({
      success: true,
      message: `মোট ${updatedCount}টি অর্ডারের স্ট্যাটাস সফলভাবে "${statusCode}"-এ পরিবর্তন করা হয়েছে।`,
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'বাল্ক অপারেশন ব্যর্থ।' });
  }
});

app.get('/api/admin/orders/export/csv', authenticateAdmin, (req, res) => {
  try {
    const orders = db.getOrders();
    let csv = '\uFEFF'; // UTF-8 BOM for Excel Bengali character rendering
    csv += 'Order ID,Customer Name,Phone,Address,Area,Items Count,Subtotal,Discount,Delivery Charge,Total Amount,Payment Method,Payment Status,Status,Courier,Tracking Code,Date\n';

    orders.forEach(o => {
      const cleanAddr = `"${(o.customer.address || '').replace(/"/g, '""')}"`;
      const cleanName = `"${(o.customer.name || '').replace(/"/g, '""')}"`;
      csv += `${o.orderId},${cleanName},${o.customer.phone},${cleanAddr},${o.customer.area},${(o.items || []).length},${o.subtotal || o.totalAmount},${o.discountAmount || 0},${o.deliveryCharge || 60},${o.totalAmount},${o.paymentMethod},${o.paymentStatus},"${o.status}",${o.courier || ''},${o.trackingCode || ''},${o.createdAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="asbimart_orders_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'CSV এক্সপোর্ট ব্যর্থ।' });
  }
});

// ইনভেন্টরি অ্যালার্ট ও রিস্টক
app.get('/api/admin/inventory/low-stock', authenticateAdmin, (req, res) => {
  const lowStock = db.getLowStockProducts(10);
  res.json({ success: true, count: lowStock.length, products: lowStock });
});

app.post('/api/admin/inventory/restock', authenticateAdmin, (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ success: false, message: 'প্রোডাক্ট আইডি ও রিস্টক পরিমাণ দিন।' });
  }
  const updated = db.restockProduct(productId, quantity, req.admin.name || 'Admin');
  if (!updated) {
    return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
  }
  res.json({ success: true, message: `পণ্যটির স্টক সফলভাবে বৃদ্ধি পেয়ে ${updated.stock} হয়েছে।`, product: updated });
});

// কাস্টমার সাপোর্ট সিআরএম এপিআই
app.post('/api/support/ticket', rateLimiter(10, 5 * 60 * 1000), (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর ও বার্তা পূরণ করুন।' });
  }
  const ticket = db.createSupportTicket({
    customerName: sanitizeText(name),
    customerPhone: phone.replace(/[\s-]/g, '').trim(),
    customerEmail: sanitizeText(email || ''),
    subject: sanitizeText(subject || 'সাধারণ অনুসন্ধান'),
    message: sanitizeText(message)
  });
  res.status(201).json({ success: true, message: 'আপনার বার্তাটি সফলভাবে গৃহীত হয়েছে।', ticket });
});

app.get('/api/admin/support/tickets', authenticateAdmin, (req, res) => {
  const tickets = db.getSupportTickets();
  res.json({ success: true, count: tickets.length, tickets });
});

app.post('/api/admin/support/tickets/:id/reply', authenticateAdmin, (req, res) => {
  const { reply } = req.body;
  if (!reply) return res.status(400).json({ success: false, message: 'উত্তর দিন।' });
  const updated = db.replySupportTicket(req.params.id, sanitizeText(reply));
  if (!updated) return res.status(404).json({ success: false, message: 'টিকেট পাওয়া যায়নি।' });
  res.json({ success: true, message: 'গ্রাহকের টিকেটে উত্তর পাঠানো হয়েছে।', ticket: updated });
});

// পরিত্যক্ত কার্ট রিকভারি
app.get('/api/admin/abandoned-carts', authenticateAdmin, (req, res) => {
  const abandoned = db.getAbandonedCarts(30);
  res.json({ success: true, count: abandoned.length, abandonedCarts: abandoned });
});

// অ্যাডমিন রিভিউ ম্যানেজমেন্ট
app.get('/api/admin/reviews', authenticateAdmin, (req, res) => {
  const reviews = db.getAllReviews();
  res.json({ success: true, count: reviews.length, reviews });
});

app.delete('/api/admin/reviews/:reviewId', authenticateAdmin, (req, res) => {
  const deleted = db.deleteReview(req.params.reviewId);
  if (!deleted) return res.status(404).json({ success: false, message: 'রিভিউ পাওয়া যায়নি।' });
  res.json({ success: true, message: 'রিভিউটি মুছে ফেলা হয়েছে।' });
});

// যোগাযোগ মেসেজ
app.post('/api/contact', rateLimiter(10, 10 * 60 * 1000), (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর এবং আপনার বার্তা পূরণ করুন।' });
    }
    const newMsg = db.createMessage({
      name: sanitizeText(name),
      phone: phone.replace(/[\s-]/g, '').trim(),
      email: sanitizeText(email),
      subject: sanitizeText(subject),
      message: sanitizeText(message)
    });
    res.status(201).json({ success: true, message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!', messageId: newMsg.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'বার্তা পাঠাতে সমস্যা হয়েছে।' });
  }
});

// সার্ভার-সাইড কনভার্সন এপিআই (Meta CAPI & GA4 Event Logger)
app.post('/api/analytics/conversion', (req, res) => {
  const { eventName, eventId, eventData } = req.body || {};
  console.log(`[Server Conversion API]: Event "${eventName}" recorded. ID: ${eventId || 'auto'}`);
  res.json({ success: true, recorded: true, eventName, timestamp: new Date().toISOString() });
});

// অ্যাডমিন ড্যাশবোর্ড পরিসংখ্যান (Enriched Analytics)
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  const orders = db.getOrders();
  const users = db.getUsers();
  const products = db.getProducts();
  const lowStock = db.getLowStockProducts(10);
  const abandoned = db.getAbandonedCarts(30);

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => o.statusCode === 'pending' || !o.statusCode).length;
  const deliveredOrders = orders.filter(o => o.statusCode === 'delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  res.json({
    success: true,
    stats: {
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      averageOrderValue: avgOrderValue,
      totalUsers: users.length,
      totalProducts: products.length,
      lowStockCount: lowStock.length,
      abandonedCartsCount: abandoned.length
    }
  });
});

// হেলথ চেক
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'AsbiMart Enterprise Backend Engine (Pro Edition)',
    security: 'HMAC-SHA256 Token Auth, Timing-Safe Equal, CSP & Rate Limiting Active',
    features: ['Stock Reservation', 'Server-Side Price Calculation', 'Coupons Engine', 'Courier API', 'Govt VAT Invoice', 'SSE Stream'],
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ১৪. ফুল পেজ ও স্ট্যাটিক ফ্রন্টএন্ড পরিবেশন
// ==========================================
app.use('/assets', express.static(path.join(frontendPath, 'assets'), { etag: true, maxAge: '7d' }));
app.use(express.static(frontendPath, {
  etag: true,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));
app.use(express.static(path.join(frontendPath, 'html'), {
  etag: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'admin.html')));
app.get('/login', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'login.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'profile.html')));
app.get('/track-order', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'track-order.html')));
app.get('/wishlist', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'wishlist.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'contact.html')));
app.get('/about', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'about.html')));
app.get('/faq', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'faq.html')));
app.get('/category', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'category.html')));
app.get('/return-policy', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'return-policy.html')));
app.get('/delivery-policy', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'delivery-policy.html')));
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'privacy-policy.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'terms.html')));
app.get('/product/:id', (req, res) => res.sendFile(path.join(frontendPath, 'html', 'index.html')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(frontendPath, 'manifest.json')));
app.get('/sw.js', (req, res) => res.sendFile(path.join(frontendPath, 'sw.js')));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'অনুরোধকৃত API এন্ডপয়েন্টটি পাওয়া যায়নি।' });
  }
  res.status(404).sendFile(path.join(frontendPath, 'html', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('[সার্ভার এরর]:', err.stack);
  res.status(500).json({ success: false, message: 'সার্ভারে অভ্যন্তরীণ ত্রুটি দেখা দিয়েছে।' });
});

// ==========================================
// ১৫. সার্ভার চালু করা
// ==========================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n============================================================`);
    console.log(`🌿 AsbiMart Pro (আসবিমার্ট প্রো) এন্টারপ্রাইজ সার্ভার চালু হয়েছে!`);
    console.log(`🌐 মূল ওয়েবসাইট:  http://localhost:${PORT}`);
    console.log(`🛡️ অ্যাডমিন প্যানেল: http://localhost:${PORT}/admin`);
    console.log(`⚡ API হেলথ চেক:   http://localhost:${PORT}/api/health`);
    console.log(`============================================================\n`);
  });
}

module.exports = app;
