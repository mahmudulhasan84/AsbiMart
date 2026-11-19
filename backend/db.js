const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');

// সিক্রেট কী ও পাসওয়ার্ড হ্যাশিং
const AUTH_SECRET = process.env.AUTH_SECRET || 'asbi_secret_key_super_secure_organic_mart_2026';

function hashPassword(password) {
  return crypto.createHmac('sha256', AUTH_SECRET).update(password).digest('hex');
}

// ফাইলগুলোর সম্পূর্ণ পাথ
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  messages: path.join(DATA_DIR, 'messages.json'),
  products: path.join(DATA_DIR, 'products.json'),
  reviews: path.join(DATA_DIR, 'reviews.json'),
  carts: path.join(DATA_DIR, 'carts.json')
};

// ফাইল না থাকলে প্রাথমিক ডেটা দিয়ে তৈরি করা
function ensureFileExists(filePath, defaultData = []) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// ডেটা ডিরেক্টরি ও ফাইল নিশ্চিত করা
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

ensureFileExists(FILES.users, [
  {
    id: 'user_asbi_demo',
    name: 'Asbi Mahmud',
    phone: '01700000000',
    email: 'asbi@asbimart.com',
    passwordHash: hashPassword('asbi123'),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    city: 'Dhaka',
    address: 'House #12, Road #04, Sector #11, Uttara, Dhaka-1230',
    role: 'customer',
    createdAt: new Date().toISOString()
  }
]);

