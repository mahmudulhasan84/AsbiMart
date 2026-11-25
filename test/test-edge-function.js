const assert = require('assert');

async function testNativeEdgeBackend() {
  console.log('🧪 Testing 100% Native Cloudflare Pages Functions Edge Backend...');

  // Dynamically import the edge function ES module
  const edgeModule = await import('../functions/api/[[path]].js');

  const env = {
    AUTH_SECRET: 'asbi_secret_key_super_secure_organic_mart_2026',
    ADMIN_USER: 'asbi',
    ADMIN_PASS: 'AsbiMart@2026',
    GOOGLE_CLIENT_ID: '280069081577-ofqhdd3unutvbn5k28bhjc76k754hr82.apps.googleusercontent.com',
    FACEBOOK_APP_ID: '1814698216118210'
  };

  async function callEdge(path, options = {}) {
    const url = `https://asbimart.pages.dev${path}`;
    const req = new Request(url, {
      method: options.method || 'GET',
      headers: {
        'Host': 'asbimart.pages.dev',
        'cf-connecting-ip': '203.0.113.195',
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const res = await edgeModule.onRequest({ request: req, env, params: {} });
    if (res.headers.get('content-type')?.includes('text/event-stream')) {
      return { status: res.status, headers: res.headers, data: '[SSE Stream]' };
    }
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    return { status: res.status, headers: res.headers, data };
  }

  // --------------------------------------------------------------------------
  console.log('\n📌 1. Edge CORS Preflight & Health Check');
  // --------------------------------------------------------------------------
  const optRes = await edgeModule.onRequestOptions();
  assert.strictEqual(optRes.status, 204, 'OPTIONS returns 204');
  assert.strictEqual(optRes.headers.get('Access-Control-Allow-Origin'), '*', 'CORS origin is *');
  console.log('  ✓ Edge CORS preflight OPTIONS returns 204 OK');

  const healthRes = await callEdge('/api/health');
  assert.strictEqual(healthRes.status, 200, 'Health check returns 200');
  assert.strictEqual(healthRes.data.status, 'success', 'Health status is success');
  assert.strictEqual(healthRes.data.runtime, 'Cloudflare Workers Edge', 'Runtime is native Cloudflare Workers Edge');
  console.log('  ✓ Native Edge /api/health returns 200 OK');

  // --------------------------------------------------------------------------
  console.log('\n📌 2. Product Catalog API (All 39 Organic Products)');
  // --------------------------------------------------------------------------
  const prodRes = await callEdge('/api/products');
  assert.strictEqual(prodRes.status, 200, 'GET /api/products returns 200');
  assert.strictEqual(prodRes.data.success, true, 'Products success is true');
  assert.strictEqual(prodRes.data.products.length, 39, 'Full catalog loads all 39 organic products');
  console.log('  ✓ Catalog returns exactly 39 products natively at the Cloudflare Edge');

  const singleRes = await callEdge('/api/products/honey-sundarban-01');
  assert.strictEqual(singleRes.status, 200, 'Single product returns 200');
  assert.strictEqual(singleRes.data.product.id, 'honey-sundarban-01', 'Product ID matches');
  console.log('  ✓ Single product detail (honey-sundarban-01) loads correctly');

  // --------------------------------------------------------------------------
  console.log('\n📌 3. Admin Authentication & OWASP RBAC Defense');
  // --------------------------------------------------------------------------
  // Unauthorized requests must be blocked
  const unauthOrders = await callEdge('/api/admin/orders');
  assert.strictEqual(unauthOrders.status, 401, 'Unauthorized GET /api/admin/orders blocked with 401');

  const unauthStats = await callEdge('/api/admin/stats');
  assert.strictEqual(unauthStats.status, 401, 'Unauthorized GET /api/admin/stats blocked with 401');

  const unauthStatus = await callEdge('/api/admin/orders/ASBI-836892/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: { statusCode: 'shipped' }
  });
  assert.strictEqual(unauthStatus.status, 401, 'Unauthorized PATCH status blocked with 401');
  console.log('  ✓ RBAC defense protects admin endpoints against unauthorized access');

  // Wrong password fails
  const wrongLogin = await callEdge('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { username: 'asbi', password: 'wrongpassword' }
  });
  assert.strictEqual(wrongLogin.status, 401, 'Wrong admin password rejected with 401');

  // Valid login with AsbiMart@2026 succeeds
  const adminLogin = await callEdge('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { username: 'asbi', password: 'AsbiMart@2026' }
  });
  assert.strictEqual(adminLogin.status, 200, 'Admin login with AsbiMart@2026 succeeds');
  assert(adminLogin.data.token, 'Admin login returns Web Crypto JWT');
  const adminToken = adminLogin.data.token;

  // Valid login with asbi123 also succeeds
  const adminLoginCompat = await callEdge('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { username: 'asbi', password: 'asbi123' }
  });
  assert.strictEqual(adminLoginCompat.status, 200, 'Admin login with asbi123 succeeds');
  console.log('  ✓ Admin login authenticates securely with Web Crypto JWT');

  // Authorized Admin endpoints
  const authOrders = await callEdge('/api/admin/orders', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(authOrders.status, 200, 'Authorized GET /api/admin/orders returns 200');
  assert(Array.isArray(authOrders.data.orders), 'Orders list returned');

  const authStats = await callEdge('/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(authStats.status, 200, 'Authorized GET /api/admin/stats returns 200');
  assert(authStats.data.stats && typeof authStats.data.stats.totalOrders === 'number', 'Stats data valid');
  console.log('  ✓ Authorized admin queries /api/admin/orders and /api/admin/stats');

  // --------------------------------------------------------------------------
  console.log('\n📌 4. Customer Authentication & Profile Management');
  // --------------------------------------------------------------------------
  const userLogin = await callEdge('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { identifier: 'asbi@asbimart.com', password: 'asbi123' }
  });
  assert.strictEqual(userLogin.status, 200, 'Customer login succeeds');
  assert(userLogin.data.token, 'Customer JWT token generated');
  const userToken = userLogin.data.token;

  const userProfile = await callEdge('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.strictEqual(userProfile.status, 200, 'GET /api/auth/me returns 200');
  assert.strictEqual(userProfile.data.user.email, 'asbi@asbimart.com', 'User email matches');

  const updateProfile = await callEdge('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: { name: 'Asbi Mahmud Updated', division: 'Dhaka', address: 'House 42, Road 7' }
  });
  assert.strictEqual(updateProfile.status, 200, 'PUT /api/auth/profile updates profile');
  assert.strictEqual(updateProfile.data.user.name, 'Asbi Mahmud Updated', 'Profile name updated');
  console.log('  ✓ Customer login, JWT session, and profile update verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 5. Order Placement, Tracking & Status Workflow');
  // --------------------------------------------------------------------------
  const orderPayload = {
    name: 'Asbi Customer',
    phone: '01711223344',
    email: 'customer@asbimart.com',
    address: 'Dhanmondi 32, Dhaka',
    area: 'dhaka_inside',
    totalAmount: 1530,
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 'honey-sundarban-01', name: 'সুন্দরবনের কাঁচা মধু', size: '৫০০ গ্রাম', price: 650, quantity: 1 },
      { id: 'ghee-buffalo-07', name: 'মহিষের খাঁটি ঘি', size: '৫০০ গ্রাম', price: 880, quantity: 1 }
    ]
  };

  const createOrderRes = await callEdge('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: orderPayload
  });
  assert.strictEqual(createOrderRes.status, 201, 'POST /api/orders returns 201');
  assert(createOrderRes.data.order && createOrderRes.data.order.orderId.startsWith('ASBI-'), 'Order ID created with ASBI- prefix');
  const createdOrderId = createOrderRes.data.order.orderId;
  console.log(`  ✓ New order created at Edge: #${createdOrderId}`);

  // Track the created order
  const trackRes = await callEdge(`/api/track/${createdOrderId}`);
  assert.strictEqual(trackRes.status, 200, 'GET /api/track/:id returns 200');
  assert.strictEqual(trackRes.data.order.orderId, createdOrderId, 'Tracked order ID matches');
  assert(Array.isArray(trackRes.data.steps), 'Order timeline steps returned');

  // Admin updates order status
  const updateStatusRes = await callEdge(`/api/admin/orders/${createdOrderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: {
      statusCode: 'shipped',
      statusText: 'অন ডেলিভারি (On Delivery)',
      courier: 'রেডএক্স এক্সপ্রেস',
      trackingCode: 'REDX-TEST-5566'
    }
  });
  assert.strictEqual(updateStatusRes.status, 200, 'PATCH order status returns 200');
  assert.strictEqual(updateStatusRes.data.order.statusCode, 'shipped', 'Order status updated to shipped');

  // Customer re-tracks to see updated status
  const reTrack = await callEdge(`/api/track/${createdOrderId}`);
  assert.strictEqual(reTrack.data.order.statusCode, 'shipped', 'Customer sees updated shipped status');

  // Customer My Orders
  const myOrders = await callEdge(`/api/orders/my-orders?phone=01711223344`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.strictEqual(myOrders.status, 200, 'GET /api/orders/my-orders returns 200');
  assert(myOrders.data.orders.some(o => o.orderId === createdOrderId), 'Placed order listed in My Orders');
  console.log('  ✓ Order lifecycle (placement -> tracking -> admin status update -> my-orders) verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 6. Stored XSS Sanitization Defense on Customer Reviews');
  // --------------------------------------------------------------------------
  const xssReview = {
    name: '<script>alert("XSS")</script>Test User',
    rating: 5,
    comment: '<img src=x onerror="alert(1)">Excellent authentic organic honey!'
  };

  const createReviewRes = await callEdge('/api/products/honey-sundarban-01/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: xssReview
  });
  assert.strictEqual(createReviewRes.status, 201, 'POST review returns 201');
  const reviewId = createReviewRes.data.review.id;

  const listReviewsRes = await callEdge('/api/products/honey-sundarban-01/reviews');
  assert.strictEqual(listReviewsRes.status, 200, 'GET reviews returns 200');
  const savedReview = listReviewsRes.data.reviews.find(r => r.id === reviewId);
  assert(savedReview, 'Saved review found');
  assert(!savedReview.name.includes('<script>'), 'Script tag stripped from review author name');
  assert(!savedReview.comment.includes('<img src=x'), 'Image onerror payload stripped from review comment');
  console.log('  ✓ Stored XSS attempt neutralized: <script> and HTML payloads stripped');

  // Admin deletes review
  const delReviewRes = await callEdge(`/api/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(delReviewRes.status, 200, 'Admin successfully deleted review');
  console.log('  ✓ Admin review management (delete) verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 7. Persistent Cart Sync');
  // --------------------------------------------------------------------------
  const cartItems = [
    { productId: 'honey-sundarban-01', variantIndex: 0, quantity: 2 },
    { productId: 'ghee-buffalo-07', variantIndex: 0, quantity: 1 }
  ];

  const saveCartRes = await callEdge('/api/cart', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: { items: cartItems }
  });
  assert.strictEqual(saveCartRes.status, 200, 'PUT /api/cart returns 200');

  const getCartRes = await callEdge('/api/cart', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.strictEqual(getCartRes.status, 200, 'GET /api/cart returns 200');
  assert.strictEqual(getCartRes.data.items.length, 2, 'Cart items match saved items');
  console.log('  ✓ Persistent cart sync verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 8. Real OAuth 2.0 & Token Verification (Google, Facebook & Auth0)');
  // --------------------------------------------------------------------------
  const providers = await callEdge('/api/auth/providers');
  assert.strictEqual(providers.status, 200, 'GET /api/auth/providers returns 200');
  assert(providers.data.providers.auth0 && providers.data.providers.google && providers.data.providers.facebook, 'Provider flags valid');

  const auth0Res = await callEdge('/api/auth/auth0');
  assert.strictEqual(auth0Res.status, 302, 'GET /api/auth/auth0 responds with redirect 302');

  const googleRedirect = await callEdge('/api/auth/google');
  assert.strictEqual(googleRedirect.status, 302, 'GET /api/auth/google responds with redirect 302');
  assert(googleRedirect.headers.get('location')?.includes('accounts.google.com'), 'Google redirect points to accounts.google.com');

  const fbRedirect = await callEdge('/api/auth/facebook');
  assert.strictEqual(fbRedirect.status, 302, 'GET /api/auth/facebook responds with redirect 302');
  assert(fbRedirect.headers.get('location')?.includes('facebook.com'), 'Facebook redirect points to facebook.com');

  // Verify GIS / Google Token verification endpoint guard
  const gVerifyRes = await callEdge('/api/auth/google/verify-credential', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  assert.strictEqual(gVerifyRes.status, 400, 'POST /api/auth/google/verify-credential rejects empty payload with 400');

  // Verify Facebook Token verification endpoint guard
  const fbVerifyRes = await callEdge('/api/auth/facebook/verify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {}
  });
  assert.strictEqual(fbVerifyRes.status, 400, 'POST /api/auth/facebook/verify-token rejects empty payload with 400');
  console.log('  ✓ Real OAuth 2.0 redirects, GIS credential guards, and Facebook token verification verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 9. Payment Facilitation Endpoints');
  // --------------------------------------------------------------------------
  const payStatus = await callEdge('/api/payments/status');
  assert.strictEqual(payStatus.status, 200, 'GET /api/payments/status returns 200');

  const payInit = await callEdge('/api/payments/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'Asbi', phone: '01711223344', address: 'Dhaka', totalAmount: 1500, method: 'bkash' }
  });
  assert.strictEqual(payInit.status, 200, 'POST /api/payments/initiate returns 200');
  console.log('  ✓ Payment gateways endpoints verified');

  // --------------------------------------------------------------------------
  console.log('\n📌 10. Real-time Admin SSE Stream');
  // --------------------------------------------------------------------------
  const sseRes = await callEdge(`/api/admin/orders/stream?token=${encodeURIComponent(adminToken)}`);
  assert.strictEqual(sseRes.status, 200, 'Admin SSE stream returns 200');
  assert(sseRes.headers.get('content-type')?.includes('text/event-stream'), 'Content-Type is text/event-stream');
  console.log('  ✓ Admin SSE order stream connection returns 200 text/event-stream');

  console.log('\n🎉 ALL 10 TEST SUITES PASSED! Cloudflare Pages Native Backend is 100% operational and fully self-contained!\n');
}

testNativeEdgeBackend().catch(err => {
  console.error('\n❌ Edge Backend Test Failed:', err);
  process.exit(1);
});
