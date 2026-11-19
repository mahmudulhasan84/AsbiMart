// AsbiMart (আসবিমার্ট) - কোর অ্যাপ্লিকেশন স্ক্রিপ্ট

let cart = JSON.parse(localStorage.getItem('asbi_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('asbi_wishlist')) || [];
let currentCarouselIndex = 0;
let carouselTimer = null;
let checkoutProduct = null;

// ডিফল্ট আন্তর্জাতিক ও ইংরেজি সংখ্যা ফরম্যাটার
function toBanglaNum(num) {
  if (num === null || num === undefined) return '';
  return typeof num === 'number' ? num.toLocaleString('en-US') : String(num);
}

// লোকাল স্টোরেজ ও ব্যাকএন্ড API-তে কার্ট সংরক্ষণ
let cartSyncTimer = null;
function syncCartToServer() {
  const token = localStorage.getItem('asbi_auth_token');
  if (!token) return;
  if (cartSyncTimer) clearTimeout(cartSyncTimer);
  cartSyncTimer = setTimeout(() => {
    fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart })
    }).catch(() => {});
  }, 300);
}

async function syncCartFromServer() {
  const token = localStorage.getItem('asbi_auth_token');
  if (!token) return;
  try {
    const res = await fetch('/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.items) && data.items.length > 0 && cart.length === 0) {
      cart = data.items;
      localStorage.setItem('asbi_cart', JSON.stringify(cart));
      updateBadges();
      renderCartDrawer();
    } else if (cart.length > 0) {
      syncCartToServer();
    }
  } catch (e) {}
}

