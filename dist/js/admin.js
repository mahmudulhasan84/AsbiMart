// AsbiMart - Admin Panel Logic Script (Default English Edition)

let adminProducts = [];
let adminOrders = [];
let currentOrderFilter = 'all';

// ==========================================
// 0. Admin Authentication & Security
// ==========================================
function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('asbi_admin_auth') === 'true';
  const gate = document.getElementById('adminLoginGate');
  const mainApp = document.getElementById('adminMainApp');

  if (isAuth) {
    if (gate) gate.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');
    initAdminData();
  } else {
    if (gate) gate.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const idInput = document.getElementById('adminLoginId');
  const passInput = document.getElementById('adminLoginPass');
  const errElem = document.getElementById('adminLoginError');

  const id = idInput ? idInput.value.trim() : '';
  const pass = passInput ? passInput.value.trim() : '';

  // Protected credentials: ID: asbi, Password: asbi123
  if (id === 'asbi' && pass === 'asbi123') {
    sessionStorage.setItem('asbi_admin_auth', 'true');
    if (errElem) errElem.classList.add('hidden');
    checkAdminAuth();
  } else {
    if (errElem) errElem.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  if (confirm("Are you sure you want to sign out from the Admin Panel?")) {
    sessionStorage.removeItem('asbi_admin_auth');
    checkAdminAuth();
  }
}

// Standard number formatter
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return typeof num === 'number' ? num.toLocaleString('en-US') : String(num);
}

// Smart API Base URL (connects to live production server even when opened from local file:/// or 127.0.0.1)
function getAdminApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const loc = window.location;
    if (loc.protocol === 'file:' || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1' || !loc.hostname) {
      return 'https://asbimart-production.up.railway.app';
    }
  }
  return '';
}

// Built-in initial orders seed (guarantees orders are visible immediately upon opening local file)
const INITIAL_ADMIN_ORDERS = [
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
    status: "Pending",
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
    status: "Pending",
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
    status: "Pending",
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
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    statusCode: "pending",
    courier: "রেডএক্স (RedX Express)",
    trackingCode: "REDX-ASBI-99238",
    notes: "প্যাকেজ সাবধানে পাঠাবেন।",
    createdAt: "2026-11-18T04:04:15.775Z"
  }
];

// ==========================================
// 1. Data Initialization & Server Sync
// ==========================================
async function initAdminData() {
  // 1. Products Initialization
  const storedProducts = localStorage.getItem('asbi_products_custom');
  if (storedProducts) {
    try {
      adminProducts = JSON.parse(storedProducts);
    } catch (e) {
      adminProducts = typeof PRODUCTS_DATA !== 'undefined' ? [...PRODUCTS_DATA] : [];
    }
  } else {
    adminProducts = typeof PRODUCTS_DATA !== 'undefined' ? [...PRODUCTS_DATA] : [];
    saveAdminProducts();
  }

  // 2. Orders Initialization (Load local + seed orders)
  const storedOrders = localStorage.getItem('asbi_orders');
  if (storedOrders) {
    try {
      adminOrders = JSON.parse(storedOrders);
    } catch (e) {
      adminOrders = [...INITIAL_ADMIN_ORDERS];
    }
  } else {
    adminOrders = [...INITIAL_ADMIN_ORDERS];
  }

  // Merge seed orders if not already present
  const orderMap = new Map();
  adminOrders.forEach(o => { if (o.orderId) orderMap.set(o.orderId.toLowerCase(), o); });
  INITIAL_ADMIN_ORDERS.forEach(s => {
    if (!orderMap.has(s.orderId.toLowerCase())) {
      adminOrders.push(s);
      orderMap.set(s.orderId.toLowerCase(), s);
    }
  });

  updateDashboardStats();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminReviewsList();

  // Fetch real orders from backend server (with base URL support)
  await fetchServerOrders();

  updateDashboardStats();
  renderAdminOrdersTable();
}

