/**
 * ============================================================================
 * AsbiMart (আসবিমার্ট) - Cloudflare Unified Edge Worker
 * ============================================================================
 * - Full Native Serverless Backend on Cloudflare Edge (0 external dependencies)
 * - Directly handles all /api/* routes (Products, Orders, Auth, Reviews, Cart, Tracking, Payments)
 * - Seamlessly serves all HTML pages and static assets without infinite redirect loops
 * - Clean URLs (/category, /login, /about, etc.) mapped directly to HTML files
 */

import { onRequest, onRequestOptions } from './functions/api/edge-api.js';

const HTML_ROUTES = {
  '/': '/index.html',
  '/index': '/index.html',
  '/category': '/category.html',
  '/login': '/login.html',
  '/about': '/about.html',
  '/contact': '/contact.html',
  '/faq': '/faq.html',
  '/terms': '/terms.html',
  '/privacy-policy': '/privacy-policy.html',
  '/return-policy': '/return-policy.html',
  '/delivery-policy': '/delivery-policy.html',
  '/profile': '/profile.html',
  '/track-order': '/track-order.html',
  '/wishlist': '/wishlist.html',
  '/admin': '/admin.html'
};

export default {
  async fetch(request, env = {}, ctx = {}) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method.toUpperCase();

    // 1. CORS Preflight
    if (method === 'OPTIONS') {
      return onRequestOptions();
    }

    // 2. Edge API Routes (/api/*)
    if (pathname.startsWith('/api/') || pathname === '/api') {
      return onRequest({ request, env, params: {} });
    }

    // 3. Static Assets serving via Cloudflare Worker Static Assets binding (env.ASSETS)
    if (env.ASSETS) {
      const targetHtml = HTML_ROUTES[pathname];
      if (targetHtml) {
        const rewrittenUrl = new URL(targetHtml + url.search, request.url);
        return env.ASSETS.fetch(new Request(rewrittenUrl, request));
      }
      return env.ASSETS.fetch(request);
    }

    // 4. Standalone worker fallback
    return new Response('AsbiMart Edge Worker Active.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