function saveCart() {
  localStorage.setItem('asbi_cart', JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
  syncCartToServer();
}

// ব্যাজ আপডেট (কার্ট ও উইশলিস্ট - ডিফল্ট ইংরেজি সংখ্যা)
function updateBadges() {
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(b => {
    b.textContent = cartTotal > 0 ? String(cartTotal) : '';
    b.classList.toggle('hidden', cartTotal === 0);
  });

  const wishTotal = wishlist.length;
  document.querySelectorAll('.wishlist-count-badge').forEach(b => {
    b.textContent = wishTotal > 0 ? String(wishTotal) : '';
    b.classList.toggle('hidden', wishTotal === 0);
  });
}

// ==========================================
// ১. ক্যারোজেল স্লাইডার লজিক (70% Auto-play Carousel)
// ==========================================
function initHeroCarousel() {
  const track = document.getElementById('heroCarouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (!track || slides.length === 0) return;

  // ডটস তৈরি
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
      <button 
        onclick="goToSlide(${i})" 
        class="carousel-dot transition-all duration-300 h-2.5 rounded-full ${i === 0 ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/50 hover:bg-white/80'}"
        title="স্লাইড ${toBanglaNum(i + 1)}"
      ></button>
    `).join('');
  }

  // অটো-প্লে শুরু
  startCarouselAutoPlay();

  // মাউস নিলে পজ
  const carouselWrapper = document.getElementById('carouselWrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopCarouselAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startCarouselAutoPlay);
  }
}

function updateCarouselUI() {
  const track = document.getElementById('heroCarouselTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!track) return;

  track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;

  dots.forEach((dot, idx) => {
    if (idx === currentCarouselIndex) {
      dot.className = 'carousel-dot transition-all duration-300 h-2.5 rounded-full w-8 bg-amber-400';
    } else {
      dot.className = 'carousel-dot transition-all duration-300 h-2.5 rounded-full w-2.5 bg-white/50 hover:bg-white/80';
    }
  });
}

function nextSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  currentCarouselIndex = (currentCarouselIndex + 1) % slides.length;
  updateCarouselUI();
}

function prevSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  currentCarouselIndex = (currentCarouselIndex - 1 + slides.length) % slides.length;
  updateCarouselUI();
}

function goToSlide(index) {
  currentCarouselIndex = index;
  updateCarouselUI();
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselTimer = setInterval(nextSlide, 4500);
}

function stopCarouselAutoPlay() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

// ==========================================
// ২. ফিচার্ড ক্যাটাগরি স্লাইডার (অটো-প্লে ৩ সেকেন্ড পর পর)
// ==========================================
let categoriesAutoPlayTimer = null;

function renderFeaturedCategories() {
  const container = document.getElementById('featuredCategoriesList');
  if (!container || typeof FEATURED_CATEGORIES === 'undefined') return;

  container.innerHTML = FEATURED_CATEGORIES.map(cat => `
    <div 
      onclick="filterByCategory('${cat.id}')"
      class="cat-slide-item flex flex-col items-center text-center cursor-pointer group transition-all"
    >
      <!-- সমান আকারের নিখুঁত কমপ্যাক্ট স্কয়ার ইমেজ বক্স (কোনো সাইডে ফাঁকা জায়গা নেই, ফুল ফিল্ড ইমেজ) -->
      <div class="w-full aspect-square max-w-[120px] sm:max-w-[145px] rounded-2xl overflow-hidden bg-white border border-[#E5DACB] shadow-sm group-hover:shadow-md group-hover:border-[#1E3A8A] group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 relative">
        <img 
          src="${cat.image}" 
          alt="${cat.name}" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <!-- বক্সের বাইরে নিচে সুন্দরভাবে বসানো ক্যাটাগরির নাম (একটু বড় ও স্পষ্ট ফন্ট সাইজ) -->
      <h4 class="font-bold text-slate-900 text-xs sm:text-sm mt-2.5 group-hover:text-[#1E3A8A] transition-colors leading-snug w-full px-1">
        ${cat.name}
      </h4>
    </div>
  `).join('');

  initCategoriesAutoPlay();
}

function initCategoriesAutoPlay() {
  const container = document.getElementById('featuredCategoriesList');
  if (!container) return;

  startCategoriesAutoPlay();

  container.addEventListener('mouseenter', stopCategoriesAutoPlay);
  container.addEventListener('mouseleave', startCategoriesAutoPlay);
}

function startCategoriesAutoPlay() {
  stopCategoriesAutoPlay();
  categoriesAutoPlayTimer = setInterval(() => {
    const container = document.getElementById('featuredCategoriesList');
    if (!container) return;

    // যদি স্ক্রলের শেষ প্রান্তে পৌঁছে যায় তবে শুরুতে ফিরে যাবে
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // ৪ বা ৫টি কার্ড এক সাথে পরবর্তী স্লাইডে আসবে
      container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
    }
  }, 3000); // প্রতি ৩ সেকেন্ড পর পর স্লাইড হবে
}

function stopCategoriesAutoPlay() {
  if (categoriesAutoPlayTimer) {
    clearInterval(categoriesAutoPlayTimer);
    categoriesAutoPlayTimer = null;
  }
}

function scrollCategories(direction) {
  const container = document.getElementById('featuredCategoriesList');
  if (!container) return;
  const scrollAmount = container.clientWidth * 0.8 * direction;

  if (direction > 0 && container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
    container.scrollTo({ left: 0, behavior: 'smooth' });
  } else if (direction < 0 && container.scrollLeft <= 20) {
    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // ম্যানুয়াল চাপে টাইমার রিসেট
  startCategoriesAutoPlay();
}

// ==========================================
// ৩. আওয়ার প্রোডাক্টস: ক্যাটাগরি অনুযায়ী উপর-নিচে সারি ও ফিল্টারিং
// ==========================================
const CATEGORY_DEFINITIONS = [
  {
    id: 'honey',
    englishName: 'Honey & Sweets',
    banglaName: 'খাঁটি মধু ও প্রাকৃতিক মিষ্টি',
    icon: '🍯',
    filter: p => p.category === 'honey'
  },
  {
    id: 'oil_ghee',
    englishName: 'Pure Oil & Ghee',
    banglaName: 'ঘানিভাঙা তেল ও খাঁটি গাওয়া ঘি',
    icon: '🧈',
    filter: p => p.category === 'ghee' || p.category === 'oil'
  },
  {
    id: 'nuts',
    englishName: 'Nuts & Dry Fruits',
    banglaName: 'প্রিমিয়াম বাদাম ও সেরা খেজুর',
    icon: '🥜',
    filter: p => p.category === 'nuts'
  },
  {
    id: 'superfood',
    englishName: 'Organic Superfood',
    banglaName: 'স্বাস্থ্যকর অর্গানিক সুপারফুড',
    icon: '🌱',
    filter: p => p.category === 'superfood'
  },
  {
    id: 'personalcare',
    englishName: 'Organic Personal Care',
    banglaName: 'প্রাকৃতিক পার্সোনাল কেয়ার',
    icon: '🧴',
    filter: p => p.category === 'personalcare'
  },
  {
    id: 'spices',
    englishName: 'Organic Spices & Tea',
    banglaName: 'খাঁটি মসলা ও অর্গানিক চা',
    icon: '🍵',
    filter: p => p.category === 'spices'
  }
];

let expandedCategories = {};

// একক প্রোডাক্ট কার্ড HTML জেনারেটর
function generateSingleProductCardHtml(product) {
  const defaultVar = product.variants ? product.variants[0] : { price: 500, originalPrice: 600 };
  return `
    <div 
      class="bg-white rounded-2xl sm:rounded-3xl border border-[#E5DACB] overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
    >
      <!-- উপরের দিকে লম্বাটে ও আকর্ষণীয় পণ্যের বড় ছবি -->
      <div onclick="openProductDetailPage('${product.id}')" class="asbi-card-img-wrap relative w-full h-48 sm:h-60 bg-slate-50 overflow-hidden cursor-pointer" title="${product.banglaName} - বিস্তারিত দেখতে ক্লিক করুন">
        <img 
          src="${product.image}" 
          alt="${product.banglaName}" 
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        ${product.discountPercent ? `
          <div class="absolute top-2 left-2 bg-rose-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow-md font-brand">
            -${toBanglaNum(product.discountPercent)}%
          </div>
        ` : ''}
      </div>

      <!-- নিচের অংশ: পণ্যের নাম, ছোট করে মূল্য এবং শুধুই অ্যাড টু কার্ট বোতাম -->
      <div class="asbi-card-body p-3.5 text-center flex flex-col justify-between flex-grow bg-white">
        <div onclick="openProductDetailPage('${product.id}')" class="cursor-pointer">
          <h3 class="font-black text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#1E3A8A] transition-colors font-bangla-title" title="${product.banglaName}">
            ${product.banglaName}
          </h3>
          
          <!-- ছোট করে মূল্য (ইংরেজি সংখ্যায়) -->
          <div class="asbi-card-price mt-1.5 flex items-baseline justify-center gap-1.5 text-xs sm:text-sm">
            <span class="font-bold text-slate-500">৳</span>
            <span class="font-black text-[#1E3A8A] font-brand text-sm sm:text-base">
              ${toBanglaNum(defaultVar.price)}
            </span>
            ${defaultVar.originalPrice ? `
              <span class="text-[10px] sm:text-[11px] text-slate-400 line-through font-brand">
                ৳${toBanglaNum(defaultVar.originalPrice)}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- শুধুই 'Add to Cart' বোতাম -->
        <div class="asbi-card-btn-wrap mt-2.5 pt-2 border-t border-slate-100">
          <button 
            onclick="addCardProductToCart('${product.id}'); event.stopPropagation();"
            class="w-full py-2 px-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs rounded-xl border border-emerald-300 hover:border-emerald-600 transition-all flex items-center justify-center gap-1.5 font-brand shadow-2xs active:scale-95 group/btn"
            title="কার্টে যোগ করুন"
          >
            <svg class="w-3.5 h-3.5 stroke-current transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// মূল রেন্ডার ফাংশন
function renderProductGrid(customProducts = null, bannerText = null) {
  const container = document.getElementById('categoryRowsContainer') || document.getElementById('ourProductsGrid');
  const banner = document.getElementById('searchFilterBanner');
  const bannerTitle = document.getElementById('searchBannerText');

  if (!container) return;

  // ১. সার্চ বা কাস্টম ফিল্টার সক্রিয় থাকলে
  if (customProducts !== null) {
    if (banner) {
      banner.classList.remove('hidden');
      if (bannerTitle) bannerTitle.textContent = bannerText || `Showing ${customProducts.length} filtered products`;
    }

    if (customProducts.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <span class="text-4xl">🔍</span>
          <p class="text-base font-bold text-slate-800 mt-2">কোনো পণ্য পাওয়া যায়নি!</p>
          <p class="text-xs text-slate-400 mt-1">অন্য কোনো নাম লিখে সার্চ করুন অথবা সব পণ্য দেখতে নিচের বাটনে চাপ দিন।</p>
          <button onclick="resetProductSearchAndFilter()" class="mt-4 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-900 transition-all">
            সব পণ্য দেখুন
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="asbi-five-col-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
        ${customProducts.map(p => generateSingleProductCardHtml(p)).join('')}
      </div>
    `;
    return;
  }

  // ২. ডিফল্ট ভিউ: প্রতিটি ক্যাটাগরি উপরে-নিচে আলাদা সারি হিসেবে রেন্ডার হবে
  if (banner) banner.classList.add('hidden');

  container.innerHTML = CATEGORY_DEFINITIONS.map(cat => {
    const catProducts = PRODUCTS_DATA.filter(cat.filter);
    const isExpanded = !!expandedCategories[cat.id];
    const displayProducts = isExpanded ? catProducts : catProducts.slice(0, 5);

    return `
      <div id="cat-section-${cat.id}" class="cat-row-block space-y-4 pt-2">
        <!-- সারি হেডার (বামে শুধুই ইংলিশ নাম ও আইকন, ডানে View All বোতাম) -->
        <div class="flex items-center justify-between pb-3 border-b-2 border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center text-xl shadow-2xs">
              ${cat.icon}
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-brand">
                ${cat.englishName}
              </h3>
            </div>
          </div>
          
          <!-- ৫টির বেশি পণ্য থাকলে View All বোতাম -->
          ${catProducts.length > 5 ? `
            <button 
              onclick="toggleCategoryExpand('${cat.id}')" 
              class="text-xs sm:text-sm font-bold text-[#1E3A8A] hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 px-3 sm:px-4 py-1.5 rounded-full border border-blue-200 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>${isExpanded ? 'Show Less' : `View All (${toBanglaNum(catProducts.length)})`}</span>
              <svg class="w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
            </button>
          ` : `
            <span class="text-xs font-semibold text-slate-400 font-brand">${toBanglaNum(catProducts.length)} Products</span>
          `}
        </div>

        <!-- পণ্যের গ্রিড (এক সারিতে ৫টি পণ্য) -->
        <div class="asbi-five-col-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          ${displayProducts.map(p => generateSingleProductCardHtml(p)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// ক্যাটাগরি এক্সপ্যান্ড বা কলাপ্স টগল
function toggleCategoryExpand(catId) {
  expandedCategories[catId] = !expandedCategories[catId];
  renderProductGrid(null);
}

// ==========================================
// ৩.০. ডেডিকেটেড ক্যাটাগরি পেজ (category.html) কনফিগারেশন ও লজিক
// ==========================================
const CATEGORY_PAGE_CONFIG = {
  honey: {
    title: 'Honey & Sweets',
    icon: '🍯',
    navKey: 'honey',
    filter: p => p.category === 'honey'
  },
  oil_ghee: {
    title: 'Pure Oil & Ghee',
    icon: '🧈',
    navKey: 'oil_ghee',
    filter: p => p.category === 'ghee' || p.category === 'oil'
  },
  ghee: {
    title: 'Traditional Cow Ghee',
    icon: '🧈',
    navKey: 'oil_ghee',
    filter: p => p.category === 'ghee'
  },
  oil: {
    title: 'Pure Ghani Oils',
    icon: '🫒',
    navKey: 'oil_ghee',
    filter: p => p.category === 'oil'
  },
  nuts: {
    title: 'Nuts & Dry Fruits',
    icon: '🥜',
    navKey: 'nuts',
    filter: p => p.category === 'nuts'
  },
  superfood: {
    title: 'Organic Superfood',
    icon: '🌱',
    navKey: 'superfood',
    filter: p => p.category === 'superfood'
  },
  personalcare: {
    title: 'Personal Care',
    icon: '🧴',
    navKey: 'personalcare',
    filter: p => p.category === 'personalcare'
  },
  spices: {
    title: 'Spices & Tea',
    icon: '🍵',
    navKey: 'spices',
    filter: p => p.category === 'spices'
  },
  offers: {
    title: 'Special Offers',
    icon: '🔥',
    navKey: 'offers',
    filter: p => (p.discountPercent || 0) > 0
  },
  all: {
    title: 'All Products',
    icon: '🌿',
    navKey: '',
    filter: () => true
  }
};

let currentCategoryPageId = 'all';
let currentCategorySort = 'featured';

function isOnCategoryPage() {
  return !!document.getElementById('categoryPageGrid');
}

// নেভিগেশন মেনু বা ক্যাটাগরি কার্ডে ক্লিক করলে আলাদা ক্যাটাগরি পেজ ওপেন হবে
function filterAndScrollToCategory(catId) {
  const safeCat = (catId && CATEGORY_PAGE_CONFIG[catId]) ? catId : 'all';

  if (isOnCategoryPage()) {
    // ইতিমধ্যেই category.html পেজে থাকলে URL আপডেট করে সরাসরি ওই ক্যাটাগরির প্রোডাক্ট রেন্ডার করা
    const newUrl = `category.html?cat=${encodeURIComponent(safeCat)}`;
    if (window.history && window.history.pushState) {
      window.history.pushState({ cat: safeCat }, '', newUrl);
    }
    const sortSelect = document.getElementById('catSortSelect');
    if (sortSelect) sortSelect.value = 'featured';
    currentCategorySort = 'featured';
    const mainInput = document.getElementById('mainSearchInput');
    const mobInput = document.getElementById('mobileSearchInput');
    if (mainInput) mainInput.value = '';
    if (mobInput) mobInput.value = '';
    closeSearchSuggestions();
    renderCategoryPage(safeCat, 'featured');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // হোম পেজ বা অন্য যেকোনো পেজ থেকে আলাদা ক্যাটাগরি পেজে নিয়ে যাওয়া
  window.location.href = `category.html?cat=${encodeURIComponent(safeCat)}`;
}

function getCategoryProductsSorted(catId, sortBy = 'featured') {
  const config = CATEGORY_PAGE_CONFIG[catId] || CATEGORY_PAGE_CONFIG.all;
  const list = PRODUCTS_DATA.filter(config.filter).slice();

  const getPrice = p => (p.variants && p.variants[0] ? p.variants[0].price : 0);

  if (sortBy === 'price_asc') {
    list.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sortBy === 'price_desc') {
    list.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sortBy === 'discount' || (catId === 'offers' && sortBy === 'featured')) {
    list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }
  return list;
}

function renderCategoryPage(catId, sortBy = 'featured', customProducts = null, searchBannerText = null) {
  const grid = document.getElementById('categoryPageGrid');
  if (!grid) return;

  const safeCat = (catId && CATEGORY_PAGE_CONFIG[catId]) ? catId : 'all';
  currentCategoryPageId = safeCat;
  currentCategorySort = sortBy || 'featured';

  const config = CATEGORY_PAGE_CONFIG[safeCat];
  const productsToShow = customProducts !== null
    ? customProducts
    : getCategoryProductsSorted(safeCat, currentCategorySort);

  // পেজ টাইটেল ও হেডার তথ্য আপডেট (শুধুমাত্র আইটেম মেনুর মূল টাইটেল)
  document.title = `${config.title} — AsbiMart`;
  const breadcrumbEl = document.getElementById('catBreadcrumbName');
  const iconEl = document.getElementById('catPageIcon');
  const titleEl = document.getElementById('catPageTitle');

  if (breadcrumbEl) breadcrumbEl.textContent = config.title;
  if (iconEl) iconEl.textContent = config.icon;
  if (titleEl) titleEl.textContent = config.title;

  // নেভিগেশন বারে অ্যাক্টিভ ক্যাটাগরি হাইলাইট
  document.querySelectorAll('[data-nav-cat]').forEach(btn => {
    const isActive = config.navKey && btn.getAttribute('data-nav-cat') === config.navKey;
    btn.classList.toggle('bg-blue-800', !!isActive);
    btn.classList.toggle('ring-1', !!isActive);
    btn.classList.toggle('ring-amber-400/70', !!isActive);
    if (isActive && window.innerWidth < 1024) {
      try { btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) {}
    }
  });

  // সার্চ ব্যানার কন্ট্রোল
  const banner = document.getElementById('searchFilterBanner');
  const bannerTitle = document.getElementById('searchBannerText');
  if (banner) {
    if (customProducts !== null) {
      banner.classList.remove('hidden');
      if (bannerTitle) bannerTitle.textContent = searchBannerText || `Showing ${productsToShow.length} matching products`;
    } else {
      banner.classList.add('hidden');
    }
  }

  // প্রোডাক্ট না পাওয়া গেলে এম্পটি স্টেট
  if (productsToShow.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500 bg-white rounded-3xl border border-[#E5DACB] p-8 shadow-xs">
        <span class="text-4xl">🔍</span>
        <p class="text-base font-bold text-slate-800 mt-2">কোনো পণ্য পাওয়া যায়নি!</p>
        <p class="text-xs text-slate-400 mt-1">অন্য কোনো নাম লিখে সার্চ করুন অথবা এই ক্যাটাগরির সব পণ্য দেখুন।</p>
        <button onclick="resetProductSearchAndFilter()" class="mt-4 px-5 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-900 transition-all cursor-pointer">
          সব পণ্য দেখুন
        </button>
      </div>
    `;
    return;
  }

  // মেইন পেজের হুবহু ৫-কলাম কার্ড স্টাইলে প্রোডাক্ট রেন্ডার
  grid.innerHTML = productsToShow.map(p => generateSingleProductCardHtml(p)).join('');
}

function handleCategorySortChange(sortBy) {
  renderCategoryPage(currentCategoryPageId, sortBy);
}

function initCategoryPage() {
  if (!isOnCategoryPage()) return;
  const params = new URLSearchParams(window.location.search);
  const catParam = (params.get('cat') || 'all').trim();
  const sortSelect = document.getElementById('catSortSelect');
  const initialSort = sortSelect ? sortSelect.value : 'featured';
  renderCategoryPage(catParam, initialSort);

  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(window.location.search);
    const c = (p.get('cat') || 'all').trim();
    renderCategoryPage(c, currentCategorySort);
  });
}

// ==========================================
// ৪. স্মার্ট দ্বিভাষিক সার্চ ইঞ্জিন (English + বাংলা + Banglish) ও লাইভ সাজেশন
// ==========================================
const SEARCH_SYNONYM_GROUPS = [
  ['honey', 'modhu', 'madhu', 'modu', 'modhoo', 'mou', 'mow', 'মধু', 'হানি', 'মধূ', 'sweet', 'sweets', 'মিষ্টি'],
  ['honeycomb', 'comb', 'chak', 'chaksaho', 'চাক', 'চাকসহ', 'মৌচাক'],
  ['sundarban', 'sundarbans', 'sundorbon', 'sundorban', 'সুন্দরবন', 'সুন্দরবনের'],
  ['kalojira', 'kalijira', 'kalojeera', 'kalonji', 'black seed', 'blackseed', 'nigella', 'কালোজিরা', 'কালিজিরা', 'ব্ল্যাক সিড'],
  ['litchi', 'lychee', 'lichu', 'lechu', 'লিচু', 'লিচুর'],
  ['mustard', 'sorisha', 'shorisha', 'sorshe', 'shorshe', 'sorisa', 'সরিষা', 'সরিষার', 'মাস্টার্ড'],
  ['ghee', 'ghi', 'gawa', 'gaoa', 'gava', 'danadar', 'butter', 'ঘি', 'ঘী', 'গাওয়া', 'গাওয়া', 'দানাদার'],
  ['buffalo', 'mohish', 'mohisher', 'মহিষ', 'মহিষের'],
  ['cultured', 'bilon', 'bakhon', 'bilona', 'বিলোন', 'বাখন'],
  ['oil', 'tel', 'toil', 'tail', 'ghani', 'ghanibhanga', 'cold pressed', 'তেল', 'অয়েল', 'অয়েল', 'ঘানি', 'ঘানিভাঙা'],
  ['coconut', 'narikel', 'narkel', 'narikol', 'নারিকেল', 'নারকেল', 'কোকোনাট'],
  ['sesame', 'til', 'tiler', 'তিল', 'তিলের'],
  ['nut', 'nuts', 'badam', 'dry fruit', 'dry fruits', 'dryfruits', 'mixed', 'mix', 'বাদাম', 'নাট', 'নাটস', 'ড্রাই ফ্রুটস', 'মিক্সড'],
  ['almond', 'almonds', 'kathbadam', 'katbadam', 'california', 'কাঠবাদাম', 'আমন্ড', 'ক্যালিফোর্নিয়া'],
  ['cashew', 'cashews', 'kaju', 'kajubadam', 'কাজু', 'কাজুবাদাম'],
  ['walnut', 'walnuts', 'akhrot', 'akhrote', 'kashmiri', 'আখরোট', 'ওয়ালনাট', 'কাশ্মীরি'],
  ['pista', 'pistachio', 'pistachios', 'pesta', 'pestabadam', 'iranian', 'পেস্তা', 'পিস্তা', 'ইরানি'],
  ['raisin', 'raisins', 'kismis', 'kishmish', 'kismish', 'afghan', 'কিসমিস', 'কিশমিশ', 'আফগান'],
  ['date', 'dates', 'khejur', 'khajur', 'khejor', 'খেজুর', 'খেজুরের', 'ডেটস'],
  ['ajwa', 'azwa', 'madinah', 'madina', 'আজওয়া', 'আজওয়া', 'মদিনা', 'মদিনার'],
  ['mabroom', 'mabrum', 'saudi', 'মাবরুম', 'সৌদি'],
  ['chia', 'chiaseed', 'chiya', 'চিয়া', 'চিয়া'],
  ['flax', 'flaxseed', 'tisi', 'tishi', 'teesee', 'তিসি', 'ফ্ল্যাক্স'],
  ['pumpkin', 'kumra', 'kumrar', 'mistikumra', 'কুমড়া', 'কুমড়া', 'কুমড়ার'],
  ['sunflower', 'surjomukhi', 'shurjomukhi', 'surjamukhi', 'সূর্যমুখী'],
  ['seed', 'seeds', 'bij', 'beej', 'বীজ', 'সিড'],
  ['moringa', 'sojina', 'sajna', 'sajina', 'sojna', 'সজিনা', 'সজনে', 'মরিঙ্গা', 'মরিংগা'],
  ['neem', 'nim', 'নিম', 'নিমের'],
  ['soap', 'saban', 'shaban', 'সাবান', 'সোপ'],
  ['toothpaste', 'paste', 'clove', 'lobongo', 'টুথপেস্ট', 'পেস্ট'],
  ['toothbrush', 'brush', 'bamboo', 'bambu', 'টুথব্রাশ', 'ব্রাশ', 'ব্যাম্বু'],
  ['aloe', 'aloevera', 'gel', 'jel', 'ghritokumari', 'অ্যালোভেরা', 'এলোভেরা', 'জেল', 'ঘৃতকুমারী'],
  ['lotion', 'shea', 'cream', 'লোশন', 'বডি লোশন'],
  ['turmeric', 'holud', 'halud', 'haldi', 'হলুদ', 'টার্মারিক'],
  ['chilli', 'chili', 'morich', 'marich', 'mirch', 'মরিচ'],
  ['cumin', 'jira', 'jeera', 'জিরা', 'জিরার'],
  ['coriander', 'dhonia', 'dhoniya', 'dhone', 'ধনিয়া', 'ধনিয়া', 'ধনে'],
  ['cardamom', 'elach', 'elachi', 'elaichi', 'sobuj', 'এলাচ', 'এলাচি', 'সবুজ এলাচ'],
  ['spice', 'spices', 'mosla', 'moshla', 'masala', 'gura', 'powder', 'মসলা', 'মশলা', 'গুঁড়া', 'গুঁড়া', 'পাউডার'],
  ['tea', 'cha', 'chha', 'chapata', 'green tea', 'greentea', 'black tea', 'sreemangal', 'srimangal', 'sylhet', 'চা', 'চা পাতা', 'গ্রিন টি', 'শ্রীমঙ্গল', 'সিলেট'],
  ['salt', 'pink salt', 'himalayan', 'lobon', 'labon', 'nun', 'লবণ', 'লবন', 'সল্ট', 'পিংক সল্ট', 'হিমালয়ান', 'নুন'],
  ['combo', 'pack', 'package', 'bundle', 'family', 'royal', 'gift', 'কম্বো', 'প্যাক', 'প্যাকেজ'],
  ['superfood', 'health', 'diet', 'সুপারফুড', 'হেলথ'],
  ['personalcare', 'personal', 'care', 'herbal', 'পার্সোনাল', 'কেয়ার', 'হার্বাল'],
  ['organic', 'pure', 'khati', 'raw', 'kacha', 'অর্গানিক', 'খাঁটি', 'কাঁচা', 'প্রাকৃতিক']
];

function normalizeSearchText(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[।,.\-_()\[\]\/\\'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandSearchToken(token) {
  const terms = new Set([token]);
  if (token.length < 2) return terms;

  let exactHit = false;
  for (const group of SEARCH_SYNONYM_GROUPS) {
    if (group.includes(token)) {
      exactHit = true;
      group.forEach(w => terms.add(w));
    }
  }
  if (exactHit) return terms;

  for (const group of SEARCH_SYNONYM_GROUPS) {
    const matched = group.some(word => {
      // উপসর্গ ম্যাচিং (যেমন: "mod" -> "modhu", "মধ" -> "মধু", "হান" -> "হানি")
      if (token.length >= 2 && word.startsWith(token)) return true;
      if (word.length >= 3 && token.startsWith(word)) return true;
      return false;
    });
    if (matched) {
      group.forEach(w => terms.add(w));
    }
  }
  return terms;
}

function buildProductSearchFields(p) {
  const titleBn = normalizeSearchText(p.banglaName);
  const titleEn = normalizeSearchText(p.name);
  const catBn = normalizeSearchText(p.categoryBangla);
  const catEn = normalizeSearchText(p.category);
  const desc = normalizeSearchText(p.description);
  const titleWords = new Set([...titleBn.split(' '), ...titleEn.split(' ')].filter(Boolean));
  return { titleBn, titleEn, catBn, catEn, desc, titleWords };
}

function matchInText(text, wordsSet, term) {
  if (!term) return 0;
  // ছোট শব্দের (১-২ অক্ষর যেমন 'চা', 'ঘি', 'তিল') জন্য সম্পূর্ণ শব্দ ম্যাচ নিশ্চিত করা
  if (term.length <= 2) {
    if (wordsSet && wordsSet.has(term)) return 140;
    return 0;
  }
  if (wordsSet && wordsSet.has(term)) return 140;
  if (wordsSet) {
    for (const w of wordsSet) {
      if (w.startsWith(term)) return 115;
    }
  }
  if (text.includes(term)) return 85;
  return 0;
}

function scoreProductAgainstTerms(fields, expandedTerms) {
  let best = 0;
  for (const term of expandedTerms) {
    if (!term) continue;
    const titleScore = Math.max(
      matchInText(fields.titleBn, fields.titleWords, term),
      matchInText(fields.titleEn, fields.titleWords, term)
    );
    if (titleScore > best) {
      best = titleScore;
      continue;
    }
    if (term.length > 2) {
      if (fields.catBn.includes(term) || fields.catEn.includes(term)) {
        if (best < 45) best = 45;
      } else if (fields.desc.includes(term)) {
        if (best < 15) best = 15;
      }
    }
  }
  return best;
}

function searchProductsSmart(query) {
  const norm = normalizeSearchText(query);
  if (!norm) return [];

  const tokens = norm.split(' ').filter(Boolean);
  const expandedPerToken = tokens.map(t => expandSearchToken(t));
  const fullPhraseTerms = expandSearchToken(norm);

  const strictMatches = [];
  const relaxedMatches = [];

  for (const p of PRODUCTS_DATA) {
    const fields = buildProductSearchFields(p);
    let allTokensMatched = true;
    let totalScore = 0;
    let matchedTokenCount = 0;

    // পুরো বাক্য ম্যাচ হলে বাড়তি অগ্রাধিকার
    const phraseScore = scoreProductAgainstTerms(fields, fullPhraseTerms);
    if (phraseScore > 0) totalScore += phraseScore;

    for (const expanded of expandedPerToken) {
      const s = scoreProductAgainstTerms(fields, expanded);
      if (s > 0) {
        totalScore += s;
        matchedTokenCount++;
      } else {
        allTokensMatched = false;
      }
    }

    if (allTokensMatched && totalScore > 0) {
      strictMatches.push({ product: p, score: totalScore });
    } else if (matchedTokenCount > 0) {
      relaxedMatches.push({ product: p, score: totalScore });
    }
  }

  const finalList = strictMatches.length > 0 ? strictMatches : relaxedMatches;
  finalList.sort((a, b) => b.score - a.score);
  return finalList.map(item => item.product);
}

function handleLiveSearchSuggestions(query, targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  const q = (query || '').trim();

  if (q.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  // বাংলা, ইংলিশ ও বাংলিশ — সব ভাষাতেই লাইভ সাজেশন (টাইপ করার সময় নিচের পেজ পরিবর্তন হবে না)
  const allMatches = searchProductsSmart(q);
  const matches = allMatches.slice(0, 6);

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="p-3.5 text-center text-xs text-slate-500">
        কোনো সাজেশন পাওয়া যায়নি! <br/>
        <span class="text-[10px] text-slate-400">মধু / modhu / honey, ঘি / ghee, সরিষার তেল বা বাদাম লিখে খুঁজুন</span>
      </div>
    `;
    container.classList.remove('hidden');
    return;
  }

  const safeQueryAttr = q.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');

  container.innerHTML = `
    <div class="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
      <span>সাজেশন (${toBanglaNum(matches.length)})</span>
      <span class="text-[10px] text-slate-400">ক্লিক করুন বা Enter চাপুন</span>
    </div>
    <div class="divide-y divide-slate-100">
      ${matches.map(p => `
        <div 
          onclick="selectSearchSuggestion('${p.banglaName.replace(/'/g, "\\'")}')" 
          class="p-2.5 hover:bg-blue-50/70 cursor-pointer flex items-center gap-3 transition-colors group"
        >
          <img src="${p.image}" alt="${p.banglaName}" class="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
          <div class="flex-grow min-w-0">
            <p class="text-xs font-bold text-slate-800 group-hover:text-[#1E3A8A] truncate font-bangla-title">${p.banglaName}</p>
            <p class="text-[10px] text-slate-400 font-brand truncate">${p.name}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div 
      onclick="handleSearch('${safeQueryAttr}');" 
      class="p-2.5 bg-blue-50 text-center text-xs font-bold text-[#1E3A8A] hover:bg-blue-100 cursor-pointer transition-colors"
    >
      🔍 "${q.replace(/</g, '&lt;')}" এর সকল পণ্য দেখুন (${toBanglaNum(allMatches.length)}) →
    </div>
  `;
  container.classList.remove('hidden');
}

function selectSearchSuggestion(productName) {
  const mainInput = document.getElementById('mainSearchInput');
  const mobInput = document.getElementById('mobileSearchInput');
  if (mainInput) mainInput.value = productName;
  if (mobInput) mobInput.value = productName;
  closeSearchSuggestions();
  handleSearch(productName);
}

function closeSearchSuggestions() {
  const mainSug = document.getElementById('mainSearchSuggestions');
  const mobSug = document.getElementById('mobileSearchSuggestions');
  if (mainSug) mainSug.classList.add('hidden');
  if (mobSug) mobSug.classList.add('hidden');
}

// বাইরে ক্লিক করলে সাজেশন বন্ধ হবে
document.addEventListener('click', (e) => {
  if (!e.target.closest('#mainSearchInput') && !e.target.closest('#mainSearchSuggestions') &&
      !e.target.closest('#mobileSearchInput') && !e.target.closest('#mobileSearchSuggestions')) {
    closeSearchSuggestions();
  }
});

// এন্টার বা সার্চ বোতামে চাপ দিলে বাংলা/ইংলিশ/বাংলিশ স্মার্ট ফিল্টার কার্যকর হবে
function handleSearch(query) {
  closeSearchSuggestions();
  const q = (query || '').trim();
  if (!q) {
    resetProductSearchAndFilter();
    return;
  }

  const filtered = searchProductsSmart(q);

  if (isOnCategoryPage()) {
    renderCategoryPage(
      currentCategoryPageId,
      currentCategorySort,
      filtered,
      `"${q}" এর জন্য মোট ${toBanglaNum(filtered.length)}টি পণ্য পাওয়া গেছে`
    );
    const catMain = document.getElementById('categoryPageMain');
    if (catMain) catMain.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  renderProductGrid(filtered, `"${q}" এর জন্য মোট ${toBanglaNum(filtered.length)}টি পণ্য পাওয়া গেছে`);
  
  const prodSection = document.getElementById('ourProductsSection');
  if (prodSection) {
    prodSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function resetProductSearchAndFilter() {
  const mainInput = document.getElementById('mainSearchInput');
  const mobInput = document.getElementById('mobileSearchInput');
  if (mainInput) mainInput.value = '';
  if (mobInput) mobInput.value = '';
  closeSearchSuggestions();
  if (isOnCategoryPage()) {
    renderCategoryPage(currentCategoryPageId, currentCategorySort, null, null);
    return;
  }
  renderProductGrid(null);
}

// ফিল্টার বাটনে চাপ দিলে
function filterByCategory(catId) {
  filterAndScrollToCategory(catId);
}

// ==========================================
// ৩.১. টপ প্রোডাক্টস ২-কলাম অনুভূমিক গ্রিড (ঠিক ৪টি বেস্ট সেলার পণ্য - ২x২ গ্রিড)
// ==========================================
function renderTopProductsGrid() {
  const container = document.getElementById('topProductsGrid');
  if (!container) return;

  const topProducts = PRODUCTS_DATA.filter(p => p.isBestSeller).slice(0, 4);
  if (topProducts.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <p class="text-base font-semibold">কোনো টপ প্রোডাক্ট পাওয়া যায়নি!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = topProducts.map(product => {
    const defaultVar = product.variants[0];
    return `
      <div class="product-card-horizontal relative">
        <!-- উপরের ডান কোনায় লোগোর ৩য় রঙ (মিন্ট গ্রিন #10B981) দিয়ে আকর্ষণীয় Best Seller সাইন -->
        <div class="top-bestseller-badge absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 bg-[#10B981] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md shadow-emerald-600/30 border border-emerald-300/60 font-brand pointer-events-none select-none">
          <svg class="w-3 h-3 fill-current text-amber-200 flex-shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <span>Best Seller</span>
        </div>

        <!-- বাম দিকের ৫০% অংশ: প্রোডাক্টের ইমেজ ও ডিসকাউন্ট (ক্লিক করলে বিস্তারিত পেজ খুলবে) -->
        <div onclick="openProductDetailPage('${product.id}')" class="card-img-col w-1/2 relative bg-slate-50 overflow-hidden flex-shrink-0 cursor-pointer group" title="বিস্তারিত দেখতে ক্লিক করুন">
          <img 
            src="${product.image}" 
            alt="${product.banglaName}" 
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <!-- প্রোডাক্টের গায়ে সামান্য লাল হাইলাইট ডিসকাউন্ট ব্যাজ -->
          ${product.discountPercent ? `
            <div class="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-md font-brand">
              -${toBanglaNum(product.discountPercent)}%
            </div>
          ` : ''}
        </div>

        <!-- ডান দিকের ৫০% অংশ: ড্রপডাউন ছাড়া পরিচ্ছন্নভাবে শুধু নাম, প্রাইস, ছোট ডিসকাউন্ট হাইলাইট ও বাটনসমূহ -->
        <div class="top-card-info-col w-1/2 p-3 sm:p-4 sm:pt-9 flex flex-col justify-between">
          <div class="space-y-2">
            <!-- বড় ও স্পষ্ট বাংলা নাম (ক্লিক করলে বিস্তারিত পেজ খুলবে) -->
            <h3 onclick="openProductDetailPage('${product.id}')" class="font-black text-slate-900 text-base sm:text-lg leading-snug line-clamp-2 hover:text-[#1E3A8A] transition-colors font-bangla-title tracking-wide cursor-pointer" title="${product.banglaName}">
              ${product.banglaName}
            </h3>

            <!-- প্রাইস ও ছোট ডিসকাউন্ট হাইলাইট -->
            <div class="flex items-center flex-wrap gap-1.5 pt-0.5">
              <div class="flex items-baseline gap-0.5">
                <span class="text-xs font-bold text-slate-600">৳</span>
                <span id="top-price-val-${product.id}" class="text-lg sm:text-xl font-black text-[#1E3A8A] font-brand">
                  ${toBanglaNum(defaultVar.price)}
                </span>
              </div>
              ${defaultVar.originalPrice ? `
                <span id="top-orig-val-${product.id}" class="text-[11px] text-slate-400 line-through font-brand">
                  ৳${toBanglaNum(defaultVar.originalPrice)}
                </span>
              ` : ''}
              ${product.discountPercent ? `
                <span class="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md font-brand">
                  -${toBanglaNum(product.discountPercent)}%
                </span>
              ` : ''}
            </div>
          </div>

          <!-- বাটনস: বাম পাশে Add to Cart, ডান পাশে Order Now -->
          <div class="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
            <button 
              onclick="addTopProductToCart('${product.id}')"
              class="py-2 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1 font-brand cursor-pointer"
            >
              <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Add to Cart</span>
            </button>

            <button 
              onclick="quickOrderNowTopProduct('${product.id}')"
              class="py-2 px-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-black text-[11px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 font-brand cursor-pointer"
            >
              <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function changeTopProductPrice(productId) {
  const select = document.getElementById(`top-var-${productId}`);
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!select || !product) return;
  const v = product.variants[parseInt(select.value)];
  const pElem = document.getElementById(`top-price-val-${productId}`);
  const origElem = document.getElementById(`top-orig-val-${productId}`);
  if (pElem) pElem.textContent = toBanglaNum(v.price);
  if (origElem && v.originalPrice) origElem.textContent = `৳${toBanglaNum(v.originalPrice)}`;
}

function addTopProductToCart(productId) {
  const select = document.getElementById(`top-var-${productId}`);
  const vIndex = select ? parseInt(select.value) : 0;
  addToCart(productId, vIndex, 1);
}

function quickOrderNowTopProduct(productId) {
  const select = document.getElementById(`top-var-${productId}`);
  const vIndex = select ? parseInt(select.value) : 0;
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  checkoutProduct = {
    ...product,
    selectedVariant: product.variants[vIndex]
  };
  openCheckoutModal();
}

function changeProductCardPrice(productId) {
  const select = document.getElementById(`var-${productId}`);
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!select || !product) return;
  const v = product.variants[parseInt(select.value)];
  const pElem = document.getElementById(`price-val-${productId}`);
  const origElem = document.getElementById(`orig-val-${productId}`);
  if (pElem) pElem.textContent = toBanglaNum(v.price);
  if (origElem && v.originalPrice) origElem.textContent = `৳${toBanglaNum(v.originalPrice)}`;
}

function addCardProductToCart(productId) {
  const select = document.getElementById(`var-${productId}`);
  const vIndex = select ? parseInt(select.value) : 0;
  addToCart(productId, vIndex, 1);
}

// ==========================================
// ৪. একক পণ্যের সম্পূর্ণ বিস্তারিত পেজ (Product Details Page)
// ==========================================
let currentDetailProduct = null;
let currentDetailVariantIndex = 0;
let currentDetailQty = 1;
let currentDetailActiveImage = '';
let currentReviewRating = 5;

function openProductDetailPage(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  currentDetailProduct = product;
  currentDetailVariantIndex = 0;
  currentDetailQty = 1;
  currentDetailActiveImage = (product.gallery && product.gallery.length > 0) ? product.gallery[0] : product.image;
  currentReviewRating = 5;

  const modal = document.getElementById('productDetailModal');
  const content = document.getElementById('productDetailContent');
  if (!modal || !content) return;

  renderProductDetailView();
  loadProductReviewsFromServer(product.id);

  // লগইন করা গ্রাহকের নাম রিভিউ বক্সে স্বয়ংক্রিয়ভাবে বসানো
  try {
    const authUser = JSON.parse(localStorage.getItem('asbi_auth_user'));
    const authorInput = document.getElementById('reviewAuthorName');
    if (authUser && authUser.loggedIn && authUser.name && authorInput && !authorInput.value) {
      authorInput.value = authUser.name;
    }
  } catch (e) {}

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  modal.scrollTop = 0;
}

async function loadProductReviewsFromServer(productId) {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/reviews`);
    if (!res.ok) return;
    const data = await res.json();
    if (!data.success || !Array.isArray(data.reviews)) return;
    if (!currentDetailProduct || currentDetailProduct.id !== productId) return;

    const existingSeed = (currentDetailProduct._seedReviews || currentDetailProduct.reviews || []).filter(r => !r._fromServer);
    if (!currentDetailProduct._seedReviews) {
      currentDetailProduct._seedReviews = existingSeed;
    }
    const serverMarked = data.reviews.map(r => ({ ...r, _fromServer: true }));
    currentDetailProduct.reviews = [...serverMarked, ...currentDetailProduct._seedReviews];
    renderReviewsList();
  } catch (e) {}
}

function closeProductDetailPage() {
  const modal = document.getElementById('productDetailModal');
  if (modal) {
    modal.classList.add('hidden');
  }
  document.body.classList.remove('overflow-hidden');
  currentDetailProduct = null;
}

function selectDetailThumbnail(imgUrl) {
  currentDetailActiveImage = imgUrl;
  const mainImg = document.getElementById('detailMainPreviewImg');
  if (mainImg) {
    mainImg.src = imgUrl;
  }
  document.querySelectorAll('.detail-thumbnail-btn').forEach(btn => {
    if (btn.getAttribute('data-src') === imgUrl) {
      btn.className = 'detail-thumbnail-btn w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-emerald-600 ring-2 ring-emerald-300 shadow-sm transition-all flex-shrink-0 cursor-pointer bg-slate-50';
    } else {
      btn.className = 'detail-thumbnail-btn w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100 transition-all flex-shrink-0 cursor-pointer bg-slate-50';
    }
  });
}

function selectDetailVariant(index) {
  if (!currentDetailProduct || !currentDetailProduct.variants[index]) return;
  currentDetailVariantIndex = index;
  const variant = currentDetailProduct.variants[index];

  const priceVal = document.getElementById('detailPriceVal');
  const origPriceVal = document.getElementById('detailOrigPriceVal');
  const stockVal = document.getElementById('detailStockVal');

  if (priceVal) priceVal.textContent = toBanglaNum(variant.price);
  if (origPriceVal) {
    if (variant.originalPrice) {
      origPriceVal.textContent = `৳${toBanglaNum(variant.originalPrice)}`;
      origPriceVal.classList.remove('hidden');
    } else {
      origPriceVal.classList.add('hidden');
    }
  }
  if (stockVal) stockVal.textContent = toBanglaNum(variant.stock || 25);

  document.querySelectorAll('.detail-var-btn').forEach((btn, idx) => {
    if (idx === index) {
      btn.className = 'detail-var-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200 shadow-xs transition-all';
    } else {
      btn.className = 'detail-var-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all';
    }
  });
}

function changeDetailQty(delta) {
  const newQty = currentDetailQty + delta;
  if (newQty >= 1 && newQty <= 99) {
    currentDetailQty = newQty;
    const qtyElem = document.getElementById('detailQtyDisplay');
    if (qtyElem) qtyElem.textContent = String(currentDetailQty);
  }
}

function addDetailProductToCart() {
  if (!currentDetailProduct) return;
  addToCart(currentDetailProduct.id, currentDetailVariantIndex, currentDetailQty);
}

function orderNowDetailProduct() {
  if (!currentDetailProduct) return;
  const selectedVariant = currentDetailProduct.variants[currentDetailVariantIndex];
  checkoutProduct = {
    ...currentDetailProduct,
    selectedVariant: selectedVariant,
    quantity: currentDetailQty
  };
  closeProductDetailPage();
  openCheckoutModal();
}

function setReviewRating(rating) {
  currentReviewRating = rating;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`review-star-${i}`);
    if (star) {
      if (i <= rating) {
        star.classList.remove('text-slate-300');
        star.classList.add('text-amber-400');
      } else {
        star.classList.remove('text-amber-400');
        star.classList.add('text-slate-300');
      }
    }
  }
  const ratingText = document.getElementById('reviewRatingFeedback');
  if (ratingText) {
    const labels = {
      1: '১ স্টার - খুব খারাপ',
      2: '২ স্টার - সন্তোষজনক নয়',
      3: '৩ স্টার - ভালো',
      4: '৪ স্টার - খুবই ভালো',
      5: '৫ স্টার - চমৎকার ও সেরা মানের'
    };
    ratingText.textContent = labels[rating] || `${rating} স্টার`;
  }
}

async function submitCustomerReview(productId) {
  const nameInput = document.getElementById('reviewAuthorName');
  const textInput = document.getElementById('reviewCommentText');
  if (!nameInput || !textInput) return;

  const authorName = nameInput.value.trim() || 'আসবিমার্ট গ্রাহক';
  const comment = textInput.value.trim();

  if (!comment || comment.length < 3) {
    showToast('দয়া করে অন্তত ৩ অক্ষরের একটি রিভিউ মন্তব্য লিখুন!');
    return;
  }

  const token = localStorage.getItem('asbi_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: authorName,
        rating: currentReviewRating,
        comment,
        productName: currentDetailProduct ? currentDetailProduct.banglaName : ''
      })
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || 'রিভিউ সংরক্ষণে সমস্যা হয়েছে।');
      return;
    }

    const savedReview = { ...data.review, _fromServer: true };
    if (!currentDetailProduct.reviews) currentDetailProduct.reviews = [];
    currentDetailProduct.reviews.unshift(savedReview);
    currentDetailProduct.reviewsCount = (currentDetailProduct.reviewsCount || 0) + 1;

    textInput.value = '';
    renderReviewsList();
    showToast('আপনার রিভিউ স্থায়ীভাবে ডেটাবেসে সংরক্ষিত হয়েছে! ধন্যবাদ।');
  } catch (err) {
    showToast('সার্ভারে সংযোগ করা যাচ্ছে না। দয়া করে আবার চেষ্টা করুন।');
  }
}

function renderReviewsList() {
  const container = document.getElementById('detailReviewsList');
  if (!container || !currentDetailProduct) return;

  const reviews = currentDetailProduct.reviews || [];
  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-slate-400 text-xs">
        এখনো কোনো রিভিউ যোগ করা হয়নি। আপনিই প্রথম রিভিউ দিন!
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center font-bangla-title">
            ${r.name ? r.name.charAt(0) : 'ক'}
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-900">${r.name}</h5>
            <span class="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span>✓</span> ভেরিফাইড ক্রেতা
            </span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-amber-400 text-xs">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
          <span class="text-[10px] text-slate-400">${r.date || 'সম্প্রতি'}</span>
        </div>
      </div>
      <p class="text-xs text-slate-700 leading-relaxed pl-9">
        ${r.comment}
      </p>
    </div>
  `).join('');
}

function renderProductDetailView() {
  const content = document.getElementById('productDetailContent');
  if (!content || !currentDetailProduct) return;

  const p = currentDetailProduct;
  const curVar = p.variants[currentDetailVariantIndex];
  const gallery = (p.gallery && p.gallery.length > 0) ? p.gallery : [p.image];

  content.innerHTML = `
    <!-- ব্রেডক্রাম্ব নেভিগেশন -->
    <div class="mb-4 sm:mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
      <span class="hover:text-emerald-700 cursor-pointer" onclick="closeProductDetailPage()">হোম</span>
      <span>›</span>
      <span class="text-emerald-700 font-bold">${p.categoryBangla || 'অর্গানিক পণ্য'}</span>
      <span>›</span>
      <span class="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">${p.banglaName}</span>
    </div>

    <!-- মূল ৩-কলাম প্রডাক্ট সেকশন (গ্যালারি থাম্বনেইল উল্লম্বভাবে, বড় সেন্ট্রাল প্রিভিউ, ডান পাশের বিবরণ ও শুধুই ২ বাটন) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
      
      <!-- ১. বাম সাইডের অপশন/ভ্যারিয়েন্ট থাম্বনেইল (মোবাইলে অনুভূমিক, ডেক্সটপে সুন্দর উল্লম্ব স্ট্যাক) -->
      <div class="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[480px] pb-2 lg:pb-0 scrollbar-thin">
        ${gallery.map((imgUrl, i) => `
          <button 
            type="button" 
            onclick="selectDetailThumbnail('${imgUrl}')"
            data-src="${imgUrl}"
            class="detail-thumbnail-btn w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 ${imgUrl === currentDetailActiveImage ? 'border-emerald-600 ring-2 ring-emerald-300 shadow-sm' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'} transition-all flex-shrink-0 cursor-pointer bg-slate-50"
            title="অপশন ভিউ ${i + 1}"
          >
            <img src="${imgUrl}" alt="${p.banglaName} ভিউ ${i + 1}" class="w-full h-full object-cover"/>
          </button>
        `).join('')}
      </div>

      <!-- ২. মাঝখানের বড় ও আকর্ষণীয় প্রিমিয়াম প্রিভিউ ইমেজ -->
      <div class="lg:col-span-6 order-1 lg:order-2">
        <div class="relative w-full aspect-square bg-slate-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md group">
          <img 
            id="detailMainPreviewImg" 
            src="${currentDetailActiveImage}" 
            alt="${p.banglaName}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <!-- ডিসকাউন্ট ছাড়ের লাল ব্যাজ -->
          ${p.discountPercent ? `
            <div class="absolute top-3.5 left-3.5 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg flex items-center gap-1 font-brand">
              <span>-${toBanglaNum(p.discountPercent)}% OFF</span>
            </div>
          ` : ''}

          <!-- ১০০% অর্গানিক গ্রিন ব্যাজ -->
          <div class="absolute top-3.5 right-3.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span>১০০% অর্গানিক</span>
          </div>
        </div>
      </div>

      <!-- ৩. ডান পাশের প্রোডাক্টের বিবরণ, মূল্য, ভ্যারিয়েন্ট, কোয়ান্টিটি এবং শুধুই দুটি বাটন -->
      <div class="lg:col-span-4 order-3 flex flex-col justify-between space-y-4">
        <div>
          <!-- ক্যাটাগরি ট্যাগ -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <span>🌿</span>
            <span>${p.categoryBangla}</span>
          </div>

          <!-- বড় বাংলা নাম -->
          <h1 class="text-xl sm:text-2xl font-black font-bangla-title text-slate-900 leading-tight">
            ${p.banglaName}
          </h1>

          <!-- ইংরেজি অফিশিয়াল সাবটাইটেল -->
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            ${p.name}
          </p>

          <!-- রেটিং ও রিভিউ সংখ্যা -->
          <div class="flex items-center gap-2 mt-2">
            <div class="flex text-amber-400 text-sm">
              ${'★'.repeat(Math.round(p.rating || 5))}${'☆'.repeat(5 - Math.round(p.rating || 5))}
            </div>
            <span class="text-xs font-black text-slate-800 font-brand">${toBanglaNum(p.rating || 5.0)}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs font-bold text-emerald-700">(${toBanglaNum(p.reviewsCount || 120)} রিভিউ)</span>
          </div>

          <!-- প্রাইস সেকশন -->
          <div class="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-black text-slate-700">৳</span>
              <span id="detailPriceVal" class="text-2xl sm:text-3xl font-black text-[#1E3A8A] font-brand">
                ${toBanglaNum(curVar.price)}
              </span>
              ${curVar.originalPrice ? `
                <span id="detailOrigPriceVal" class="text-sm text-slate-400 line-through font-brand">
                  ৳${toBanglaNum(curVar.originalPrice)}
                </span>
              ` : ''}
              ${p.discountPercent ? `
                <span class="ml-auto text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-brand">
                  Save ${toBanglaNum(p.discountPercent)}%
                </span>
              ` : ''}
            </div>
            <div class="text-[11px] text-slate-500 mt-1">
              ভ্যাট সহ সর্বমোট মূল্য • স্টক: <span id="detailStockVal" class="font-bold text-emerald-700">${toBanglaNum(curVar.stock || 25)}</span> পিস অবশিষ্ট
            </div>
          </div>

          <!-- ভ্যারিয়েন্ট / সাইজ সিলেক্টর -->
          <div class="mt-3.5">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">সাইজ / ওজন সিলেক্ট করুন:</label>
            <div class="flex flex-wrap gap-2">
              ${p.variants.map((v, i) => `
                <button 
                  type="button" 
                  onclick="selectDetailVariant(${i})"
                  class="detail-var-btn px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${i === currentDetailVariantIndex ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200 shadow-xs' : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'}"
                >
                  ${v.size} - ৳${toBanglaNum(v.price)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- কোয়ান্টিটি সিলেক্টর -->
          <div class="mt-3.5">
            <label class="block text-xs font-bold text-slate-700 mb-1.5">পরিমাণ (Quantity):</label>
            <div class="flex items-center gap-3">
              <div class="inline-flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1">
                <button 
                  type="button" 
                  onclick="changeDetailQty(-1)" 
                  class="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center shadow-xs transition-colors"
                  title="কমান"
                >-</button>
                <span id="detailQtyDisplay" class="font-black text-sm w-12 text-center text-slate-900 font-brand">
                  ${currentDetailQty}
                </span>
                <button 
                  type="button" 
                  onclick="changeDetailQty(1)" 
                  class="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center shadow-xs transition-colors"
                  title="বাড়ান"
                >+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- শুধুই দুটি অ্যাকশন বাটন: Add to Cart ও Order Now (কোনো অতিরিক্ত ব্যাজ বা জঞ্জাল ছাড়া) -->
        <div class="pt-3 border-t border-slate-100">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button 
              type="button" 
              onclick="addDetailProductToCart()"
              class="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm rounded-xl border-2 border-emerald-300 transition-all flex items-center justify-center gap-2 font-brand active:scale-98 shadow-xs"
            >
              <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Add to Cart</span>
            </button>

            <button 
              type="button" 
              onclick="orderNowDetailProduct()"
              class="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 font-brand"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              <span>Order Now (অর্ডার করুন)</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- নিচে বিস্তারিত ডেসক্রিপশন এবং স্বাস্থ্য উপকারিতা -->
    <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200">
      <div class="bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/40 rounded-2xl p-5 sm:p-8 border border-slate-200">
        <h3 class="text-lg sm:text-xl font-black font-bangla-title text-slate-900 mb-3 flex items-center gap-2">
          <span>📜</span>
          <span>প্রোডাক্ট ডেসক্রিপশন ও বিস্তারিত বিবরণী</span>
        </h3>
        <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
          ${p.description}
        </p>

        ${p.benefits && p.benefits.length > 0 ? `
          <div class="mt-5 pt-5 border-t border-slate-200/60">
            <h4 class="text-sm sm:text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <span>✨</span>
              <span>মূল উপকারিতা ও কার্যকারিতা:</span>
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${p.benefits.map(benefit => `
                <div class="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                  <span class="text-emerald-600 font-black text-sm">✓</span>
                  <span class="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">${benefit}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- কাস্টমার রিভিউ ও রেটিং সেকশন -->
    <div class="mt-8 sm:mt-10 pt-6 border-t border-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 class="text-lg sm:text-xl font-black font-bangla-title text-slate-900 flex items-center gap-2">
            <span>⭐</span>
            <span>কাস্টমার রিভিউ ও রেটিং</span>
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">আমাদের সন্তুষ্ট গ্রাহকদের মতামত ও অভিজ্ঞতা</p>
        </div>
        <div class="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
          <div class="text-2xl font-black text-amber-700 font-brand">${toBanglaNum(p.rating || 5.0)}</div>
          <div>
            <div class="text-amber-400 text-xs">★★★★★</div>
            <div class="text-[11px] font-bold text-slate-600">${toBanglaNum(p.reviewsCount || 120)} রেটিং এর ভিত্তিতে</div>
          </div>
        </div>
      </div>

      <!-- রিভিউ দেওয়া ও রেটিং সাবমিশনের বক্স -->
      <div class="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 mb-8">
        <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
          <span>✍️</span>
          <span>আপনার মূল্যবান রিভিউ ও রেটিং দিন:</span>
        </h4>

        <!-- ৫-স্টার ইন্টারঅ্যাক্টিভ রেটিং পিকার -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">আপনার রেটিং নির্বাচন করুন:</label>
          <div class="flex items-center gap-1.5">
            ${[1, 2, 3, 4, 5].map(starNum => `
              <button 
                type="button" 
                onclick="setReviewRating(${starNum})" 
                id="review-star-${starNum}"
                class="text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none ${starNum <= currentReviewRating ? 'text-amber-400' : 'text-slate-300'}"
                title="${starNum} স্টার"
              >★</button>
            `).join('')}
            <span id="reviewRatingFeedback" class="ml-3 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ৫ স্টার - চমৎকার ও সেরা মানের
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">আপনার নাম (ঐচ্ছিক):</label>
            <input 
              type="text" 
              id="reviewAuthorName" 
              placeholder="যেমন: আসবি হাসান" 
              class="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="block text-xs font-semibold text-slate-600 mb-1">আপনার মন্তব্য / অভিজ্ঞতা:</label>
          <textarea 
            id="reviewCommentText" 
            rows="3" 
            placeholder="পণ্যটি আপনার কেমন লেগেছে? স্বাদ, গন্ধ ও গুণগত মান সম্পর্কে সংক্ষেপে লিখুন..." 
            class="w-full text-xs font-medium p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
          ></textarea>
        </div>

        <button 
          type="button" 
          onclick="submitCustomerReview('${p.id}')"
          class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
        >
          রিভিউ সাবমিট করুন
        </button>
      </div>

      <!-- রিভিউ সমূহ তালিকা -->
      <div id="detailReviewsList" class="space-y-3">
        <!-- Rendered by renderReviewsList() -->
      </div>
    </div>
  `;

  renderReviewsList();
}

// কার্ট ফাংশনালিটি
function addToCart(productId, variantIndex, quantity = 1) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  const variant = product.variants[variantIndex];

  const existing = cart.find(i => i.productId === productId && i.variantIndex === variantIndex);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      variantIndex: variantIndex,
      name: product.name,
      banglaName: product.banglaName,
      size: variant.size,
      price: variant.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart();
  showToast(`"${product.banglaName} (${variant.size})" কার্ট-এ যোগ হয়েছে!`);
  openCartDrawer();
}

function updateCartQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
  }
}

function removeCartItem(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
    showToast("আইটেমটি সরানো হয়েছে");
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cartDrawerItems');
  const subtotalElem = document.getElementById('cartSubtotal');
  const countElem = document.getElementById('cartDrawerCount');
  if (!container) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (countElem) countElem.textContent = `(${toBanglaNum(totalItems)} টি)`;
  if (subtotalElem) subtotalElem.textContent = `৳${toBanglaNum(subtotal)}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-400">
        <svg class="w-14 h-14 mx-auto mb-2 text-slate-300 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <p class="font-bold text-slate-700 text-sm">আপনার ব্যাগ খালি</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item, index) => `
    <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <img src="${item.image}" alt="${item.banglaName}" class="w-14 h-14 rounded-lg object-cover bg-slate-50"/>
      <div class="flex-grow min-w-0">
        <h4 class="font-bold text-slate-800 text-xs truncate">${item.banglaName}</h4>
        <span class="text-[11px] text-slate-500 font-medium">${item.size}</span>
        <div class="flex items-center justify-between mt-1.5">
          <span class="font-bold text-blue-900 text-xs">৳${toBanglaNum(item.price * item.quantity)}</span>
          <div class="flex items-center border border-slate-200 rounded overflow-hidden">
            <button onclick="updateCartQuantity(${index}, -1)" class="w-5 h-5 flex items-center justify-center text-xs hover:bg-slate-100">-</button>
            <span class="px-2 text-xs font-bold">${toBanglaNum(item.quantity)}</span>
            <button onclick="updateCartQuantity(${index}, 1)" class="w-5 h-5 flex items-center justify-center text-xs hover:bg-slate-100">+</button>
          </div>
        </div>
      </div>
      <button onclick="removeCartItem(${index})" class="text-slate-300 hover:text-rose-500 p-1">
        <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  `).join('');
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
}

// ==========================================
// ৪. সহজ গেস্ট চেকআউট (Asbi's Minimal Form)
// ==========================================
// ==========================================
// ৪. সহজ চেকআউট ও সম্পূর্ণ পেমেন্ট গেটওয়ে সিস্টেম (bKash, Nagad, Rocket, Bank, COD)
// ==========================================
let selectedPaymentMethod = 'cod';
let currentGatewayMethod = '';
let currentGatewayOrderData = null;
let gatewayOtpTimerInterval = null;
let gatewayOtpRemainingSeconds = 120;

function quickOrderNow(productId) {
  const select = document.getElementById(`var-${productId}`);
  const vIndex = select ? parseInt(select.value) : 0;
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  checkoutProduct = {
    ...product,
    selectedVariant: product.variants[vIndex],
    quantity: 1
  };
  openCheckoutModal();
}

// লগইন করা গ্রাহকের প্রোফাইল তথ্য দিয়ে চেকআউট ফর্ম স্বয়ংক্রিয়ভাবে পূরণ করা
function autofillCheckoutFromProfile() {
  const nameEl = document.getElementById('custName');
  const phoneEl = document.getElementById('custPhone');
  const addrEl = document.getElementById('custAddress');
  const areaEl = document.getElementById('checkoutAreaSelect');
  const badgeEl = document.getElementById('checkoutAutofillBadge');

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('asbi_auth_user'));
  } catch (e) {}

  if (!user || !user.loggedIn) {
    if (badgeEl) badgeEl.classList.add('hidden');
    return;
  }

  if (nameEl && user.name) nameEl.value = user.name;
  if (phoneEl && user.phone) phoneEl.value = user.phone;

  // পূর্ণ ডেলিভারি ঠিকানা গঠন (Address + Upazila + District + Division)
  const parts = [];
  if (user.address && user.address.trim()) parts.push(user.address.trim());
  const baseLower = (user.address || '').toLowerCase();
  if (user.upazila && !baseLower.includes(user.upazila.toLowerCase())) parts.push(user.upazila);
  if (user.district && !baseLower.includes(user.district.toLowerCase())) parts.push(user.district);
  if (user.division && !baseLower.includes(user.division.toLowerCase())) parts.push(user.division);

  if (addrEl && parts.length > 0) {
    addrEl.value = parts.join(', ');
  }

  // প্রোফাইলের জেলা/বিভাগ অনুযায়ী স্বয়ংক্রিয় ডেলিভারি এলাকা (ঢাকার ভেতরে বনাম ঢাকার বাইরে)
  if (areaEl) {
    const dist = (user.district || '').toLowerCase();
    const div = (user.division || user.location || user.city || '').toLowerCase();
    const isDhakaCity = dist ? dist === 'dhaka' : (div === 'dhaka' || div.includes('dhaka') || div.includes('ঢাকা'));
    areaEl.value = isDhakaCity ? 'dhaka_inside' : 'dhaka_outside';
  }

  if (badgeEl) badgeEl.classList.remove('hidden');
}

function openCheckoutModal() {
  closeCartDrawer();
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  autofillCheckoutFromProfile();
  renderCheckoutSummary();
  onPaymentMethodChange('cod'); // ডিফল্ট ক্যাশ অন ডেলিভারি
  modal.classList.remove('hidden');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('hidden');
  checkoutProduct = null;
}

function onPaymentMethodChange(method) {
  selectedPaymentMethod = method;
  
  // কার্ড স্টাইলিং আপডেট
  document.querySelectorAll('.payment-method-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.value === method) {
      radio.checked = true;
      card.className = 'payment-method-card flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 shadow-sm cursor-pointer transition-all text-center';
      if (card.classList.contains('col-span-2')) {
        card.className = 'payment-method-card col-span-2 sm:col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 shadow-sm cursor-pointer transition-all text-center';
      }
    } else {
      if (radio) radio.checked = false;
      card.className = 'payment-method-card flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all text-center';
      if (card.classList.contains('col-span-2')) {
        card.className = 'payment-method-card col-span-2 sm:col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all text-center';
      }
    }
  });

  // বিস্তারিত সেকশন টগল
  const details = ['cod', 'bkash', 'nagad', 'rocket', 'bank'];
  details.forEach(d => {
    const el = document.getElementById(`detail-${d}`);
    if (el) el.classList.toggle('hidden', d !== method);
  });

  // সাবমিট বাটনের টেক্সট ও রং (Default English)
  const submitBtn = document.getElementById('checkoutSubmitBtn');
  if (submitBtn) {
    if (method === 'cod') {
      submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
      submitBtn.innerHTML = '<span>Confirm Order (Cash on Delivery)</span>';
    } else if (method === 'bkash') {
      submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-[#D12053] to-[#B01741] hover:opacity-95 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
      submitBtn.innerHTML = '<span>Proceed to bKash Payment →</span>';
    } else if (method === 'nagad') {
      submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-[#F7941D] to-[#D97A0C] hover:opacity-95 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
      submitBtn.innerHTML = '<span>Proceed to Nagad Payment →</span>';
    } else if (method === 'rocket') {
      submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-[#8C3494] to-[#702476] hover:opacity-95 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
      submitBtn.innerHTML = '<span>Proceed to Rocket Payment →</span>';
    } else if (method === 'bank') {
      submitBtn.className = 'w-full py-3.5 bg-gradient-to-r from-[#1E3A8A] to-blue-900 hover:bg-blue-800 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
      submitBtn.innerHTML = '<span>Confirm Bank Transfer Order</span>';
    }
  }
}

function renderCheckoutSummary() {
  const itemsContainer = document.getElementById('checkoutItemsList');
  const subtotalElem = document.getElementById('checkoutSubtotal');
  const deliveryElem = document.getElementById('checkoutDeliveryCharge');
  const totalElem = document.getElementById('checkoutTotalPayable');
  if (!itemsContainer) return;

  let items = [];
  let subtotal = 0;

  if (checkoutProduct) {
    const qty = checkoutProduct.quantity || 1;
    items = [{
      name: checkoutProduct.banglaName,
      size: checkoutProduct.selectedVariant.size,
      price: checkoutProduct.selectedVariant.price * qty,
      quantity: qty,
      image: checkoutProduct.image
    }];
    subtotal = checkoutProduct.selectedVariant.price * qty;
  } else {
    items = cart.map(i => ({
      name: i.banglaName,
      size: i.size,
      price: i.price * i.quantity,
      quantity: i.quantity,
      image: i.image
    }));
    subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }

  const areaSelect = document.getElementById('checkoutAreaSelect');
  const deliveryCharge = areaSelect && areaSelect.value === 'dhaka_outside' ? 120 : 60;
  const total = subtotal + deliveryCharge;

  itemsContainer.innerHTML = items.map(i => `
    <div class="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
      <span class="truncate max-w-[200px] text-slate-800 font-medium">${i.name} (${i.size})</span>
      <span class="font-bold text-slate-900 font-brand">৳${toBanglaNum(i.price)}</span>
    </div>
  `).join('');

  if (subtotalElem) subtotalElem.textContent = `৳${toBanglaNum(subtotal)}`;
  if (deliveryElem) deliveryElem.textContent = `৳${toBanglaNum(deliveryCharge)}`;
  if (totalElem) totalElem.textContent = `৳${toBanglaNum(total)}`;
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const area = document.getElementById('checkoutAreaSelect').value;

  if (!name || !phone || !address) {
    alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করুন।");
    return;
  }

  if (phone.replace(/[\s-]/g, '').length < 11) {
    alert("অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 01XXXXXXXXX)।");
    return;
  }

  const deliveryCharge = area === 'dhaka_outside' ? 120 : 60;
  let items = [];
  let totalAmount = 0;

  if (checkoutProduct) {
    const qty = checkoutProduct.quantity || 1;
    items = [{
      id: checkoutProduct.id,
      name: checkoutProduct.banglaName,
      size: checkoutProduct.selectedVariant.size,
      price: checkoutProduct.selectedVariant.price * qty,
      quantity: qty,
      image: checkoutProduct.image
    }];
    totalAmount = (checkoutProduct.selectedVariant.price * qty) + deliveryCharge;
  } else {
    items = cart.map(i => ({
      id: i.id,
      name: i.banglaName,
      size: i.size,
      price: i.price * i.quantity,
      quantity: i.quantity,
      image: i.image
    }));
    totalAmount = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0) + deliveryCharge;
  }

  if (items.length === 0) {
    alert("অর্ডার করার জন্য অন্তত একটি পণ্য কার্টে যোগ করুন।");
    return;
  }

  let authUser = null;
  try { authUser = JSON.parse(localStorage.getItem('asbi_auth_user')); } catch (err) {}
  const email = (authUser && authUser.email) ? authUser.email : '';
  const token = localStorage.getItem('asbi_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const submitBtn = document.getElementById('checkoutSubmitBtn');
  const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'অর্ডার প্রসেস হচ্ছে...';
  }

  try {
    // ১. বিকাশ, নগদ বা রকেট — রিয়েল ব্যাকএন্ড পেমেন্ট ইনিশিয়েট (অফিসিয়াল bKash / SSLCommerz রিডাইরেক্ট অথবা রিয়েল TrxID ভেরিফিকেশন)
    if (selectedPaymentMethod === 'bkash' || selectedPaymentMethod === 'nagad' || selectedPaymentMethod === 'rocket') {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name, phone, email, address, area, items, totalAmount,
          method: selectedPaymentMethod
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.order) {
        alert(data.message || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে।');
        return;
      }

      // অফিসিয়াল bKash বা SSLCommerz গেটওয়ে চালু থাকলে সরাসরি আসল গেটওয়েতে রিডাইরেক্ট (রিয়েল SMS OTP + PIN)
      if (data.mode === 'redirect' && data.gatewayUrl) {
        if (!checkoutProduct) { cart = []; saveCart(); }
        checkoutProduct = null;
        window.location.href = data.gatewayUrl;
        return;
      }

      // মার্চেন্ট Send Money + আসল TrxID ভেরিফিকেশন মোড
      currentGatewayOrderData = {
        orderId: data.order.orderId,
        name, phone, email, address, area, items, totalAmount,
        method: selectedPaymentMethod,
        merchantNumber: data.merchantNumber || '01821-296056'
      };
      closeCheckoutModal();
      openPaymentGateway(selectedPaymentMethod, totalAmount, phone, data.order.orderId, data.merchantNumber);
      return;
    }

    // ২. ব্যাংক ট্রান্সফার বা ক্যাশ অন ডেলিভারি — সরাসরি ব্যাকএন্ডে রিয়েল অর্ডার সংরক্ষণ ও ইমেইল কনফার্মেশন
    const isBank = selectedPaymentMethod === 'bank';
    const senderInfo = isBank && document.getElementById('bankSenderInfo') ? document.getElementById('bankSenderInfo').value.trim() : '';
    const bankTrxId = isBank && document.getElementById('bankTrxId') ? document.getElementById('bankTrxId').value.trim() : '';

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name, phone, email, address, area, items, totalAmount,
        paymentMethod: isBank ? 'Bank Transfer' : 'Cash on Delivery',
        paymentStatus: isBank ? 'Under Verification' : 'Cash on Delivery',
        transactionId: bankTrxId,
        senderNumber: senderInfo
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.order) {
      alert(data.message || 'অর্ডার সংরক্ষণ করতে সমস্যা হয়েছে।');
      return;
    }

    const savedOrder = data.order;
    saveOrderLocallyOnly(savedOrder);
    finalizeOrderSuccess(
      savedOrder.orderId,
      savedOrder.customer.name,
      savedOrder.customer.phone,
      savedOrder.customer.address,
      savedOrder.totalAmount,
      savedOrder.paymentMethod,
      savedOrder.transactionId || null
    );
  } catch (err) {
    alert('সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে। অনুগ্রহ করে সার্ভার চালু আছে কি না যাচাই করুন।');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHtml;
    }
  }
}

function saveOrderLocallyOnly(order) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('asbi_orders')) || []; } catch (e) { orders = []; }
  orders.unshift(order);
  localStorage.setItem('asbi_orders', JSON.stringify(orders));
  if (!checkoutProduct) {
    cart = [];
    saveCart();
  }
  checkoutProduct = null;
}

// সফল অর্ডার পপআপ প্রদর্শন
function finalizeOrderSuccess(orderId, name, phone, address, totalAmount, paymentMethod, trxId) {
  closeCheckoutModal();
  document.getElementById('successOrderId').textContent = '#' + orderId;
  document.getElementById('successCustName').textContent = name;
  document.getElementById('successCustPhone').textContent = phone;
  document.getElementById('successCustAddress').textContent = address;
  document.getElementById('successTotalAmount').textContent = `৳${toBanglaNum(totalAmount)}`;
  document.getElementById('successPaymentMethod').textContent = paymentMethod;

  const trxRow = document.getElementById('successTrxRow');
  const trxElem = document.getElementById('successTrxId');
  if (trxRow && trxElem) {
    if (trxId) {
      trxElem.textContent = trxId;
      trxRow.classList.remove('hidden');
    } else {
      trxRow.classList.add('hidden');
    }
  }

  document.getElementById('orderSuccessModal').classList.remove('hidden');
}

function closeOrderSuccessModal() {
  document.getElementById('orderSuccessModal').classList.add('hidden');
}

// ==========================================
// ৪.১ অটোমেটেড পেমেন্ট গেটওয়ে সিস্টেম (bKash, Nagad, Rocket — Account No -> OTP -> PIN -> Auto Deduction)
// ==========================================
let gatewayCountdownInterval = null;
let gatewayRemainingSec = 60;

function openPaymentGateway(method, amount, defaultPhone, orderId, merchantNumber) {
  currentGatewayMethod = method;
  const modal = document.getElementById('paymentGatewayModal');
  const header = document.getElementById('gatewayHeader');
  const title = document.getElementById('gatewayTitle');
  const logoIcon = document.getElementById('gatewayLogoIcon');
  const amountElem = document.getElementById('gatewayPayableAmount');
  const btnAmountElem = document.getElementById('gatewayBtnAmount');
  const orderElem = document.getElementById('gatewayOrderIdDisplay');
  const phoneLabel = document.getElementById('gatewayPhoneLabel');
  const pinLabel = document.getElementById('gatewayPinLabel');
  const accountInput = document.getElementById('gatewayAccountInput');
  const toOtpBtn = document.getElementById('gatewayToOtpBtn');
  const toPinBtn = document.getElementById('gatewayToPinBtn');
  const executeBtn = document.getElementById('gatewayExecuteBtn');
  if (!modal) return;

  const bAmount = toBanglaNum(amount);
  if (amountElem) amountElem.textContent = `৳${bAmount}`;
  if (btnAmountElem) btnAmountElem.textContent = bAmount;
  if (orderElem) orderElem.textContent = '#' + (orderId || '');
  if (accountInput) accountInput.value = defaultPhone || '';

  const theme = {
    bkash: { bg: 'bg-[#D12053]', title: 'bKash Automated Gateway', name: 'bKash', icon: '🔴' },
    nagad: { bg: 'bg-[#F7941D]', title: 'Nagad Automated Gateway', name: 'Nagad', icon: '🟠' },
    rocket: { bg: 'bg-[#8C3494]', title: 'Rocket Automated Gateway', name: 'Rocket', icon: '🟣' }
  }[method] || { bg: 'bg-[#1E3A8A]', title: 'Online Payment Gateway', name: 'MFS', icon: '💳' };

  if (header) header.className = `p-4 text-white flex items-center justify-between transition-colors ${theme.bg}`;
  if (title) title.textContent = theme.title;
  if (logoIcon) logoIcon.textContent = theme.icon;
  if (phoneLabel) phoneLabel.textContent = `Your ${theme.name} Account Number`;
  if (pinLabel) pinLabel.textContent = `Enter your ${theme.name} PIN`;

  [toOtpBtn, toPinBtn, executeBtn].forEach(btn => {
    if (btn) btn.className = `py-3 rounded-xl font-black text-white text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 ${theme.bg} hover:opacity-95 cursor-pointer`;
  });

  // Reset steps
  backGatewayToPhone();
  modal.classList.remove('hidden');
}

function closePaymentGateway() {
  const modal = document.getElementById('paymentGatewayModal');
  if (modal) modal.classList.add('hidden');
  if (gatewayCountdownInterval) clearInterval(gatewayCountdownInterval);
}

function showGatewayError(msg) {
  const box = document.getElementById('gatewayErrorNotice');
  const txt = document.getElementById('gatewayErrorMsg');
  if (box && txt) {
    txt.textContent = msg;
    box.classList.remove('hidden');
  } else {
    alert(msg);
  }
}

function hideGatewayError() {
  const box = document.getElementById('gatewayErrorNotice');
  if (box) box.classList.add('hidden');
}

async function proceedGatewayToOtp() {
  hideGatewayError();
  const accountInput = document.getElementById('gatewayAccountInput');
  const termsCheck = document.getElementById('gatewayTermsCheck');
  const toOtpBtn = document.getElementById('gatewayToOtpBtn');

  let val = accountInput ? accountInput.value.replace(/[\s-+()]/g, '').trim() : '';
  if (val.startsWith('88')) val = val.slice(2);
  if (val.length === 10 && val.startsWith('1')) val = '0' + val;

  if (val.length !== 11 || !/^01[3-9]\d{8}$/.test(val)) {
    showGatewayError('Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)');
    if (accountInput) accountInput.focus();
    return;
  }
  if (termsCheck && !termsCheck.checked) {
    showGatewayError('Please agree to the Terms & Conditions to proceed.');
    return;
  }

  const origBtnText = toOtpBtn ? toOtpBtn.innerHTML : 'Proceed to OTP →';
  if (toOtpBtn) {
    toOtpBtn.disabled = true;
    toOtpBtn.innerHTML = '<span>Sending OTP...</span>';
  }

  try {
    const orderId = currentGatewayOrderData ? currentGatewayOrderData.orderId : '';
    const res = await fetch('/api/payments/gateway-otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        method: currentGatewayMethod || 'bKash',
        phoneNumber: val
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showGatewayError(data.message || 'Failed to send OTP code. Please try again.');
      return;
    }

    const targetDisplay = document.getElementById('gatewayTargetNumberDisplay');
    if (targetDisplay) targetDisplay.textContent = val;

    document.getElementById('gatewayStepPhone').classList.add('hidden');
    document.getElementById('gatewayStepOtp').classList.remove('hidden');
    document.getElementById('gatewayStepPin').classList.add('hidden');
    document.getElementById('gatewayStepProcessing').classList.add('hidden');

    const otpInput = document.getElementById('gatewayOtpInput');
    if (otpInput) {
      otpInput.value = '';
      otpInput.focus();
    }

    startGatewayOtpCountdown();

    if (data.devCode) {
      console.log(`[TESTING OTP CODE]: ${data.devCode}`);
      showGatewayError(`Verification Code sent to ${val}. (Test OTP: ${data.devCode})`);
    }
  } catch (err) {
    showGatewayError('Server connection failed. Please try again.');
  } finally {
    if (toOtpBtn) {
      toOtpBtn.disabled = false;
      toOtpBtn.innerHTML = origBtnText;
    }
  }
}

function startGatewayOtpCountdown() {
  if (gatewayCountdownInterval) clearInterval(gatewayCountdownInterval);
  gatewayRemainingSec = 60;
  const countElem = document.getElementById('gatewayCountdown');
  const resendBtn = document.getElementById('gatewayResendBtn');
  if (resendBtn) {
    resendBtn.disabled = true;
    resendBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  gatewayCountdownInterval = setInterval(() => {
    gatewayRemainingSec--;
    if (countElem) countElem.textContent = `${gatewayRemainingSec}s`;
    if (gatewayRemainingSec <= 0) {
      clearInterval(gatewayCountdownInterval);
      if (resendBtn) {
        resendBtn.disabled = false;
        resendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      if (countElem) countElem.textContent = 'Expired';
    }
  }, 1000);
}

async function resendGatewayOtp() {
  const accountInput = document.getElementById('gatewayAccountInput');
  let val = accountInput ? accountInput.value.replace(/[\s-+()]/g, '').trim() : '';
  if (val.startsWith('88')) val = val.slice(2);
  if (val.length === 10 && val.startsWith('1')) val = '0' + val;

  const orderId = currentGatewayOrderData ? currentGatewayOrderData.orderId : '';
  try {
    const res = await fetch('/api/payments/gateway-otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, method: currentGatewayMethod || 'bKash', phoneNumber: val })
    });
    const data = await res.json();
    if (data.success) {
      startGatewayOtpCountdown();
      if (data.devCode) {
        showGatewayError(`New OTP Code sent to ${val}. (Test OTP: ${data.devCode})`);
      } else {
        showGatewayError(`New 6-digit OTP code sent to ${val}.`);
      }
    }
  } catch (e) {
    startGatewayOtpCountdown();
  }
}

function backGatewayToPhone() {
  hideGatewayError();
  document.getElementById('gatewayStepPhone').classList.remove('hidden');
  document.getElementById('gatewayStepOtp').classList.add('hidden');
  document.getElementById('gatewayStepPin').classList.add('hidden');
  document.getElementById('gatewayStepProcessing').classList.add('hidden');
  if (gatewayCountdownInterval) clearInterval(gatewayCountdownInterval);
}

async function proceedGatewayToPin() {
  hideGatewayError();
  const accountInput = document.getElementById('gatewayAccountInput');
  const otpInput = document.getElementById('gatewayOtpInput');
  const toPinBtn = document.getElementById('gatewayToPinBtn');

  let phoneNumber = accountInput ? accountInput.value.replace(/[\s-+()]/g, '').trim() : '';
  if (phoneNumber.startsWith('88')) phoneNumber = phoneNumber.slice(2);
  if (phoneNumber.length === 10 && phoneNumber.startsWith('1')) phoneNumber = '0' + phoneNumber;

  const otpVal = otpInput ? otpInput.value.trim() : '';
  if (otpVal.length < 4) {
    showGatewayError('Please enter the 6-digit verification code sent to your mobile.');
    if (otpInput) otpInput.focus();
    return;
  }

  const origBtnText = toPinBtn ? toPinBtn.innerHTML : 'Verify OTP →';
  if (toPinBtn) {
    toPinBtn.disabled = true;
    toPinBtn.innerHTML = '<span>Verifying...</span>';
  }

  try {
    const orderId = currentGatewayOrderData ? currentGatewayOrderData.orderId : '';
    const res = await fetch('/api/payments/gateway-otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        phoneNumber,
        otpCode: otpVal
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showGatewayError(data.message || 'Incorrect OTP code. Please enter the valid code.');
      if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
      }
      return;
    }

    document.getElementById('gatewayStepPhone').classList.add('hidden');
    document.getElementById('gatewayStepOtp').classList.add('hidden');
    document.getElementById('gatewayStepPin').classList.remove('hidden');
    document.getElementById('gatewayStepProcessing').classList.add('hidden');

    const pinInput = document.getElementById('gatewayPinInput');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  } catch (err) {
    showGatewayError('Server verification error. Please try again.');
  } finally {
    if (toPinBtn) {
      toPinBtn.disabled = false;
      toPinBtn.innerHTML = origBtnText;
    }
  }
}

function backGatewayToOtp() {
  hideGatewayError();
  document.getElementById('gatewayStepPhone').classList.add('hidden');
  document.getElementById('gatewayStepOtp').classList.remove('hidden');
  document.getElementById('gatewayStepPin').classList.add('hidden');
  document.getElementById('gatewayStepProcessing').classList.add('hidden');
}

async function executeAutomatedGatewayPayment() {
  hideGatewayError();
  if (!currentGatewayOrderData) return;
  const accountInput = document.getElementById('gatewayAccountInput');
  const otpInput = document.getElementById('gatewayOtpInput');
  const pinInput = document.getElementById('gatewayPinInput');

  let accountNumber = accountInput ? accountInput.value.replace(/[\s-+()]/g, '').trim() : '';
  if (accountNumber.startsWith('88')) accountNumber = accountNumber.slice(2);
  if (accountNumber.length === 10 && accountNumber.startsWith('1')) accountNumber = '0' + accountNumber;

  const otp = otpInput ? otpInput.value.trim() : '';
  const pin = pinInput ? pinInput.value.trim() : '';

  if (pin.length < 4) {
    showGatewayError('Please enter your 4 or 5 digit PIN.');
    if (pinInput) pinInput.focus();
    return;
  }

  document.getElementById('gatewayStepPin').classList.add('hidden');
  document.getElementById('gatewayStepProcessing').classList.remove('hidden');

  try {
    const res = await fetch('/api/payments/gateway-pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: currentGatewayOrderData.orderId,
        method: currentGatewayMethod,
        accountNumber,
        otp,
        pin
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.order) {
      document.getElementById('gatewayStepProcessing').classList.add('hidden');
      document.getElementById('gatewayStepPin').classList.remove('hidden');
      showGatewayError(data.message || 'Payment processing failed. Please try again.');
      return;
    }

    closePaymentGateway();
    saveOrderLocallyOnly(data.order);
    finalizeOrderSuccess(
      data.order.orderId,
      data.order.customer.name,
      data.order.customer.phone,
      data.order.customer.address,
      data.order.totalAmount,
      data.order.paymentMethod,
      data.order.transactionId
    );
    currentGatewayOrderData = null;
  } catch (err) {
    document.getElementById('gatewayStepProcessing').classList.add('hidden');
    document.getElementById('gatewayStepPin').classList.remove('hidden');
    showGatewayError('Server connection error. Please try again.');
  }
}

// অফিসিয়াল bKash / SSLCommerz পেমেন্ট রিডাইরেক্ট থেকে ফিরে এলে অর্ডার কনফার্মেশন দেখানো
async function checkPaymentCallbackReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('payment_status');
  const orderId = params.get('orderId');
  const trxId = params.get('trxId');
  if (!status) return;

  if (status === 'success' && orderId) {
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (data.success && data.order) {
        const o = data.order;
        finalizeOrderSuccess(o.orderId, o.customer.name, o.customer.phone, o.customer.address, o.totalAmount, o.paymentMethod, trxId || o.transactionId);
      }
    } catch (e) {}
  } else if (status === 'failed' || status === 'cancelled') {
    showToast('পেমেন্ট সম্পন্ন হয়নি। আপনি আবার চেষ্টা করতে পারেন।');
  }

  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ==========================================
// ৫. ভাসমান চ্যাট উইজেট (Floating Chat Widget)
// ==========================================
function toggleChatBox() {
  const box = document.getElementById('chatBoxPopup');
  if (box) {
    box.classList.toggle('hidden');
  }
}

function sendChatMessage(presetText = '') {
  const input = document.getElementById('chatInput');
  const text = presetText || (input ? input.value.trim() : '');
  if (!text) return;

  const messagesContainer = document.getElementById('chatMessagesContainer');
  if (!messagesContainer) return;

  // ব্যবহারকারীর বার্তা
  const userMsg = document.createElement('div');
  userMsg.className = 'flex justify-end';
  userMsg.innerHTML = `
    <div class="bg-emerald-600 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
      ${text}
    </div>
  `;
  messagesContainer.appendChild(userMsg);
  if (input) input.value = '';

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // স্বয়ংক্রিয় উত্তর
  setTimeout(() => {
    let reply = "ধন্যবাদ আসবিমার্টে যোগাযোগ করার জন্য! আমাদের কাস্টমার প্রতিনিধি খুব শীঘ্রই আপনার বার্তার উত্তর দেবেন। জরুরি প্রয়োজনে কল করুন: 01821-296056।";
    if (text.includes("অর্ডার") || text.includes("ট্র্যাক")) {
      reply = "আপনার অর্ডার নম্বরটি আমাদের মেসেজে দিলে আমরা সাথে সাথে বর্তমান ডেলিভারি স্ট্যাটাস জানিয়ে দিচ্ছি।";
    } else if (text.includes("মধু") || text.includes("খাঁটি")) {
      reply = "আসবিমার্টের প্রতিটি পণ্য শতভাগ ল্যাব টেস্টে উত্তীর্ণ এবং প্রাকৃতিক। সুন্দরবনের অপরিশোধিত কাঁচা মধুতে কোনো চিনি বা ভেজাল মেশানো হয় না।";
    } else if (text.includes("ডেলিভারি")) {
      reply = "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ঢাকার বাইরে সারাদেশে ১২০ টাকা। প্রথম অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি!";
    }

    const botMsg = document.createElement('div');
    botMsg.className = 'flex justify-start';
    botMsg.innerHTML = `
      <div class="bg-slate-100 text-slate-800 text-xs px-3 py-2 rounded-2xl rounded-tl-none max-w-[80%] border border-slate-200">
        ${reply}
      </div>
    `;
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 700);
}

// টোস্ট
function showToast(message) {
  const toast = document.getElementById('asbiToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

// ==========================================
// হেডার ও অথেনটিকেশন ফাংশনালিটি (Sign In, Profile, Track Order, Wishlist, More)
// ==========================================

// থ্রি-ডট মোর মেনু টগল (ক্লিক ও বাইরে ক্লিক করলে বন্ধ)
function toggleMoreMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  const menu = document.getElementById('moreDropdownMenu');
  const btn = document.getElementById('moreMenuBtn');
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function closeMoreMenu() {
  const menu = document.getElementById('moreDropdownMenu');
  const btn = document.getElementById('moreMenuBtn');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
  }
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// মোর মেনুর বাইরে ক্লিক করলে স্বয়ংক্রিয়ভাবে বন্ধ হবে
document.addEventListener('click', (e) => {
  const container = document.getElementById('moreMenuContainer');
  if (container && !container.contains(e.target)) {
    closeMoreMenu();
  }
});

function quickOrder(productId) {
  quickOrderNow(productId);
}

// ১. সাইন ইন ও সাইন আপ মোডাল
function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    switchAuthTab('login');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');
  const tabLogin = document.getElementById('authTabLogin');
  const tabReg = document.getElementById('authTabRegister');

  if (tab === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (regForm) regForm.classList.add('hidden');
    if (tabLogin) tabLogin.className = 'py-2 text-xs font-bold rounded-xl transition-all bg-white text-[#1E3A8A] shadow-sm';
    if (tabReg) tabReg.className = 'py-2 text-xs font-bold rounded-xl transition-all text-white hover:bg-white/10';
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (regForm) regForm.classList.remove('hidden');
    if (tabReg) tabReg.className = 'py-2 text-xs font-bold rounded-xl transition-all bg-white text-emerald-700 shadow-sm';
    if (tabLogin) tabLogin.className = 'py-2 text-xs font-bold rounded-xl transition-all text-white hover:bg-white/10';
  }
}

function handleUserLogin(e) {
  if (e) e.preventDefault();
  const identifier = document.getElementById('loginIdentifier')?.value.trim() || 'আসবি মাহমুদ';
  
  let savedUser = null;
  try {
    savedUser = JSON.parse(localStorage.getItem('asbi_auth_user'));
  } catch (err) {}

  const user = {
    name: savedUser && savedUser.name ? savedUser.name : (identifier.includes('@') ? identifier.split('@')[0] : 'আসবি মাহমুদ'),
    phone: identifier.includes('@') ? '01700000000' : identifier,
    email: identifier.includes('@') ? identifier : 'asbi@asbimart.com',
    location: savedUser && savedUser.location ? savedUser.location : 'ঢাকা (Dhaka)',
    address: savedUser && savedUser.address ? savedUser.address : 'বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা',
    avatar: savedUser && savedUser.avatar ? savedUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('asbi_auth_user', JSON.stringify(user));
  closeAuthModal();
  updateAuthUI();
  showToast(`স্বাগতম ${user.name}! আপনি সফলভাবে লগইন করেছেন।`);
}

function handleUserRegister(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('regName')?.value.trim() || 'আসবি মাহমুদ';
  const phone = document.getElementById('regPhone')?.value.trim() || '01700000000';
  const email = document.getElementById('regEmail')?.value.trim() || 'asbi@asbimart.com';

  const newUser = {
    name: name,
    phone: phone,
    email: email,
    location: 'ঢাকা (Dhaka)',
    address: 'বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('asbi_auth_user', JSON.stringify(newUser));
  closeAuthModal();
  updateAuthUI();
  showToast(`অভিনন্দন ${name}! আসবিমার্টে আপনার অ্যাকাউন্ট তৈরি হয়েছে।`);
}

function socialLogin(provider) {
  const key = String(provider || '').toLowerCase();
  if (key === 'google') {
    window.location.href = '/api/auth/google?returnTo=index.html';
    return;
  }
  if (key === 'facebook') {
    window.location.href = '/api/auth/facebook?returnTo=index.html';
    return;
  }
  window.location.href = 'login.html';
}

function handleUserLogout() {
  localStorage.removeItem('asbi_auth_token');
  localStorage.removeItem('asbi_auth_user');
  closeProfileModal();
  updateAuthUI();
  showToast('আপনি সফলভাবে লগআউট করেছেন।');
}

function updateAuthUI() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('asbi_auth_user'));
  } catch (err) {}

  const signInBtn = document.getElementById('headerSignInBtn');
  const profileBtn = document.getElementById('headerProfileBtn');
  const userNameEl = document.getElementById('headerUserName');
  const userAvatarEl = document.getElementById('headerUserAvatar');
  const logoutContainer = document.getElementById('moreMenuLogoutContainer');
  const moreProfileSubtext = document.getElementById('moreMenuProfileSubtext');

  if (user && user.loggedIn) {
    if (signInBtn) signInBtn.classList.add('hidden');
    if (profileBtn) profileBtn.classList.remove('hidden');
    if (userNameEl) userNameEl.textContent = user.name.split(' ')[0] || 'আসবি';
    if (userAvatarEl && user.avatar) {
      userAvatarEl.src = user.avatar;
      userAvatarEl.classList.remove('hidden');
    }
    if (logoutContainer) logoutContainer.classList.remove('hidden');
    if (moreProfileSubtext) moreProfileSubtext.textContent = user.name;
  } else {
    if (signInBtn) signInBtn.classList.remove('hidden');
    if (profileBtn) profileBtn.classList.add('hidden');
    if (logoutContainer) logoutContainer.classList.add('hidden');
    if (moreProfileSubtext) moreProfileSubtext.textContent = 'গ্রাহক তথ্য ও লোকেশন';
  }
}

// ২. প্রোফাইল মোডাল
function openProfileModal() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('asbi_auth_user'));
  } catch (err) {}

  if (!user || !user.loggedIn) {
    openAuthModal();
    return;
  }

  const nameEl = document.getElementById('profileModalName');
  const phoneEl = document.getElementById('profileModalPhone');
  const emailEl = document.getElementById('profileModalEmail');
  const cityEl = document.getElementById('profileModalCity');
  const addressEl = document.getElementById('profileModalAddress');
  const avatarEl = document.getElementById('profileModalAvatarImg');
  const wishlistCountEl = document.getElementById('profileModalWishlistCount');

  if (nameEl) nameEl.textContent = user.name;
  if (phoneEl) phoneEl.textContent = user.phone;
  if (emailEl) emailEl.textContent = user.email;
  if (cityEl) cityEl.textContent = user.location || 'ঢাকা (Dhaka)';
  if (addressEl) addressEl.textContent = user.address || 'ধানমন্ডি, ঢাকা';
  if (avatarEl && user.avatar) avatarEl.src = user.avatar;
  if (wishlistCountEl) wishlistCountEl.textContent = String(wishlist.length);

  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('hidden');
}

// ৩. ট্র্যাক অর্ডার মোডাল
function openTrackOrderModal() {
  const modal = document.getElementById('trackOrderModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderTrackOrders();
  }
}

function closeTrackOrderModal() {
  const modal = document.getElementById('trackOrderModal');
  if (modal) modal.classList.add('hidden');
}

function renderTrackOrders(filterId = '') {
  const container = document.getElementById('trackOrdersListContainer');
  if (!container) return;

  const orders = [
    {
      id: 'ASBI-984210',
      items: 'সুন্দরবনের চাকভাঙা কাঁচা মধু (১ কেজি)',
      date: '১৭ নভেম্বর ২০২৬, দুপুর ২:১৫',
      total: 1250,
      status: 'ডেলিভারির পথে (Out for Delivery)',
      statusStep: 3,
      courier: 'রেডএক্স (RedX Express) • ট্র্যাকিং: RDX-88910',
      eta: 'আজ সন্ধ্যা ৭টার মধ্যে'
    },
    {
      id: 'ASBI-781423',
      items: 'পাবনার খাঁটি দানাদার গাওয়া ঘি (১ কেজি)',
      date: '১৫ নভেম্বর ২০২৬',
      total: 1550,
      status: 'সফলভাবে ডেলিভারড (Delivered)',
      statusStep: 4,
      courier: 'সুন্দরবন কুরিয়ার',
      eta: 'ডেলিভারি সম্পন্ন'
    }
  ];

  const matched = filterId 
    ? orders.filter(o => o.id.toLowerCase().includes(filterId.toLowerCase())) 
    : orders;

  if (matched.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
        <p class="text-xs text-slate-500 font-bangla">এই অর্ডার আইডিতে কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক আইডি লিখুন।</p>
      </div>
    `;
    return;
  }

  container.innerHTML = matched.map(order => `
    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-black text-blue-900 font-brand">#${order.id}</span>
          <p class="text-[11px] text-slate-500">${order.date}</p>
        </div>
        <span class="px-2.5 py-1 text-[11px] font-bold rounded-full ${order.statusStep === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
          ${order.status}
        </span>
      </div>

      <div class="text-xs text-slate-700">
        <p class="font-bold">${order.items}</p>
        <p class="text-[11px] text-slate-500 mt-0.5">মোট বিল: <span class="font-bold text-emerald-700 font-brand">৳${order.total}</span> (ক্যাশ অন ডেলিভারি)</p>
      </div>

      <!-- প্রোগ্রেস বার -->
      <div class="space-y-1.5 pt-1">
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full" style="width: ${order.statusStep === 4 ? '100%' : '75%'}"></div>
        </div>
        <div class="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>অর্ডার গৃহীত</span>
          <span>প্যাকিং সম্পন্ন</span>
          <span class="${order.statusStep >= 3 ? 'text-blue-900 font-bold' : ''}">ডেলিভারির পথে</span>
          <span class="${order.statusStep === 4 ? 'text-emerald-700 font-bold' : ''}">ডেলিভারড</span>
        </div>
      </div>

      <div class="text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 flex justify-between items-center">
        <span>🚚 কুরিয়ার: ${order.courier}</span>
        <span class="font-bold text-blue-900">${order.eta}</span>
      </div>
    </div>
  `).join('');
}

function searchTrackOrder() {
  const input = document.getElementById('trackOrderIdInput');
  const val = input ? input.value.trim() : '';
  renderTrackOrders(val);
}

// ৪. উইশলিস্ট মোডাল
function openWishlistModal() {
  const modal = document.getElementById('wishlistModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderWishlistModal();
  }
}

function closeWishlistModal() {
  const modal = document.getElementById('wishlistModal');
  if (modal) modal.classList.add('hidden');
}

function clearAllWishlist() {
  wishlist = [];
  localStorage.setItem('asbi_wishlist', JSON.stringify(wishlist));
  updateBadges();
  renderWishlistModal();
  showToast('উইশলিস্ট খালি করা হয়েছে।');
}

function renderWishlistModal() {
  const container = document.getElementById('wishlistItemsContainer');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 space-y-3">
        <div class="w-14 h-14 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl">❤️</div>
        <p class="text-xs font-bold text-slate-700">আপনার উইশলিস্ট বর্তমানে খালি!</p>
        <p class="text-[11px] text-slate-400">পছন্দের পণ্যের হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন।</p>
      </div>
    `;
    return;
  }

  const items = wishlist.map(id => PRODUCTS_DATA.find(p => p.id === id)).filter(Boolean);
  container.innerHTML = items.map(product => `
    <div class="flex items-center gap-3.5 py-3">
      <img src="${product.image}" class="w-16 h-16 rounded-xl object-cover border border-slate-200">
      <div class="flex-grow min-w-0">
        <h4 class="text-xs font-bold text-slate-800 truncate">${product.banglaName}</h4>
        <p class="text-[11px] text-emerald-700 font-black font-brand">৳${product.variants[0]?.price || 0}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="addToCart('${product.id}', 0); showToast('${product.banglaName} কার্ট-এ যোগ হয়েছে!');" class="py-1.5 px-3 bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all">
          কার্টে যোগ
        </button>
        <button onclick="toggleWishlist('${product.id}'); renderWishlistModal();" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors" title="Remove">
          ✕
        </button>
      </div>
    </div>
  `).join('');
}

// ৫. মোর মেনুর তথ্যভিত্তিক মোডালসমূহ
function openContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) modal.classList.remove('hidden');
}
function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) modal.classList.add('hidden');
}

function openAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) modal.classList.remove('hidden');
}
function closeAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) modal.classList.add('hidden');
}

function openFaqModal() {
  const modal = document.getElementById('faqModal');
  if (modal) modal.classList.remove('hidden');
}
function closeFaqModal() {
  const modal = document.getElementById('faqModal');
  if (modal) modal.classList.add('hidden');
}

function openReturnPolicyModal() {
  const modal = document.getElementById('returnPolicyModal');
  if (modal) modal.classList.remove('hidden');
}
function closeReturnPolicyModal() {
  const modal = document.getElementById('returnPolicyModal');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// মোবাইল বটম নেভিগেশন বার (Home | Profile | Search)
// ==========================================
function syncMobileBottomProfile() {
  const link = document.getElementById('mobileNavProfileLink');
  const iconWrap = document.getElementById('mobileNavProfileIcon');
  const label = document.getElementById('mobileNavProfileLabel');
  if (!link || !iconWrap) return;

  let user = null;
  try { user = JSON.parse(localStorage.getItem('asbi_auth_user')); } catch (e) {}

  if (user && user.loggedIn) {
    link.href = 'profile.html';
    if (user.avatar) {
      iconWrap.innerHTML = `<img src="${user.avatar}" alt="Profile" class="w-5 h-5 rounded-full object-cover ring-1.5 ring-emerald-500">`;
    }
    if (label) label.textContent = (user.name || 'Profile').split(' ')[0];
  } else {
    link.href = 'login.html';
    if (label) label.textContent = 'Profile';
  }
}

function initMobileBottomNav() {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;

  const updateVisibility = () => {
    if (window.scrollY > 100) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
  syncMobileBottomProfile();
}

function scrollToHomeTop() {
  if (isOnCategoryPage()) {
    window.location.href = 'index.html';
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMobileSearchFromBar() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    const mobInput = document.getElementById('mobileSearchInput');
    const mainInput = document.getElementById('mainSearchInput');
    const target = (mobInput && mobInput.offsetParent !== null) ? mobInput : mainInput;
    if (target) {
      target.focus();
      target.select();
    }
  }, 350);
}

// ==========================================
// মোবাইল ভিউ নেভিগেশন বার অ্যারো স্ক্রলিং (❮ / ❯)
// ==========================================
function updateMainNavArrows() {
  const track = document.getElementById('mainNavScrollTrack');
  const prevBtn = document.getElementById('mobileNavPrevBtn');
  const nextBtn = document.getElementById('mobileNavNextBtn');
  if (!track || !prevBtn || !nextBtn) return;

  const canScroll = track.scrollWidth > track.clientWidth + 4;
  if (!canScroll) {
    prevBtn.style.opacity = '0.35';
    nextBtn.style.opacity = '0.35';
    return;
  }

  const atStart = track.scrollLeft <= 2;
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  prevBtn.style.opacity = atStart ? '0.4' : '1';
  nextBtn.style.opacity = atEnd ? '0.4' : '1';
}

function scrollMainNav(direction) {
  const track = document.getElementById('mainNavScrollTrack');
  if (!track) return;
  const step = Math.max(150, Math.round(track.clientWidth * 0.65));
  track.scrollBy({ left: direction * step, behavior: 'smooth' });
  setTimeout(updateMainNavArrows, 320);
}

function initMainNavScrollArrows() {
  const track = document.getElementById('mainNavScrollTrack');
  if (!track) return;
  track.addEventListener('scroll', updateMainNavArrows, { passive: true });
  window.addEventListener('resize', updateMainNavArrows);
  updateMainNavArrows();
}

// ইনিশিয়ালাইজেশন
document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  renderFeaturedCategories();
  renderTopProductsGrid();
  renderProductGrid();
  initCategoryPage();
  updateBadges();
  updateAuthUI();
  syncCartFromServer();
  checkPaymentCallbackReturn();
  initMobileBottomNav();
  initMainNavScrollArrows();

  // মোডাল ব্যাকড্রপ ক্লিক এবং এস্কেপ (Esc) কি দিয়ে বন্ধ করা
  const detailModal = document.getElementById('productDetailModal');
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeProductDetailPage();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMoreMenu();
      closeSearchSuggestions();
      closeProductDetailPage();
      closeCartDrawer();
      closeCheckoutModal();
      closeAuthModal();
      closeProfileModal();
      closeTrackOrderModal();
      closeWishlistModal();
      closeContactModal();
      closeAboutModal();
      closeFaqModal();
      closeReturnPolicyModal();
    }
  });
});
