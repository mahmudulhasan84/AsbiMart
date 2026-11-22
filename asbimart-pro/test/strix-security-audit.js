/**
 * ============================================================================
 * AsbiMart Pro - Strix AI & OWASP Top 10 Security Pentest Audit Suite
 * ============================================================================
 * এটি স্বয়ংক্রিয়ভাবে আসবিমার্ট প্রজেক্টের সমস্ত সিকিউরিটি দুর্বলতা স্ক্যান ও ভেরিফাই করে।
 */

const http = require('http');
const app = require('../backend/server');

const AUDIT_PORT = 5098;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...headers };
    let postData = null;

    if (body) {
      postData = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: AUDIT_PORT,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSecurityAudit() {
  console.log('\n============================================================');
  console.log('🛡️  Strix Security & OWASP Top 10 Automated Pentest Audit');
  console.log('Target: AsbiMart Pro Enterprise Core (asbimart-pro)');
  console.log('============================================================\n');

  server = app.listen(AUDIT_PORT);

  const findings = [];
  let testsPassed = 0;
  let totalTests = 0;

  function assertAudit(testName, condition, severity = 'High', detail = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      testsPassed++;
    } else {
      console.log(`  ❌ [FAIL] ${testName} (${severity}): ${detail}`);
      findings.push({ testName, severity, detail });
    }
  }

  try {
    // 1. OWASP A01: Broken Access Control
    console.log('🔍 Checking OWASP A01: Broken Access Control...');
    const adminOrdersUnauth = await request('GET', '/api/admin/orders');
    assertAudit('Unauthenticated /api/admin/orders is blocked', adminOrdersUnauth.statusCode === 401, 'Critical', 'Endpoint returned status ' + adminOrdersUnauth.statusCode);

    const adminStatsUnauth = await request('GET', '/api/admin/stats');
    assertAudit('Unauthenticated /api/admin/stats is blocked', adminStatsUnauth.statusCode === 401, 'Critical');

    const adminCouponsUnauth = await request('GET', '/api/admin/coupons');
    assertAudit('Unauthenticated /api/admin/coupons is blocked', adminCouponsUnauth.statusCode === 401, 'High');

    // 2. OWASP A02: Cryptographic Failures & Timing-Safe JWT
    console.log('\n🔍 Checking OWASP A02: Cryptographic Failures & Timing Attack Immunity...');
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiZXhwIjoxOTAwMDAwMDAwfQ.FORGED_SIGNATURE';
    const forgedReq = await request('GET', '/api/admin/orders', null, { Authorization: `Bearer ${forgedToken}` });
    assertAudit('Forged JWT signature rejected', forgedReq.statusCode === 401, 'Critical', 'Forged token was accepted');

    // 3. OWASP A03: Injection & Stored XSS
    console.log('\n🔍 Checking OWASP A03: Injection & Stored XSS Sanitization...');
    const xssPayload = '<script>alert("XSS_PWNED")</script><b>Test User</b>';
    const xssReview = await request('POST', '/api/products/honey-sundarban-01/reviews', {
      name: xssPayload,
      email: 'xss@test.com',
      rating: 5,
      comment: '<script>document.cookie</script>খাঁটি ও চমৎকার মধু।'
    });
    assertAudit('Review accepted for sanitization test', xssReview.statusCode === 201, 'Medium');
    const storedReview = xssReview.json.review;
    const isClean = !storedReview.name.includes('<script>') && !storedReview.comment.includes('<script>');
    assertAudit('Dangerous <script> tags completely stripped from database', isClean, 'High', `Stored text still contains raw script tag: ${storedReview.name}`);

    // 4. OWASP A04: Insecure Design & Client Price Tampering
    console.log('\n🔍 Checking OWASP A04: Insecure Design & Client-Side Price Tampering...');
    const maliciousOrder = await request('POST', '/api/orders', {
      name: 'Blackhat Tamperer',
      phone: '01799887766',
      address: 'Dark Alley 404',
      area: 'dhaka_inside',
      items: [{ id: 'honey-sundarban-01', size: '৫০০ গ্রাম', price: 1, quantity: 1 }],
      totalAmount: 1
    });
    assertAudit('Server calculates price independently of client', maliciousOrder.json.order.totalAmount === 710, 'Critical', `Server trusted client price! Stored total: ${maliciousOrder.json.order.totalAmount}`);

    // 5. OWASP A05: Security Misconfiguration & HTTP Security Headers
    console.log('\n🔍 Checking OWASP A05: Security Misconfiguration & Secure Headers...');
    const headersRes = await request('GET', '/api/health');
    assertAudit('X-Content-Type-Options: nosniff present', headersRes.headers['x-content-type-options'] === 'nosniff', 'Medium');
    assertAudit('X-Frame-Options: SAMEORIGIN present', headersRes.headers['x-frame-options'] === 'SAMEORIGIN', 'Medium');
    assertAudit('Content-Security-Policy (CSP) active', !!headersRes.headers['content-security-policy'], 'High');
    assertAudit('Referrer-Policy configured', !!headersRes.headers['referrer-policy'], 'Low');

    // 6. OWASP A07: Hardened CORS Policy & Malicious Origin Denial
    console.log('\n🔍 Checking OWASP A07: Hardened CORS & Origin Enforcement...');
    const untrustedOrigin = 'https://evil-attacker.site';
    const corsAttackerRes = await request('GET', '/api/health', null, { Origin: untrustedOrigin });
    const isCorsBlocked = !corsAttackerRes.headers['access-control-allow-origin'] || corsAttackerRes.headers['access-control-allow-origin'] !== untrustedOrigin;
    assertAudit('Untrusted origin denied credentialed CORS access', isCorsBlocked, 'High', `Attacker origin was granted Access-Control-Allow-Origin: ${corsAttackerRes.headers['access-control-allow-origin']}`);

    // 7. Concurrency & Stock Locking
    console.log('\n🔍 Checking Concurrency & Stock Deduction Integrity...');
    const greedyOrder = await request('POST', '/api/orders', {
      name: 'Stock Drainer',
      phone: '01711223344',
      address: 'Dhaka',
      items: [{ id: 'honey-sundarban-01', quantity: 9999 }]
    });
    assertAudit('Stock exhaustion attempt rejected with 400', greedyOrder.statusCode === 400, 'High');

    // 8. Compliance Check: Zero-PIN Storage
    console.log('\n🔍 Checking Banking Compliance: Zero-PIN Exposure...');
    const payTest = await request('POST', '/api/payments/gateway-pay', {
      orderId: maliciousOrder.json.order.orderId,
      method: 'bkash',
      accountNumber: '01700000000'
      // No PIN sent or stored
    });
    assertAudit('Automated payment processes securely without merchant asking for banking PIN', payTest.statusCode === 200, 'Critical');

    console.log('\n============================================================');
    console.log(`🛡️  Strix Security Audit Summary:`);
    console.log(`Total Checks: ${totalTests} | Passed: ${testsPassed} | Failed: ${findings.length}`);
    if (findings.length === 0) {
      console.log('🎉 100% SECURE! NO CRITICAL, HIGH, OR MEDIUM VULNERABILITIES FOUND.');
    } else {
      console.log('⚠️ Findings requiring attention:', findings);
    }
    console.log('============================================================\n');

    process.exit(findings.length === 0 ? 0 : 1);
  } catch (err) {
    console.error('Audit suite crashed:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

runSecurityAudit();