const SEED_ORDERS = [
  {
    orderId: "ASBI-836892",
    userId: null,
    customer: {
      name: "Mahmudul Hasan (4411)",
      phone: "01656754754",
      email: "mahmudulhasan18484@gmail.com",
      address: "aa",
      area: "dhaka_inside"
    },
    items: [
      {
        id: "ghee-buffalo-07",
        name: "মহিষের খাঁটি ঘি",
        size: "৫০০ গ্রাম",
        price: 880,
        quantity: 1,
        image: "../assets/products/ghee-buffalo-07.jpg"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 940,
    paymentMethod: "Cash on Delivery",
    paymentGateway: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    transactionId: "",
    senderNumber: "",
    gatewayPaymentId: "",
    status: "অর্ডার গৃহীত হয়েছে (Pending)",
    statusCode: "pending",
    courier: "রেডএক্স / স্টিডফাস্ট কুরিয়ার",
    trackingCode: "TRK-588278",
    notes: "",
    createdAt: "2026-11-19T05:36:11.745Z"
  },
  {
    orderId: "ASBI-806302",
    userId: null,
    customer: {
      name: "Mahmudul Hasan (4411)",
      phone: "01656754754",
      email: "mahmudulhasan18484@gmail.com",
      address: "ghjf",
      area: "dhaka_inside"
    },
    items: [
      {
        id: "oil-sesame-til-12",
        name: "খাঁটি তিলের তেল",
        size: "২৫০ মিলি",
        price: 290,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 350,
    paymentMethod: "Cash on Delivery",
    paymentGateway: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    transactionId: "",
    senderNumber: "",
    gatewayPaymentId: "",
    status: "অর্ডার গৃহীত হয়েছে (Pending)",
    statusCode: "pending",
    courier: "রেডএক্স / স্টিডফাস্ট কুরিয়ার",
    trackingCode: "TRK-139391",
    notes: "",
    createdAt: "2026-11-19T05:30:05.209Z"
  },
  {
    orderId: "ASBI-924570",
    userId: null,
    customer: {
      name: "Mahmudul Hasan (4411)",
      phone: "01656754754",
      email: "mahmudulhasan18484@gmail.com",
      address: "greyeuy",
      area: "dhaka_inside"
    },
    items: [
      {
        id: "honey-nut-premium-05",
        name: "প্রিমিয়াম হানি নাট জার",
        size: "৫০০ গ্রাম",
        price: 790,
        quantity: 1,
        image: "../assets/products/honey-nut-premium-05.jpg"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 850,
    paymentMethod: "bKash Online Payment",
    paymentGateway: "bkash",
    paymentStatus: "Pending Payment",
    transactionId: "",
    senderNumber: "",
    gatewayPaymentId: "",
    status: "অর্ডার গৃহীত হয়েছে (Pending)",
    statusCode: "pending",
    courier: "রেডএক্স / স্টিডফাস্ট কুরিয়ার",
    trackingCode: "TRK-615661",
    notes: "",
    createdAt: "2026-11-19T05:26:33.593Z"
  },
  {
    orderId: "ASBI-782910",
    customer: {
      name: "আসবি (Asbi)",
      phone: "01700000000",
      address: "বাড়ি #১২, রোড #০৪, সেক্টর #১১, উত্তরা, ঢাকা-১২৩০",
      area: "dhaka"
    },
    items: [
      {
        id: "honey-sundarban-01",
        name: "সুন্দরবনের কাঁচা মধু",
        variant: "৫০০ গ্রাম",
        price: 650,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "ghee-pabna-06",
        name: "খাঁটি গাওয়া ঘি",
        variant: "৫০০ গ্রাম",
        price: 950,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80"
      }
    ],
    deliveryCharge: 60,
    totalAmount: 1660,
    paymentMethod: "cod",
    status: "অন ডেলিভারি (On Delivery)",
    statusCode: "shipped",
    courier: "রেডএক্স (RedX Express)",
    trackingCode: "REDX-ASBI-99238",
    notes: "প্যাকেজ সাবধানে পাঠাবেন।",
    createdAt: "2026-11-18T04:04:15.775Z"
  }
];

// Ensure all seed orders exist in FILES.orders
(function mergeSeedOrders() {
  ensureFileExists(FILES.orders, SEED_ORDERS);
  try {
    const existing = readData('orders');
    const map = new Map();
    existing.forEach(o => { if (o.orderId) map.set(o.orderId.toLowerCase(), o); });
    let changed = false;
    SEED_ORDERS.forEach(s => {
      if (!map.has(s.orderId.toLowerCase())) {
        existing.unshift(s);
        map.set(s.orderId.toLowerCase(), s);
        changed = true;
      }
    });
    if (changed) {
      writeData('orders', existing);
    }
  } catch (e) {
    console.error('[DB Orders Init Error]:', e);
  }
})();

ensureFileExists(FILES.messages, []);
ensureFileExists(FILES.products, []);
ensureFileExists(FILES.reviews, []);
ensureFileExists(FILES.carts, []);

// নিরাপদ পাঠ
function readData(key) {
  try {
    const file = FILES[key];
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`[DB Error reading ${key}]:`, err.message);
    return [];
  }
}

// নিরাপদ লেখা (Atomic Write)
function writeData(key, data) {
  try {
    const file = FILES[key];
    const tempFile = `${file}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, file);
    return true;
  } catch (err) {
    console.error(`[DB Error writing ${key}]:`, err.message);
    return false;
  }
}

function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}

// ইউজার সংক্রান্ত মেথড
const db = {
  // ইউজার
  getUsers: () => readData('users'),
  findUserByPhone: (phone) => {
    const users = readData('users');
    return users.find(u => u.phone === phone);
  },
  findUserByEmail: (email) => {
    if (!email) return null;
    const users = readData('users');
    return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  },
  findUserByIdentifier: (identifier) => {
    if (!identifier) return null;
    const raw = String(identifier).trim();
    const users = readData('users');
    if (raw.includes('@')) {
      return users.find(u => u.email && u.email.toLowerCase() === raw.toLowerCase()) || null;
    }
    const cleanPhone = raw.replace(/[\s-]/g, '');
    return users.find(u => u.phone === cleanPhone) || null;
  },
  findUserByProvider: (provider, providerId) => {
    if (!provider || !providerId) return null;
    const users = readData('users');
    return users.find(u => u.provider === provider && String(u.providerId) === String(providerId)) || null;
  },
  findUserById: (id) => {
    const users = readData('users');
    return users.find(u => u.id === id);
  },
  createUser: (userData) => {
    const users = readData('users');
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: userData.name,
      phone: userData.phone || '',
      email: userData.email || '',
      passwordHash: hashPassword(userData.password || crypto.randomBytes(24).toString('hex')),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      city: userData.city || userData.division || 'Dhaka',
      division: userData.division || '',
      district: userData.district || '',
      upazila: userData.upazila || '',
      address: userData.address || '',
      provider: userData.provider || 'local',
      providerId: userData.providerId || '',
      emailVerified: !!userData.emailVerified,
      phoneVerified: !!userData.phoneVerified,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData('users', users);
    return newUser;
  },
  updateUser: (id, updates) => {
    const users = readData('users');
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    if (updates.password) {
      updates.passwordHash = hashPassword(updates.password);
      delete updates.password;
    }
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    writeData('users', users);
    return users[idx];
  },

  // অর্ডার
  getOrders: () => readData('orders'),
  findOrderById: (orderId) => {
    const orders = readData('orders');
    return orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());
  },
  findOrdersByPhone: (phone) => {
    const orders = readData('orders');
    return orders.filter(o => o.customer && o.customer.phone === phone);
  },
  findOrdersByUser: (userId, phone, email) => {
    const orders = readData('orders');
    const cleanEmail = (email || '').toLowerCase().trim();
    return orders.filter(o => {
      if (userId && o.userId && o.userId === userId) return true;
      if (phone && o.customer && o.customer.phone === phone) return true;
      if (cleanEmail && o.customer && o.customer.email && o.customer.email.toLowerCase() === cleanEmail) return true;
      return false;
    });
  },
  createOrder: (orderData) => {
    const orders = readData('orders');
    const orderId = 'ASBI-' + Math.floor(100000 + Math.random() * 900000);
    const areaVal = orderData.customer.area || 'dhaka_inside';
    const isDhaka = areaVal === 'dhaka' || areaVal === 'dhaka_inside';
    const newOrder = {
      orderId,
      userId: orderData.userId || null,
      customer: {
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        email: orderData.customer.email || '',
        address: orderData.customer.address,
        area: areaVal
      },
      items: orderData.items || [],
      deliveryCharge: orderData.deliveryCharge || (isDhaka ? 60 : 120),
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentGateway: orderData.paymentGateway || (orderData.paymentMethod || 'cod'),
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pending Payment'),
      transactionId: orderData.transactionId || '',
      senderNumber: orderData.senderNumber || '',
      gatewayPaymentId: orderData.gatewayPaymentId || '',
      status: 'অর্ডার গৃহীত হয়েছে (Pending)',
      statusCode: 'pending',
      courier: 'রেডএক্স / স্টিডফাস্ট কুরিয়ার',
      trackingCode: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
      notes: orderData.notes || '',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    writeData('orders', orders);
    return newOrder;
  },
  updateOrderPayment: (orderId, paymentUpdates) => {
    const orders = readData('orders');
    const idx = orders.findIndex(o => o.orderId.toLowerCase() === String(orderId || '').toLowerCase());
    if (idx === -1) return null;
    orders[idx] = {
      ...orders[idx],
      ...paymentUpdates,
      updatedAt: new Date().toISOString()
    };
    writeData('orders', orders);
    return orders[idx];
  },
  updateOrderStatus: (orderId, statusCode, statusText, courierInfo) => {
    const orders = readData('orders');
    const idx = orders.findIndex(o => o.orderId.toLowerCase() === orderId.toLowerCase());
    if (idx === -1) return null;
    orders[idx].statusCode = statusCode;
    if (statusText) orders[idx].status = statusText;
    if (courierInfo) {
      if (courierInfo.courier) orders[idx].courier = courierInfo.courier;
      if (courierInfo.trackingCode) orders[idx].trackingCode = courierInfo.trackingCode;
    }
    orders[idx].updatedAt = new Date().toISOString();
    writeData('orders', orders);
    return orders[idx];
  },

  // মেসেজ / যোগাযোগ ফর্ম
  getMessages: () => readData('messages'),
  createMessage: (msg) => {
    const messages = readData('messages');
    const newMsg = {
      id: 'msg_' + Date.now(),
      name: msg.name,
      phone: msg.phone,
      email: msg.email || '',
      subject: msg.subject || 'সাধারণ যোগাযোগ',
      message: msg.message,
      createdAt: new Date().toISOString(),
      read: false
    };
    messages.unshift(newMsg);
    writeData('messages', messages);
    return newMsg;
  },

  // পণ্য
  getProducts: () => readData('products'),
  findProductById: (id) => {
    const products = readData('products');
    return products.find(p => p.id === id);
  },

  // রিয়েল কাস্টমার রিভিউ (Persistent Reviews)
  getAllReviews: () => readData('reviews'),
  getReviewsByProduct: (productId) => {
    const reviews = readData('reviews');
    return reviews.filter(r => r.productId === productId);
  },
  createReview: (reviewData) => {
    const reviews = readData('reviews');
    const newReview = {
      id: 'rev_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      productId: reviewData.productId,
      productName: reviewData.productName || '',
      userId: reviewData.userId || null,
      name: reviewData.name,
      email: reviewData.email || '',
      rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
      comment: reviewData.comment,
      verifiedBuyer: !!reviewData.verifiedBuyer,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    writeData('reviews', reviews);
    return newReview;
  },
  deleteReview: (reviewId) => {
    const reviews = readData('reviews');
    const filtered = reviews.filter(r => r.id !== reviewId);
    if (filtered.length === reviews.length) return false;
    writeData('reviews', filtered);
    return true;
  },

  // ইউজার কার্ট সিঙ্ক (Persistent Cart)
  getUserCart: (userId) => {
    if (!userId) return [];
    const carts = readData('carts');
    const rec = carts.find(c => c.userId === userId);
    return rec && Array.isArray(rec.items) ? rec.items : [];
  },
  saveUserCart: (userId, items) => {
    if (!userId) return [];
    const carts = readData('carts');
    const idx = carts.findIndex(c => c.userId === userId);
    const cleanItems = Array.isArray(items) ? items : [];
    const record = { userId, items: cleanItems, updatedAt: new Date().toISOString() };
    if (idx === -1) carts.push(record);
    else carts[idx] = record;
    writeData('carts', carts);
    return cleanItems;
  },

  // সিকিউরিটি টুলস
  hashPassword,
  generateToken,
  verifyToken
};

module.exports = db;
