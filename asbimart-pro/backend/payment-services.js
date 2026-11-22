/**
 * ============================================================================
 * AsbiMart — Real Payment Gateways (bKash Tokenized, SSLCommerz) & Order Emails
 * ============================================================================
 * - Real Official bKash Tokenized Checkout API v1.2.0-beta (Grant -> Create -> Execute)
 * - Real Official SSLCommerz API v4 (Supports real bKash OTP, Nagad OTP, Rocket, Visa/Mastercard)
 * - Real Order Confirmation & Admin Order Alert Emails via Gmail SMTP (Nodemailer)
 */

const nodemailer = require('nodemailer');

function isConfigured(val) {
  if (!val) return false;
  const v = String(val).trim();
  if (!v || v.startsWith('your_') || v.includes('REPLACE_ME')) return false;
  return true;
}

function getBaseUrl(req) {
  if (process.env.BASE_URL && process.env.BASE_URL.trim()) {
    return process.env.BASE_URL.trim().replace(/\/+$/, '');
  }
  if (req) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    return `${proto}://${host}`;
  }
  return `http://localhost:${process.env.PORT || 5000}`;
}

function getPaymentGatewaysStatus(req) {
  const baseUrl = getBaseUrl(req);
  const bkash =
    isConfigured(process.env.BKASH_APP_KEY) &&
    isConfigured(process.env.BKASH_APP_SECRET) &&
    isConfigured(process.env.BKASH_USERNAME) &&
    isConfigured(process.env.BKASH_PASSWORD);

  const sslcommerz =
    isConfigured(process.env.SSLCOMMERZ_STORE_ID) &&
    isConfigured(process.env.SSLCOMMERZ_STORE_PASS);

  const emailNotify =
    isConfigured(process.env.SMTP_USER) &&
    isConfigured(process.env.SMTP_PASS);

  return {
    bkash,
    sslcommerz,
    manualMfs: true,
    cod: true,
    emailNotify,
    merchantNumber: (process.env.MERCHANT_MFS_NUMBER || '01821-296056').trim(),
    callbacks: {
      bkash: `${baseUrl}/api/payments/bkash/callback`,
      sslSuccess: `${baseUrl}/api/payments/sslcommerz/success`,
      sslFail: `${baseUrl}/api/payments/sslcommerz/fail`,
      sslCancel: `${baseUrl}/api/payments/sslcommerz/cancel`,
      sslIpn: `${baseUrl}/api/payments/sslcommerz/ipn`
    }
  };
}

// ==========================================
// ১. রিয়েল bKash Tokenized Checkout API (v1.2.0-beta)
// ==========================================
function getBkashBaseUrl() {
  const isLive = String(process.env.BKASH_IS_LIVE || 'false').toLowerCase() === 'true';
  if (process.env.BKASH_BASE_URL && process.env.BKASH_BASE_URL.trim()) {
    return process.env.BKASH_BASE_URL.trim().replace(/\/+$/, '');
  }
  return isLive
    ? 'https://tokenized.pay.bka.sh/v1.2.0-beta'
    : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
}

async function getBkashGrantToken() {
  const baseUrl = getBkashBaseUrl();
  const res = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      username: process.env.BKASH_USERNAME.trim(),
      password: process.env.BKASH_PASSWORD.trim()
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_APP_KEY.trim(),
      app_secret: process.env.BKASH_APP_SECRET.trim()
    })
  });
  const data = await res.json();
  if (!res.ok || !data.id_token) {
    throw new Error(data.statusMessage || data.msg || 'bKash grant token failed');
  }
  return data.id_token;
}

