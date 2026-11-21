const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('Building static production bundle for Cloudflare Pages...');

// Ensure clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy css, js, assets, footages, brand to dist
copyDir(path.join(rootDir, 'frontend', 'css'), path.join(distDir, 'css'));
copyDir(path.join(rootDir, 'frontend', 'js'), path.join(distDir, 'js'));
copyDir(path.join(rootDir, 'frontend', 'assets'), path.join(distDir, 'assets'));
if (fs.existsSync(path.join(rootDir, 'footages'))) {
  copyDir(path.join(rootDir, 'footages'), path.join(distDir, 'footages'));
}

// Copy top-level frontend images / pdfs
const frontendFiles = fs.readdirSync(path.join(rootDir, 'frontend'), { withFileTypes: true });
for (const f of frontendFiles) {
  if (!f.isDirectory()) {
    fs.copyFileSync(path.join(rootDir, 'frontend', f.name), path.join(distDir, f.name));
  }
}

// 2. Process all HTML files in frontend/html
const htmlDir = path.join(rootDir, 'frontend', 'html');
if (fs.existsSync(htmlDir)) {
  const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    let content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    
    // Replace relative paths like "../css/" or "../js/" with "css/" and "js/"
    // so they resolve cleanly at the root of dist
    content = content.replace(/href="\.\.\/css\//g, 'href="css/');
    content = content.replace(/src="\.\.\/js\//g, 'src="js/');
    content = content.replace(/href="\.\.\/assets\//g, 'href="assets/');
    content = content.replace(/src="\.\.\/assets\//g, 'src="assets/');
    content = content.replace(/src="\.\.\/footages\//g, 'src="footages/');

    // Write to root of dist (e.g. dist/index.html, dist/category.html)
    fs.writeFileSync(path.join(distDir, file), content, 'utf8');
  }
}

// 3. Copy Cloudflare Pages Functions
if (fs.existsSync(path.join(rootDir, 'functions'))) {
  copyDir(path.join(rootDir, 'functions'), path.join(distDir, 'functions'));
}

// 4. Create Cloudflare Pages _routes.json
const routesJson = {
  version: 1,
  include: ["/api/*"],
  exclude: []
};
fs.writeFileSync(path.join(distDir, '_routes.json'), JSON.stringify(routesJson, null, 2), 'utf8');

// 5. Create Cloudflare Pages _redirects (Clean 200 rewrites for single-page routing)
const redirectsContent = `# Cloudflare Pages Clean Route Rewrites
/admin          /admin.html          200
/login          /login.html          200
/profile        /profile.html        200
/track-order    /track-order.html    200
/category       /category.html       200
/wishlist       /wishlist.html       200
/contact        /contact.html        200
/about          /about.html          200
/faq            /faq.html            200
/terms          /terms.html          200
/privacy-policy /privacy-policy.html 200
/return-policy  /return-policy.html  200
/delivery-policy /delivery-policy.html 200
`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent, 'utf8');

// 6. Create Cloudflare Pages _headers (Security Headers)
const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
/api/*
  Cache-Control: no-store, no-cache, must-revalidate
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
`;
fs.writeFileSync(path.join(distDir, '_headers'), headersContent, 'utf8');

console.log('✅ Build complete! dist ready with Pages Functions, _routes.json, _redirects, and _headers.');