async function fetchServerOrders(showNotice = false) {
  try {
    const baseUrl = getAdminApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/admin/orders?t=` + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        // Prioritize server orders from backend/data/orders.json
        const existingMap = new Map();
        data.orders.forEach(o => { if (o.orderId) existingMap.set(o.orderId, o); });
        adminOrders.forEach(o => { if (o.orderId && !existingMap.has(o.orderId)) existingMap.set(o.orderId, o); });
        adminOrders = Array.from(existingMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        saveAdminOrders();
        renderAdminOrdersTable();
        updateDashboardStats();
        if (showNotice) {
          alert(`Successfully synced ${data.orders.length} live orders directly from server database!`);
        }
      }
    }
  } catch (e) {
    console.warn('[Admin] Server orders sync offline, using local storage.');
  }
}

async function refreshAdminData() {
  await fetchServerOrders(true);
  updateDashboardStats();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminReviewsList();
}

// Auto-poll new orders from server every 8 seconds
setInterval(async () => {
  if (sessionStorage.getItem('asbi_admin_auth') === 'true') {
    await fetchServerOrders(false);
  }
}, 8000);

function saveAdminProducts() {
  localStorage.setItem('asbi_products_custom', JSON.stringify(adminProducts));
  updateDashboardStats();
}

function saveAdminOrders() {
  localStorage.setItem('asbi_orders', JSON.stringify(adminOrders));
  updateDashboardStats();
}

// ==========================================
// 2. Tab Navigation
// ==========================================
function switchTab(tabId) {
  const tabs = ['dashboard', 'products', 'addproduct', 'orders', 'reviews'];
  const titles = {
    dashboard: 'Dashboard Overview',
    products: 'Product Inventory & Catalog',
    addproduct: 'Add New Product',
    orders: 'Customer Orders Management',
    reviews: 'Customer Reviews & Feedback'
  };

  tabs.forEach(t => {
    const sec = document.getElementById(`section-${t}`);
    const btn = document.getElementById(`btn-tab-${t}`);
    if (sec) sec.classList.toggle('hidden', t !== tabId);
    if (btn) {
      if (t === tabId) {
        btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all bg-white/15 text-white shadow-xs';
      } else {
        btn.className = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-blue-200 hover:bg-white/10 hover:text-white';
      }
    }
  });

  const titleElem = document.getElementById('topbarTitle');
  if (titleElem && titles[tabId]) titleElem.textContent = titles[tabId];
}

// ==========================================
// 3. Dashboard Metrics & Recent Orders
// ==========================================
function updateDashboardStats() {
  const totalProducts = adminProducts.length;
  const totalOrders = adminOrders.length;
  const totalSales = adminOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalReviews = adminProducts.reduce((sum, p) => sum + (p.reviewsCount || (p.reviews ? p.reviews.length : 0)), 0);

  const pCount = document.getElementById('statTotalProducts');
  const oCount = document.getElementById('statTotalOrders');
  const sCount = document.getElementById('statTotalSales');
  const rCount = document.getElementById('statTotalReviews');
  const sideP = document.getElementById('sidebarProductCount');
  const sideO = document.getElementById('sidebarOrderCount');

  if (pCount) pCount.textContent = formatNumber(totalProducts);
  if (oCount) oCount.textContent = formatNumber(totalOrders);
  if (sCount) sCount.textContent = `৳${formatNumber(totalSales)}`;
  if (rCount) rCount.textContent = formatNumber(totalReviews);
  if (sideP) sideP.textContent = String(totalProducts);
  if (sideO) sideO.textContent = String(totalOrders);

  // Recent Orders Preview in Dashboard
  const recentOrdersTbody = document.getElementById('dashboardRecentOrders');
  if (recentOrdersTbody) {
    if (adminOrders.length === 0) {
      recentOrdersTbody.innerHTML = `
        <tr>
          <td colspan="5" class="p-8 text-center text-slate-400 font-semibold">No orders yet. Customer checkouts will appear here in real-time.</td>
        </tr>
      `;
    } else {
      recentOrdersTbody.innerHTML = adminOrders.slice(0, 5).map(o => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3 font-bold text-blue-900">${o.orderId || 'ORD-NEW'}</td>
          <td class="p-3">
            <div class="font-bold text-slate-800">${o.customer ? o.customer.name : 'Customer'}</div>
            <div class="text-[11px] text-slate-400">${o.customer ? o.customer.phone : ''}</div>
          </td>
          <td class="p-3 max-w-xs truncate text-slate-600">${o.customer ? o.customer.address : ''}</td>
          <td class="p-3 font-bold text-emerald-700">৳${formatNumber(o.totalAmount)}</td>
          <td class="p-3">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${getOrderStatusClass(o.status || o.statusCode)}">
              ${cleanStatusDisplay(o.status || o.statusCode || 'Pending')}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }
}

function cleanStatusDisplay(status) {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase();
  if (s.includes('delivered') || s.includes('সম্পন্ন')) return 'Delivered';
  if (s.includes('processing') || s.includes('প্রক্রিয়াধীন')) return 'Processing';
  if (s.includes('cancelled') || s.includes('বাতিল')) return 'Cancelled';
  return 'Pending';
}

function getOrderStatusClass(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('delivered') || s.includes('সম্পন্ন')) return 'bg-emerald-100 text-emerald-800';
  if (s.includes('cancelled') || s.includes('বাতিল')) return 'bg-rose-100 text-rose-800';
  if (s.includes('processing') || s.includes('প্রক্রিয়াধীন')) return 'bg-blue-100 text-blue-800';
  return 'bg-amber-100 text-amber-800';
}

// ==========================================
// 4. Products Table Rendering & Actions
// ==========================================
function renderAdminProductsTable(productsToRender = adminProducts) {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  if (productsToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 font-semibold">No products found matching your filter!</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = productsToRender.map(p => {
    const v = p.variants && p.variants.length > 0 ? p.variants[0] : { price: 0, stock: 20, size: 'Standard' };
    const isLowStock = (v.stock || 0) < 10;
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-3.5">
          <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"/>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900 text-xs sm:text-sm">${p.name}</div>
          <div class="text-[11px] text-slate-400 font-bangla">${p.banglaName || ''}</div>
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
            ${p.category || 'Organic'}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-[#1E3A8A] text-xs sm:text-sm">৳${formatNumber(v.price)}</div>
          ${v.originalPrice ? `<div class="text-[10px] text-slate-400 line-through">৳${formatNumber(v.originalPrice)}</div>` : ''}
        </td>
        <td class="p-3.5">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-xs ${isLowStock ? 'text-rose-600' : 'text-emerald-700'}">
              ${formatNumber(v.stock || 25)} pcs
            </span>
            ${isLowStock ? `<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[9px] font-extrabold uppercase">Low</span>` : ''}
          </div>
        </td>
        <td class="p-3.5 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openEditProductModal('${p.id}')" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors" title="Edit Product">
              ✏️
            </button>
            <button onclick="deleteAdminProduct('${p.id}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors" title="Delete Product">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function handleAdminProductSearch(query) {
  const q = query.toLowerCase().trim();
  const filtered = adminProducts.filter(p => 
    (p.name && p.name.toLowerCase().includes(q)) || 
    (p.banglaName && p.banglaName.toLowerCase().includes(q)) || 
    (p.category && p.category.toLowerCase().includes(q)) ||
    (p.id && p.id.toLowerCase().includes(q))
  );
  renderAdminProductsTable(filtered);
}

function handleAdminCategoryFilter(category) {
  if (category === 'all') {
    renderAdminProductsTable(adminProducts);
  } else {
    const filtered = adminProducts.filter(p => p.category === category);
    renderAdminProductsTable(filtered);
  }
}

// ==========================================
// 5. Add Product Form
// ==========================================
function previewNewProductImage(url) {
  const preview = document.getElementById('addImagePreview');
  if (preview && url) {
    preview.src = url;
  }
}

function handleAddNewProduct(e) {
  e.preventDefault();
  
  const englishName = document.getElementById('addEnglishName').value.trim();
  const banglaName = document.getElementById('addBanglaName').value.trim();
  const category = document.getElementById('addCategory').value;
  const price = parseInt(document.getElementById('addPrice').value) || 0;
  const originalPrice = parseInt(document.getElementById('addOriginalPrice').value) || null;
  const discount = parseInt(document.getElementById('addDiscount').value) || 0;
  const size = document.getElementById('addSize').value.trim() || '500g';
  const stock = parseInt(document.getElementById('addStock').value) || 30;
  const imageUrl = document.getElementById('addImageUrl').value.trim();
  const description = document.getElementById('addDescription').value.trim();
  const benefitsStr = document.getElementById('addBenefits').value.trim();

  const benefits = benefitsStr ? benefitsStr.split(',').map(b => b.trim()).filter(Boolean) : [
    '100% Raw & Organic',
    'Lab Tested Pure'
  ];

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: englishName,
    banglaName: banglaName,
    category: category,
    categoryBangla: category,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 1,
    discountPercent: discount,
    image: imageUrl,
    gallery: [imageUrl],
    description: description,
    benefits: benefits,
    variants: [
      { size: size, price: price, originalPrice: originalPrice, stock: stock }
    ],
    reviews: [
      { name: 'Verified Buyer', rating: 5, date: 'Recent', comment: 'Authentic organic quality product.' }
    ]
  };

  adminProducts.unshift(newProduct);
  saveAdminProducts();

  alert(`"${englishName}" successfully published to the product catalog!`);
  document.getElementById('addProductForm').reset();
  switchTab('products');
  renderAdminProductsTable();
}

// ==========================================
// 6. Edit Product Modal
// ==========================================
function openEditProductModal(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  const v = product.variants && product.variants.length > 0 ? product.variants[0] : { price: 0, stock: 20, size: '500g' };

  document.getElementById('editProductId').value = product.id;
  document.getElementById('editEnglishName').value = product.name;
  document.getElementById('editBanglaName').value = product.banglaName || '';
  document.getElementById('editPrice').value = v.price;
  document.getElementById('editOriginalPrice').value = v.originalPrice || '';
  document.getElementById('editDiscount').value = product.discountPercent || 0;
  document.getElementById('editSize').value = v.size || '500g';
  document.getElementById('editStock').value = v.stock || 25;
  document.getElementById('editImageUrl').value = product.image;

  document.getElementById('editProductModal').classList.remove('hidden');
}

function closeEditProductModal() {
  document.getElementById('editProductModal').classList.add('hidden');
}

function handleSaveEditedProduct(e) {
  e.preventDefault();
  const id = document.getElementById('editProductId').value;
  const product = adminProducts.find(p => p.id === id);
  if (!product) return;

  const englishName = document.getElementById('editEnglishName').value.trim();
  const banglaName = document.getElementById('editBanglaName').value.trim();
  const price = parseInt(document.getElementById('editPrice').value) || 0;
  const origPrice = parseInt(document.getElementById('editOriginalPrice').value) || null;
  const discount = parseInt(document.getElementById('editDiscount').value) || 0;
  const size = document.getElementById('editSize').value.trim();
  const stock = parseInt(document.getElementById('editStock').value) || 0;
  const imageUrl = document.getElementById('editImageUrl').value.trim();

  product.name = englishName;
  product.banglaName = banglaName;
  product.discountPercent = discount;
  product.image = imageUrl;
  product.gallery = [imageUrl];

  if (product.variants && product.variants.length > 0) {
    product.variants[0].price = price;
    product.variants[0].originalPrice = origPrice;
    product.variants[0].size = size;
    product.variants[0].stock = stock;
  }

  saveAdminProducts();
  closeEditProductModal();
  renderAdminProductsTable();
  alert("Product details updated successfully!");
}

function deleteAdminProduct(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`);
  if (confirmed) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveAdminProducts();
    renderAdminProductsTable();
    alert("Product deleted successfully!");
  }
}

// ==========================================
// 7. Orders Management & Real Server Sync
// ==========================================
function filterAdminOrders(status) {
  currentOrderFilter = status;
  renderAdminOrdersTable();
}

function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  let filtered = adminOrders;
  if (currentOrderFilter !== 'all') {
    filtered = adminOrders.filter(o => {
      const s = String(o.statusCode || o.status || '').toLowerCase();
      return s.includes(currentOrderFilter);
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400 font-semibold">No orders found in this view.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((o, idx) => {
    const currentCode = (o.statusCode || 'pending').toLowerCase();
    const dateFormatted = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
    const isInsideDhaka = !o.customer || o.customer.area !== 'dhaka_outside';

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-3.5 font-bold text-blue-900">
          <div>#${o.orderId || `ORD-${idx + 1}`}</div>
          <div class="text-[10px] text-slate-400 font-normal">${dateFormatted}</div>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-800">${o.customer ? o.customer.name : 'Customer'}</div>
          <div class="text-[11px] text-slate-500">${o.customer ? o.customer.phone : ''}</div>
        </td>
        <td class="p-3.5 max-w-xs text-slate-600">
          <div>${o.customer ? o.customer.address : ''}</div>
          <div class="text-[10px] text-slate-400 font-semibold">${isInsideDhaka ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)'}</div>
        </td>
        <td class="p-3.5">
          ${(o.items || []).map(i => `
            <div class="text-[11px] font-medium text-slate-700 truncate max-w-[180px]">
              • ${i.name} (${i.size || 'Std'}) x ${i.quantity || 1}
            </div>
          `).join('')}
        </td>
        <td class="p-3.5">
          <span class="inline-flex items-center gap-1 font-bold text-xs ${o.transactionId ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200' : 'text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200'}">
            ${o.paymentMethod || 'Cash on Delivery'}
          </span>
          ${o.transactionId ? `
            <div class="text-[10px] text-slate-500 mt-0.5 font-mono font-semibold">TrxID: ${o.transactionId}</div>
          ` : ''}
        </td>
        <td class="p-3.5 font-bold text-emerald-700 text-xs sm:text-sm">
          ৳${formatNumber(o.totalAmount)}
        </td>
        <td class="p-3.5">
          <select onchange="updateLiveOrderStatus('${o.orderId || idx}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none">
            <option value="pending" ${currentCode === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${currentCode === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="delivered" ${currentCode === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${currentCode === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateLiveOrderStatus(orderIdentifier, newStatus) {
  // Update local
  const target = adminOrders.find(o => o.orderId === orderIdentifier) || adminOrders[orderIdentifier];
  if (target) {
    target.statusCode = newStatus;
    target.status = cleanStatusDisplay(newStatus);
    saveAdminOrders();
    renderAdminOrdersTable();
    updateDashboardStats();

    // Sync to backend API if orderId exists
    if (target.orderId) {
      try {
        const baseUrl = getAdminApiBaseUrl();
        await fetch(`${baseUrl}/api/admin/orders/${encodeURIComponent(target.orderId)}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statusCode: newStatus, statusText: target.status })
        });
      } catch (e) {
        console.warn('[Admin] Server status sync offline:', e);
      }
    }
  }
}

