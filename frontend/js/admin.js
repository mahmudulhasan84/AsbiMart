// AsbiMart (আসবিমার্ট) - অ্যাডমিন প্যানেল লজিক স্ক্রিপ্ট

let adminProducts = [];
let adminOrders = [];

// ==========================================
// ০. অ্যাডমিন প্রমাণীকরণ ও এক্সেস সিকিউরিটি (Admin Auth Gate)
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

  // সুরক্ষিত ক্রেডেনশিয়ালস: আইডি: asbi, পাসওয়ার্ড: asbi123
  if (id === 'asbi' && pass === 'asbi123') {
    sessionStorage.setItem('asbi_admin_auth', 'true');
    if (errElem) errElem.classList.add('hidden');
    checkAdminAuth();
  } else {
    if (errElem) errElem.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  if (confirm("আপনি কি নিশ্চিতভাবে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
    sessionStorage.removeItem('asbi_admin_auth');
    checkAdminAuth();
  }
}

// ডিফল্ট আন্তর্জাতিক ও ইংরেজি সংখ্যা ফরম্যাটার
function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  return typeof num === 'number' ? num.toLocaleString('en-US') : String(num);
}

// পণ্যের ডাটা ইনিশিয়ালাইজেশন (লোকাল স্টোরেজ ও products.js সিঙ্ক)
function initAdminData() {
  const storedProducts = localStorage.getItem('asbi_products_custom');
  if (storedProducts) {
    try {
      adminProducts = JSON.parse(storedProducts);
    } catch (e) {
      adminProducts = [...PRODUCTS_DATA];
    }
  } else {
    adminProducts = [...PRODUCTS_DATA];
    saveAdminProducts();
  }

  const storedOrders = localStorage.getItem('asbi_orders');
  if (storedOrders) {
    try {
      adminOrders = JSON.parse(storedOrders);
    } catch (e) {
      adminOrders = [];
    }
  } else {
    adminOrders = [];
  }

  updateDashboardStats();
  renderAdminProductsTable();
  renderAdminOrdersTable();
  renderAdminReviewsList();
}

function saveAdminProducts() {
  localStorage.setItem('asbi_products_custom', JSON.stringify(adminProducts));
  updateDashboardStats();
}

function saveAdminOrders() {
  localStorage.setItem('asbi_orders', JSON.stringify(adminOrders));
  updateDashboardStats();
}

