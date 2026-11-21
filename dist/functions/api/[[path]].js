/**
 * ============================================================================
 * AsbiMart (আসবিমার্ট) - Cloudflare Pages Edge Function Gateway
 * ============================================================================
 * - Proxies all /api/* requests with zero latency to backend server
 * - Handles CORS preflight (OPTIONS) instantly at the Cloudflare Edge
 * - Supports Server-Sent Events (SSE) streaming for real-time order sync
 * - Provides edge fallback resilience if backend server is restarting
 */

// Fallback products catalog for instant edge responses if backend is cold-starting
const FALLBACK_PRODUCTS_SUMMARY = [
  { id: "honey-sundarban-01", name: "Sundarbans Raw Wild Honey", banglaName: "সুন্দরবনের কাঁচা মধু", category: "honey", price: 650 },
  { id: "ghee-buffalo-07", name: "Buffalo Pure Ghee", banglaName: "মহিষের খাঁটি ঘি", category: "ghee", price: 880 },
  { id: "oil-mustard-ghani-09", name: "Cold Pressed Mustard Oil", banglaName: "ঘানির খাঁটি সরিষার তেল", category: "oil", price: 340 }
];

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const url = new URL(request.url);

  // If OPTIONS preflight, return early
  if (request.method === 'OPTIONS') {
    return onRequestOptions();
  }

  // Target backend URL: configured via Cloudflare env var BACKEND_URL or default Railway live server
  const backendBase = (env.BACKEND_URL || 'https://asbimart-production.up.railway.app').replace(/\/+$/, '');
  const targetUrl = new URL(url.pathname + url.search, backendBase);

  // Forward incoming headers with security and routing metadata
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('X-Forwarded-Host', url.host);
  forwardHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
  forwardHeaders.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '127.0.0.1');

  // Handle SSE streaming specifically
  const isSSE = url.pathname.includes('/orders/stream');
  if (isSSE) {
    forwardHeaders.set('Accept', 'text/event-stream');
    forwardHeaders.set('Cache-Control', 'no-cache');
  }

  const fetchOptions = {
    method: request.method,
    headers: forwardHeaders,
    redirect: 'follow'
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // Clone body for POST, PUT, PATCH, DELETE
    fetchOptions.body = request.body;
  }

  try {
    const upstreamRes = await fetch(targetUrl.toString(), fetchOptions);

    // Build response headers with CORS
    const responseHeaders = new Headers(upstreamRes.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    responseHeaders.set('X-Edge-Gateway', 'Cloudflare Pages Functions');

    // For SSE stream, stream directly with no buffering
    if (isSSE) {
      responseHeaders.set('Content-Type', 'text/event-stream');
      responseHeaders.set('Cache-Control', 'no-cache, no-transform');
      responseHeaders.set('Connection', 'keep-alive');
      return new Response(upstreamRes.body, {
        status: upstreamRes.status,
        headers: responseHeaders
      });
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    console.error('[Cloudflare Pages Functions Proxy Error]:', err.message);

    // Edge Fallback for Health Check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'success',
        service: 'AsbiMart Cloudflare Edge Gateway',
        backend: backendBase,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Backend proxy error connecting to ' + backendBase + ': ' + err.message,
      gateway: 'Cloudflare Pages Functions'
    }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