async function createBkashPayment({ req, order }) {
  const baseUrl = getBkashBaseUrl();
  const idToken = await getBkashGrantToken();
  const callbackURL = `${getBaseUrl(req)}/api/payments/bkash/callback?orderId=${encodeURIComponent(order.orderId)}`;

  const res = await fetch(`${baseUrl}/tokenized/checkout/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: idToken,
      'X-APP-Key': process.env.BKASH_APP_KEY.trim()
    },
    body: JSON.stringify({
      mode: '0011',
      payerReference: order.customer.phone || order.orderId,
      callbackURL,
      amount: String(order.totalAmount),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: order.orderId
    })
  });

  const data = await res.json();
  if (!res.ok || !data.bkashURL || !data.paymentID) {
    throw new Error(data.statusMessage || 'bKash payment creation failed');
  }

  return {
    paymentID: data.paymentID,
    bkashURL: data.bkashURL
  };
}

async function executeBkashPayment(paymentID) {
  const baseUrl = getBkashBaseUrl();
  const idToken = await getBkashGrantToken();

  const res = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: idToken,
      'X-APP-Key': process.env.BKASH_APP_KEY.trim()
    },
    body: JSON.stringify({ paymentID })
  });

  const data = await res.json();
  if (!res.ok || data.transactionStatus !== 'Completed') {
    throw new Error(data.statusMessage || 'bKash payment execution was not completed');
  }

  return {
    trxID: data.trxID,
    paymentID: data.paymentID,
    customerMsisdn: data.customerMsisdn || '',
    amount: Number(data.amount || 0),
    transactionStatus: data.transactionStatus
  };
}

// ==========================================
// ২. রিয়েল SSLCommerz API v4 (bKash, Nagad, Rocket, Visa, Mastercard)
// ==========================================
function getSslcommerzBaseUrl() {
  const isLive = String(process.env.SSLCOMMERZ_IS_LIVE || 'false').toLowerCase() === 'true';
  return isLive ? 'https://securepay.sslcommerz.com' : 'https://sandbox.sslcommerz.com';
}

async function initiateSslcommerzPayment({ req, order }) {
  const baseUrl = getBaseUrl(req);
  const sslUrl = `${getSslcommerzBaseUrl()}/gwprocess/v4/api.php`;

  const itemNames = (order.items || []).map(i => i.name || i.banglaName || 'Organic Item').join(', ').slice(0, 200) || 'AsbiMart Organic Products';

  const formBody = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID.trim(),
    store_passwd: process.env.SSLCOMMERZ_STORE_PASS.trim(),
    total_amount: String(order.totalAmount),
    currency: 'BDT',
    tran_id: order.orderId,
    success_url: `${baseUrl}/api/payments/sslcommerz/success`,
    fail_url: `${baseUrl}/api/payments/sslcommerz/fail`,
    cancel_url: `${baseUrl}/api/payments/sslcommerz/cancel`,
    ipn_url: `${baseUrl}/api/payments/sslcommerz/ipn`,
    shipping_method: 'Courier',
    product_name: itemNames,
    product_category: 'Organic Food',
    product_profile: 'physical-goods',
    cus_name: order.customer.name || 'Customer',
    cus_email: order.customer.email || 'customer@asbimart.com',
    cus_add1: order.customer.address || 'Dhaka, Bangladesh',
    cus_city: order.customer.area === 'dhaka' || order.customer.area === 'dhaka_inside' ? 'Dhaka' : 'Bangladesh',
    cus_country: 'Bangladesh',
    cus_phone: order.customer.phone || '01821296056',
    ship_name: order.customer.name || 'Customer',
    ship_add1: order.customer.address || 'Dhaka, Bangladesh',
    ship_city: 'Dhaka',
    ship_postcode: '1212',
    ship_country: 'Bangladesh'
  });

  const res = await fetch(sslUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  });

  const data = await res.json();
  if (!res.ok || data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(data.failedreason || 'SSLCommerz session initiation failed');
  }

  return {
    sessionKey: data.sessionkey || '',
    gatewayUrl: data.GatewayPageURL
  };
}

async function validateSslcommerzTransaction(valId) {
  const params = new URLSearchParams({
    val_id: valId,
    store_id: process.env.SSLCOMMERZ_STORE_ID.trim(),
    store_passwd: process.env.SSLCOMMERZ_STORE_PASS.trim(),
    format: 'json'
  });

  const res = await fetch(`${getSslcommerzBaseUrl()}/validator/api/validationserverAPI.php?${params.toString()}`);
  const data = await res.json();
  const valid = data && (data.status === 'VALID' || data.status === 'VALIDATED');
  return { valid, data };
}

// ==========================================
// ৩. রিয়েল অর্ডার কনফার্মেশন ও অ্যাডমিন অ্যালার্ট ইমেইল (Gmail SMTP)
// ==========================================
async function sendOrderEmails(order) {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();
  if (!isConfigured(user) || !isConfigured(pass)) return { sent: false };

  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false';
  const fromName = (process.env.SMTP_FROM_NAME || 'AsbiMart Orders').trim();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 8px 10px; border-bottom: 1px solid #E5DACB; font-size: 13px; color: #1E293B;">${String(item.name || item.banglaName || 'Product').replace(/[<>]/g, '')} ${item.size || item.variant ? `(${String(item.size || item.variant).replace(/[<>]/g, '')})` : ''}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #E5DACB; font-size: 13px; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #E5DACB; font-size: 13px; text-align: right; font-weight: bold;">৳${item.price || 0}</td>
    </tr>
  `).join('');

  const trxHtml = order.transactionId
    ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Transaction ID:</strong> <span style="color: #059669; font-weight: bold;">${String(order.transactionId).replace(/[<>]/g, '')}</span></p>`
    : '';

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #F4ECE1; padding: 24px; border-radius: 18px; border: 1px solid #E5DACB;">
      <div style="background: #1E3A8A; color: #ffffff; padding: 20px 24px; border-radius: 14px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Asbi<span style="color: #F59E0B;">Mart</span></h1>
        <p style="margin: 6px 0 0; font-size: 13px; color: #BFDBFE;">Order Confirmation • #${order.orderId}</p>
      </div>
      <div style="background: #ffffff; padding: 22px; border-radius: 14px; margin-top: 14px; border: 1px solid #E5DACB;">
        <p style="margin: 0 0 12px; font-size: 14px; color: #1E293B;">Thank you, <strong>${String(order.customer.name || 'Customer').replace(/[<>]/g, '')}</strong>! Your order has been received.</p>
        <div style="background: #F8FAFC; padding: 12px 14px; border-radius: 10px; border: 1px solid #E2E8F0; margin-bottom: 16px;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Order ID:</strong> #${order.orderId}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${String(order.customer.phone || '').replace(/[<>]/g, '')}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Address:</strong> ${String(order.customer.address || '').replace(/[<>]/g, '')}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Payment Method:</strong> ${String(order.paymentMethod || 'COD').replace(/[<>]/g, '')}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Payment Status:</strong> ${String(order.paymentStatus || 'Pending').replace(/[<>]/g, '')}</p>
          ${trxHtml}
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F4ECE1;">
              <th style="padding: 8px 10px; text-align: left; font-size: 12px;">Item</th>
              <th style="padding: 8px 10px; text-align: center; font-size: 12px;">Qty</th>
              <th style="padding: 8px 10px; text-align: right; font-size: 12px;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="margin-top: 14px; text-align: right; font-size: 16px; font-weight: 900; color: #1E3A8A;">
          Total Payable: ৳${order.totalAmount}
        </div>
      </div>
      <p style="text-align: center; font-size: 11px; color: #64748B; margin: 14px 0 0;">
        Hotline: 01821-296056 • Satarkul, Badda, Dhaka, Bangladesh
      </p>
    </div>
  `;

  try {
    // ১. অ্যাডমিন (আসবি)-কে তাৎক্ষণিক নতুন অর্ডার অ্যালার্ট পাঠানো
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: user,
      subject: `🛒 New Order #${order.orderId} — ৳${order.totalAmount} (${order.customer.name})`,
      html: emailHtml
    });

    // ২. গ্রাহকের ইমেইল থাকলে তাকেও অর্ডার কনফার্মেশন রসিদ পাঠানো
    const custEmail = order.customer && order.customer.email ? String(order.customer.email).trim() : '';
    if (custEmail && custEmail.includes('@') && custEmail.toLowerCase() !== user.toLowerCase()) {
      await transporter.sendMail({
        from: `"${fromName}" <${user}>`,
        to: custEmail,
        subject: `✅ Order Confirmed #${order.orderId} — AsbiMart`,
        html: emailHtml
      });
    }
    return { sent: true };
  } catch (err) {
    console.error('[Order Email Error]:', err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = {
  getPaymentGatewaysStatus,
  createBkashPayment,
  executeBkashPayment,
  initiateSslcommerzPayment,
  validateSslcommerzTransaction,
  sendOrderEmails
};