// ==========================================
// ১. ট্যাব স্যুইচিং লজিক (Tab Switching)
// ==========================================
function switchTab(tabId) {
  const tabs = ['dashboard', 'products', 'addproduct', 'orders', 'reviews'];
  const titles = {
    dashboard: 'ড্যাশবোর্ড ওভারভিউ',
    products: 'পণ্য পরিচালনা ও তালিকা',
    addproduct: 'নতুন পণ্য যুক্ত করুন',
    orders: 'গ্রাহক অর্ডার তালিকা',
    reviews: 'গ্রাহক রিভিউ ও রেটিং'
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
// ২. ড্যাশবোর্ড স্ট্যাটাস ও মেট্রিক্স
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

  if (pCount) pCount.textContent = toBanglaNum(totalProducts);
  if (oCount) oCount.textContent = toBanglaNum(totalOrders);
  if (sCount) sCount.textContent = `৳${toBanglaNum(totalSales)}`;
  if (rCount) rCount.textContent = toBanglaNum(totalReviews);
  if (sideP) sideP.textContent = String(totalProducts);
  if (sideO) sideO.textContent = String(totalOrders);

  // রিসেন্ট অর্ডার প্রিভিউ
  const recentOrdersTbody = document.getElementById('dashboardRecentOrders');
  if (recentOrdersTbody) {
    if (adminOrders.length === 0) {
      recentOrdersTbody.innerHTML = `
        <tr>
          <td colspan="5" class="p-8 text-center text-slate-400">এখনো কোনো নতুন অর্ডার আসেনি। চেকআউট থেকে অর্ডার আসলে এখানে সাথে সাথে প্রদর্শিত হবে।</td>
        </tr>
      `;
    } else {
      recentOrdersTbody.innerHTML = adminOrders.slice(0, 5).map(o => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3 font-bold text-blue-900 font-brand">${o.orderId}</td>
          <td class="p-3">
            <div class="font-bold text-slate-800">${o.customer ? o.customer.name : 'গ্রাহক'}</div>
            <div class="text-[11px] text-slate-400 font-brand">${o.customer ? o.customer.phone : ''}</div>
          </td>
          <td class="p-3 max-w-xs truncate text-slate-600">${o.customer ? o.customer.address : ''}</td>
          <td class="p-3 font-bold text-emerald-700 font-brand">৳${toBanglaNum(o.totalAmount)}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${getOrderStatusClass(o.status)}">
              ${o.status || 'Pending'}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }
}

function getOrderStatusClass(status) {
  if (!status) return 'bg-amber-100 text-amber-800';
  if (status.includes('Delivered') || status.includes('সম্পন্ন')) return 'bg-emerald-100 text-emerald-800';
  if (status.includes('Cancelled') || status.includes('বাতিল')) return 'bg-rose-100 text-rose-800';
  if (status.includes('Processing') || status.includes('প্রক্রিয়াধীন')) return 'bg-blue-100 text-blue-800';
  return 'bg-amber-100 text-amber-800';
}

// ==========================================
// ৩. পণ্য তালিকা রেন্ডারিং ও অ্যাকশন
// ==========================================
function renderAdminProductsTable(productsToRender = adminProducts) {
  const tbody = document.getElementById('adminProductsTableBody');
  if (!tbody) return;

  if (productsToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-slate-400 font-semibold">কোনো পণ্য পাওয়া যায়নি!</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = productsToRender.map(p => {
    const v = p.variants && p.variants.length > 0 ? p.variants[0] : { price: 0, stock: 20, size: 'স্ট্যান্ডার্ড' };
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="p-3.5">
          <img src="${p.image}" alt="${p.banglaName}" class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"/>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900 text-xs sm:text-sm font-bangla-title">${p.banglaName}</div>
          <div class="text-[11px] text-slate-400">${p.name}</div>
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            ${p.categoryBangla || p.category}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-[#1E3A8A] text-xs sm:text-sm font-brand">৳${toBanglaNum(v.price)}</div>
          ${v.originalPrice ? `<div class="text-[10px] text-slate-400 line-through font-brand">৳${toBanglaNum(v.originalPrice)}</div>` : ''}
        </td>
        <td class="p-3.5">
          <span class="font-bold text-xs ${v.stock < 10 ? 'text-rose-600' : 'text-emerald-700'} font-brand">
            ${toBanglaNum(v.stock || 25)} পিস
          </span>
        </td>
        <td class="p-3.5 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="openEditProductModal('${p.id}')" class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors" title="এডিট করুন">
              ✏️
            </button>
            <button onclick="deleteAdminProduct('${p.id}')" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors" title="মুছে ফেলুন">
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
    p.banglaName.toLowerCase().includes(q) || 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
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
// ৪. নতুন পণ্য যোগ করার লজিক (Add Product)
// ==========================================
function previewNewProductImage(url) {
  const preview = document.getElementById('addImagePreview');
  if (preview && url) {
    preview.src = url;
  }
}

function handleAddNewProduct(e) {
  e.preventDefault();
  
  const banglaName = document.getElementById('addBanglaName').value.trim();
  const englishName = document.getElementById('addEnglishName').value.trim();
  const category = document.getElementById('addCategory').value;
  const price = parseInt(document.getElementById('addPrice').value) || 0;
  const originalPrice = parseInt(document.getElementById('addOriginalPrice').value) || null;
  const discount = parseInt(document.getElementById('addDiscount').value) || 0;
  const size = document.getElementById('addSize').value.trim() || '৫০০ গ্রাম';
  const stock = parseInt(document.getElementById('addStock').value) || 30;
  const imageUrl = document.getElementById('addImageUrl').value.trim();
  const description = document.getElementById('addDescription').value.trim();
  const benefitsStr = document.getElementById('addBenefits').value.trim();

  const categoryNames = {
    honey: 'মধু ও প্রাকৃতিক মিষ্টি',
    ghee: 'ঐতিহ্যবাহী গাওয়া ঘি',
    oil: 'ঘানিভাঙা খাঁটি তেল',
    nuts: 'বাদাম ও ড্রাই ফ্রুটস',
    personalcare: 'অর্গানিক পার্সোনাল কেয়ার',
    superfood: 'অর্গানিক সুপারফুড',
    spices: 'প্রাকৃতিক মসলা ও চা'
  };

  const benefits = benefitsStr ? benefitsStr.split(',').map(b => b.trim()).filter(Boolean) : [
    '১০০% প্রাকৃতিক ও খাঁটি',
    'সর্বোচ্চ পুষ্টিগুণ ও স্বাস্থ্যকর'
  ];

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: englishName,
    banglaName: banglaName,
    category: category,
    categoryBangla: categoryNames[category] || 'অর্গানিক পণ্য',
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
      { name: 'আসবিমার্ট ক্রেতা', rating: 5, date: 'সম্প্রতি', comment: 'চমৎকার মান ও আসল খাঁটি পণ্য।' }
    ]
  };

  adminProducts.unshift(newProduct);
  saveAdminProducts();

  alert(`"${banglaName}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে!`);
  document.getElementById('addProductForm').reset();
  switchTab('products');
  renderAdminProductsTable();
}

// ==========================================
// ৫. পণ্য এডিট মোডাল (Edit Product)
// ==========================================
function openEditProductModal(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  const v = product.variants && product.variants.length > 0 ? product.variants[0] : { price: 0, stock: 20, size: '৫০০ গ্রাম' };

  document.getElementById('editProductId').value = product.id;
  document.getElementById('editBanglaName').value = product.banglaName;
  document.getElementById('editEnglishName').value = product.name;
  document.getElementById('editPrice').value = v.price;
  document.getElementById('editOriginalPrice').value = v.originalPrice || '';
  document.getElementById('editDiscount').value = product.discountPercent || 0;
  document.getElementById('editSize').value = v.size || '৫০০ গ্রাম';
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

  const banglaName = document.getElementById('editBanglaName').value.trim();
  const englishName = document.getElementById('editEnglishName').value.trim();
  const price = parseInt(document.getElementById('editPrice').value) || 0;
  const origPrice = parseInt(document.getElementById('editOriginalPrice').value) || null;
  const discount = parseInt(document.getElementById('editDiscount').value) || 0;
  const size = document.getElementById('editSize').value.trim();
  const stock = parseInt(document.getElementById('editStock').value) || 0;
  const imageUrl = document.getElementById('editImageUrl').value.trim();

  product.banglaName = banglaName;
  product.name = englishName;
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
  alert("পণ্যের তথ্য সফলভাবে আপডেট করা হয়েছে!");
}

// ==========================================
// ৬. পণ্য মুছে ফেলা (Delete Product)
// ==========================================
function deleteAdminProduct(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  const confirmed = confirm(`আপনি কি নিশ্চিতভাবে "${product.banglaName}" পণ্যটি মুছে ফেলতে চান?`);
  if (confirmed) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveAdminProducts();
    renderAdminProductsTable();
    alert("পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!");
  }
}

// ==========================================
// ৭. অর্ডার পরিচালনা (Orders Management)
// ==========================================
function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  if (adminOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400 font-semibold">কোনো অর্ডার পাওয়া যায়নি! গ্রাহক অর্ডার করলে এখানে প্রদর্শিত হবে।</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = adminOrders.map((o, idx) => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="p-3.5 font-bold text-blue-900 font-brand">#${o.orderId || `ASBI-${idx + 1}`}</td>
      <td class="p-3.5">
        <div class="font-bold text-slate-800">${o.customer ? o.customer.name : 'গ্রাহক'}</div>
        <div class="text-[11px] text-slate-500 font-brand">${o.customer ? o.customer.phone : ''}</div>
      </td>
      <td class="p-3.5 max-w-xs text-slate-600">
        <div>${o.customer ? o.customer.address : ''}</div>
        <div class="text-[10px] text-slate-400 font-semibold">${o.customer && o.customer.area === 'dhaka_outside' ? 'ঢাকার বাইরে (৳120)' : 'ঢাকা সিটির ভেতরে (৳60)'}</div>
      </td>
      <td class="p-3.5">
        ${(o.items || []).map(i => `
          <div class="text-[11px] font-medium text-slate-700 truncate max-w-[180px]">
            • ${i.name} (${i.size}) x ${i.quantity}
          </div>
        `).join('')}
      </td>
      <td class="p-3.5">
        <span class="inline-flex items-center gap-1 font-bold text-xs ${o.transactionId ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200' : 'text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200'}">
          ${o.paymentMethod || 'ক্যাশ অন ডেলিভারি'}
        </span>
        ${o.transactionId ? `
          <div class="text-[10px] text-slate-500 font-brand mt-0.5 font-semibold">TrxID: ${o.transactionId}</div>
        ` : ''}
      </td>
      <td class="p-3.5 font-bold text-emerald-700 text-xs sm:text-sm font-brand">
        ৳${toBanglaNum(o.totalAmount)}
      </td>
      <td class="p-3.5">
        <select onchange="changeOrderStatus(${idx}, this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none">
          <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>অপেক্ষমান (Pending)</option>
          <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>প্রক্রিয়াধীন (Processing)</option>
          <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>ডেলিভার্ড (Delivered)</option>
          <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>বাতিল (Cancelled)</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function changeOrderStatus(orderIndex, newStatus) {
  if (adminOrders[orderIndex]) {
    adminOrders[orderIndex].status = newStatus;
    saveAdminOrders();
    renderAdminOrdersTable();
    updateDashboardStats();
  }
}

function clearDemoOrders() {
  if (confirm("আপনি কি নিশ্চিতভাবে সব অর্ডার হিস্টোরি মুছে ফেলতে চান?")) {
    adminOrders = [];
    saveAdminOrders();
    renderAdminOrdersTable();
    updateDashboardStats();
  }
}

// ==========================================
// ৮. কাস্টমার রিভিউ পরিচালনা (Customer Reviews)
// ==========================================
function renderAdminReviewsList() {
  const container = document.getElementById('adminReviewsList');
  if (!container) return;

  const allReviews = [];
  adminProducts.forEach(p => {
    if (p.reviews && p.reviews.length > 0) {
      p.reviews.forEach((r, idx) => {
        allReviews.push({ ...r, productId: p.id, productTitle: p.banglaName, reviewIndex: idx });
      });
    }
  });

  if (allReviews.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-400">কোনো রিভিউ নেই।</div>`;
    return;
  }

  container.innerHTML = allReviews.map(r => `
    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="font-bold text-xs text-slate-800">${r.name}</span>
          <span class="text-amber-400 text-xs">${'★'.repeat(r.rating || 5)}</span>
          <span class="text-[10px] text-slate-400 font-brand">${r.date || 'সম্প্রতি'}</span>
        </div>
        <p class="text-xs text-slate-600 mb-1.5 leading-relaxed">${r.comment}</p>
        <span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
          পণ্য: ${r.productTitle}
        </span>
      </div>
      <button onclick="deleteProductReview('${r.productId}', ${r.reviewIndex})" class="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg text-xs" title="রিভিউ মুছে ফেলুন">
        🗑️
      </button>
    </div>
  `).join('');
}

function deleteProductReview(productId, reviewIndex) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product || !product.reviews) return;

  if (confirm("আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?")) {
    product.reviews.splice(reviewIndex, 1);
    product.reviewsCount = Math.max(0, (product.reviewsCount || 1) - 1);
    saveAdminProducts();
    renderAdminReviewsList();
  }
}

// ইনিশিয়ালাইজেশন (নিরাপত্তা যাচাই সহ)
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