function clearDemoOrders() {
  if (confirm("Are you sure you want to clear the local order history?")) {
    adminOrders = [];
    saveAdminOrders();
    renderAdminOrdersTable();
    updateDashboardStats();
  }
}

// ==========================================
// 8. Customer Reviews Management
// ==========================================
function renderAdminReviewsList() {
  const container = document.getElementById('adminReviewsList');
  if (!container) return;

  const allReviews = [];
  adminProducts.forEach(p => {
    if (p.reviews && p.reviews.length > 0) {
      p.reviews.forEach((r, idx) => {
        allReviews.push({ ...r, productId: p.id, productTitle: p.name || p.banglaName, reviewIndex: idx });
      });
    }
  });

  if (allReviews.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-400 font-semibold">No customer reviews yet.</div>`;
    return;
  }

  container.innerHTML = allReviews.map(r => `
    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="font-bold text-xs text-slate-800">${r.name || 'Verified Buyer'}</span>
          <span class="text-amber-400 text-xs">${'★'.repeat(r.rating || 5)}</span>
          <span class="text-[10px] text-slate-400">${r.date || 'Recent'}</span>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 leading-relaxed">${r.comment || ''}</p>
        <span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
          Product: ${r.productTitle}
        </span>
      </div>
      <button onclick="deleteProductReview('${r.productId}', ${r.reviewIndex})" class="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg text-xs" title="Delete Review">
        🗑️
      </button>
    </div>
  `).join('');
}

function deleteProductReview(productId, reviewIndex) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product || !product.reviews) return;

  if (confirm("Are you sure you want to delete this review?")) {
    product.reviews.splice(reviewIndex, 1);
    product.reviewsCount = Math.max(0, (product.reviewsCount || 1) - 1);
    saveAdminProducts();
    renderAdminReviewsList();
  }
}

// Initial check on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
