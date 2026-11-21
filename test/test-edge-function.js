const assert = require('assert');

async function testEdgeFunction() {
  console.log('🧪 Testing Cloudflare Pages Edge Function Gateway...');

  // Dynamically import the edge function ES module
  const edgeModule = await import('../functions/api/[[path]].js');

  // 1. Test OPTIONS preflight
  const optRes = await edgeModule.onRequestOptions();
  assert.strictEqual(optRes.status, 204, 'OPTIONS returns 204');
  assert.strictEqual(optRes.headers.get('Access-Control-Allow-Origin'), '*', 'CORS origin is *');
  console.log('  ✓ Edge CORS preflight OPTIONS returns 204 OK');

  // 2. Test onRequest for /api/products when upstream backend is offline (Fallback test)
  const mockContextOffline = {
    request: new Request('https://asbimart.pages.dev/api/products', {
      method: 'GET',
      headers: { 'Host': 'asbimart.pages.dev', 'cf-connecting-ip': '203.0.113.195' }
    }),
    env: {
      BACKEND_URL: 'http://127.0.0.1:59999' // non-existent offline port
    },
    params: {}
  };

  const offlineRes = await edgeModule.onRequest(mockContextOffline);
  assert.strictEqual(offlineRes.status, 200, 'Offline /api/products returns 200 via edge fallback');
  const offlineData = await offlineRes.json();
  assert.strictEqual(offlineData.success, true, 'Fallback data success is true');
  assert.strictEqual(offlineData.products.length, 39, 'Fallback delivers all 39 products');
  assert.strictEqual(offlineData.source, 'cloudflare-edge-cache', 'Source is cloudflare-edge-cache');
  console.log('  ✓ Edge fallback delivers all 39 products when upstream is offline or cold-starting');

  // 3. Test single product fallback
  const mockSingleProd = {
    request: new Request('https://asbimart.pages.dev/api/products/honey-sundarban-01', {
      method: 'GET',
      headers: { 'Host': 'asbimart.pages.dev' }
    }),
    env: { BACKEND_URL: 'http://127.0.0.1:59999' },
    params: {}
  };
  const singleRes = await edgeModule.onRequest(mockSingleProd);
  assert.strictEqual(singleRes.status, 200, 'Single product returns 200 via edge fallback');
  const singleData = await singleRes.json();
  assert.strictEqual(singleData.product.id, 'honey-sundarban-01', 'Product ID matches');
  console.log('  ✓ Edge fallback delivers single product detail (honey-sundarban-01)');

  // 4. Test health check fallback
  const mockHealth = {
    request: new Request('https://asbimart.pages.dev/api/health', {
      method: 'GET',
      headers: { 'Host': 'asbimart.pages.dev' }
    }),
    env: { BACKEND_URL: 'http://127.0.0.1:59999' },
    params: {}
  };
  const healthRes = await edgeModule.onRequest(mockHealth);
  assert.strictEqual(healthRes.status, 200, 'Health check returns 200 via edge gateway');
  console.log('  ✓ Edge gateway health check returns 200 OK');

  // 5. Test Live Upstream Proxy with Host header rewrite against Railway live backend
  const mockLiveReq = {
    request: new Request('https://asbimart.pages.dev/api/health', {
      method: 'GET',
      headers: {
        'Host': 'asbimart.pages.dev', // Host header from client that previously broke Railway!
        'cf-connecting-ip': '103.145.120.1'
      }
    }),
    env: {
      BACKEND_URL: 'https://asbimart-production.up.railway.app'
    },
    params: {}
  };

  const liveRes = await edgeModule.onRequest(mockLiveReq);
  assert.strictEqual(liveRes.status, 200, 'Live Railway proxy returns 200 OK without 404 host mismatch');
  const liveData = await liveRes.json();
  assert.strictEqual(liveData.status, 'success', 'Upstream returned success status');
  console.log('  ✓ Live Railway proxy works seamlessly with Host header rewrite (200 OK)');

  console.log('\n🎉 Cloudflare Pages Edge Function Gateway verified 100% successfully!\n');
}

testEdgeFunction().catch(err => {
  console.error('Edge Function Test Failed:', err);
  process.exit(1);
});
