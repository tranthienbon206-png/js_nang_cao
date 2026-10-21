import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

// Lưu listener / timer ở ngoài class để lần sau vào trang chủ còn gỡ được cái cũ
let cartClickListener = null;
let heroTimer = null;

// Icon cho từng danh mục (theo id trong db.json)
const CATEGORY_ICONS = {
  1: '🖥️', 2: '💻', 3: '🔧', 4: '🧠', 5: '🧩',
  6: '🎮', 7: '💾', 8: '💽', 9: '🔌', 10: '🖵', 11: '🎧',
};

// Thanh tiêu đề mỗi mục: tên mục + chip lọc + "Xem tất cả"
function sectionHeader(title, tag, chips, categoryId) {
  const chipsHtml = chips.map(c =>
    `<a href="#/products?category=${categoryId}"
        class="text-xs md:text-sm text-slate-600 hover:text-red-600 font-medium">${c}</a>`
  ).join('');

  return `
    <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
      <div class="flex items-center gap-3">
        <h2 class="text-lg md:text-xl font-extrabold text-slate-800">${title}</h2>
        <span class="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-red-600">
          <span>🚩</span>${tag}
        </span>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-4">${chipsHtml}</div>
        <a href="#/products?category=${categoryId}"
           class="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap">Xem tất cả ›</a>
      </div>
    </div>`;
}

// Banner nhỏ dùng chung
function miniBanner(icon, title, sub, gradient) {
  return `
    <a href="#/products"
       class="flex items-center gap-3 rounded-xl p-4 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition ${gradient}">
      <span class="text-3xl">${icon}</span>
      <span>
        <span class="block text-sm font-extrabold leading-tight">${title}</span>
        <span class="block text-xs opacity-90">${sub}</span>
      </span>
    </a>`;
}

export default class HomeView extends BaseView {
  renderLayout(categories) {
    const mainCategories = categories.filter(c => !c.parentId);

    // Menu trái: mục nào có danh mục con thì hiện menu con khi rê chuột
    const menuHtml = mainCategories.map(c => {
      const children = categories.filter(x => Number(x.parentId) === Number(c.id));
      const childHtml = children.length ? `
        <div class="hidden group-hover:block absolute left-full top-0 ml-1 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-30">
          ${children.map(ch => `
            <a href="#/products?category=${ch.id}"
               class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600">
              <span>${CATEGORY_ICONS[ch.id] || '📦'}</span>${escapeHtml(ch.name)}
            </a>`).join('')}
        </div>` : '';

      return `
        <div class="group relative">
          <a href="#/products?category=${c.id}"
             class="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition">
            <span class="flex items-center gap-3 truncate">
              <span class="text-base">${CATEGORY_ICONS[c.id] || '📦'}</span>
              <span class="truncate">${escapeHtml(c.name)}</span>
            </span>
            <span class="text-slate-300 group-hover:text-red-500">›</span>
          </a>
          ${childHtml}
        </div>`;
    }).join('');

    this.setHTML(`
      <div class="bg-slate-100 pb-10">

        <!-- 1. HERO: menu - slider - banner phải -->
        <section class="max-w-7xl mx-auto px-4 pt-4 grid grid-cols-1 lg:grid-cols-[230px_1fr_260px] gap-3">

          <nav class="hidden lg:block bg-white rounded-xl py-2 shadow-sm border border-slate-100 self-start">
            ${menuHtml}
          </nav>

          <!-- Slider -->
          <div class="relative rounded-xl overflow-hidden shadow-sm min-h-[260px] md:min-h-[330px]" id="hero-slider">
            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-100 p-8 md:p-10 flex flex-col justify-center text-white bg-gradient-to-br from-slate-900 via-red-900 to-red-600">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase">🔥 Khuyến mãi tháng 10</span>
              <h1 class="text-3xl md:text-5xl font-extrabold mt-4 leading-tight">Build PC Gaming<br><span class="text-yellow-300">Tặng màn hình 240Hz</span></h1>
              <p class="mt-3 text-sm text-red-100">Linh kiện chính hãng, lắp ráp và kiểm thử miễn phí.</p>
              <a href="#/products?category=1" class="mt-5 w-fit bg-white text-red-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-red-50 transition">Xem ngay</a>
            </div>

            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 p-8 md:p-10 flex flex-col justify-center text-white bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase">💻 Laptop Gaming</span>
              <h2 class="text-3xl md:text-5xl font-extrabold mt-4 leading-tight">Laptop Gaming<br><span class="text-yellow-300">Giảm đến 26%</span></h2>
              <p class="mt-3 text-sm text-blue-100">RTX 40 Series, màn hình 144Hz, bảo hành 24 tháng.</p>
              <a href="#/products?category=2" class="mt-5 w-fit bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition">Mua ngay</a>
            </div>

            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 p-8 md:p-10 flex flex-col justify-center text-white bg-gradient-to-br from-violet-900 via-purple-700 to-pink-500">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase">🖵 Màn hình</span>
              <h2 class="text-3xl md:text-5xl font-extrabold mt-4 leading-tight">Màn hình 165Hz<br><span class="text-yellow-300">Giảm sốc đến 53%</span></h2>
              <p class="mt-3 text-sm text-purple-100">Chính hãng, bảo hành 36 tháng.</p>
              <a href="#/products?category=10" class="mt-5 w-fit bg-white text-purple-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-purple-50 transition">Xem màn hình</a>
            </div>

            <button type="button" id="hero-prev" class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow">‹</button>
            <button type="button" id="hero-next" class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow">›</button>
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2" id="hero-dots">
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white"></span>
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white/50"></span>
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white/50"></span>
            </div>
          </div>

          <!-- Banner phải -->
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <a href="#/products?category=1" class="rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
              <div class="text-xs opacity-90">Build PC</div>
              <div class="text-xl font-extrabold leading-tight">Tặng màn hình 240Hz</div>
              <div class="text-xs mt-1">Giá chỉ từ 18.990.000đ</div>
            </a>
            <a href="#/products?category=2" class="rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
              <div class="text-xs opacity-90">Laptop Gaming</div>
              <div class="text-xl font-extrabold leading-tight">Giảm đến 26%</div>
              <div class="text-xs mt-1">Tặng balo + chuột</div>
            </a>
            <a href="#/products?category=3" class="hidden lg:block rounded-xl bg-gradient-to-br from-amber-500 to-red-500 text-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
              <div class="text-xs opacity-90">Linh kiện PC</div>
              <div class="text-xl font-extrabold leading-tight">CPU - VGA - RAM</div>
              <div class="text-xs mt-1">Chính hãng, trả góp 0%</div>
            </a>
          </div>
        </section>

        <!-- 2. DẢI 4 BANNER NHỎ -->
        <section class="max-w-7xl mx-auto px-4 pt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
          ${miniBanner('🎧', 'Gaming Gear', 'Giảm đến 40%', 'bg-gradient-to-r from-indigo-600 to-blue-500')}
          ${miniBanner('🖵', 'Monitor', 'Giảm đến 51%', 'bg-gradient-to-r from-slate-700 to-slate-500')}
          ${miniBanner('🖱️', 'Gaming Mouse', 'Chỉ từ 80.000đ', 'bg-gradient-to-r from-orange-500 to-amber-400')}
          ${miniBanner('🖥️', 'PC RTX 5090', 'Gaming - OLED', 'bg-gradient-to-r from-red-700 to-red-500')}
        </section>

        <!-- 3. 2 BANNER RỘNG -->
        <section class="max-w-7xl mx-auto px-4 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="#/products?category=1" class="rounded-xl p-6 text-white bg-gradient-to-r from-blue-700 to-sky-400 shadow-sm hover:shadow-lg transition">
            <div class="text-2xl font-extrabold">Build PC Tặng Màn Hình</div>
            <div class="text-sm mt-1">Giá chỉ từ <b class="text-yellow-300">11.990.000đ</b></div>
          </a>
          <a href="#/products?category=2" class="rounded-xl p-6 text-white bg-gradient-to-r from-purple-700 to-pink-500 shadow-sm hover:shadow-lg transition">
            <div class="text-2xl font-extrabold">Pack Laptop Tặng Gear</div>
            <div class="text-sm mt-1">Quà tặng lên đến <b class="text-yellow-300">15.000.000đ</b></div>
          </a>
        </section>

        <!-- 4. PC BÁN CHẠY -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            ${sectionHeader('PC bán chạy', 'Tặng màn hình 240Hz', ['PC i3', 'PC i5', 'PC i7', 'PC R5', 'PC R7'], 1)}
            <div id="pc-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"></div>
          </div>
        </section>

        <!-- 5. LAPTOP (có banner đứng bên trái) -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            ${sectionHeader('Laptop gaming bán chạy', 'Tặng combo gear đến 15 triệu', ['ASUS', 'ACER', 'MSI', 'LENOVO', 'DELL'], 2)}
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <a href="#/products?category=2"
                 class="hidden lg:flex flex-col justify-end rounded-xl p-5 text-white bg-gradient-to-b from-slate-800 via-blue-900 to-blue-600 hover:shadow-lg transition">
                <div class="text-4xl mb-2">💻</div>
                <div class="text-xl font-extrabold leading-tight">Laptop Gaming</div>
                <div class="text-sm mt-1 text-blue-100">Giảm đến 26%</div>
                <div class="mt-3 w-fit bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg">Xem ngay</div>
              </a>
              <div id="laptop-list" class="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3"></div>
            </div>
          </div>
        </section>

        <!-- 6. LINH KIỆN -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            ${sectionHeader('Linh kiện máy tính', 'Chính hãng - bảo hành đến 60 tháng', ['CPU', 'VGA', 'RAM', 'SSD', 'PSU'], 3)}
            <div id="parts-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"></div>
          </div>
        </section>

        <!-- 7. MÀN HÌNH -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            ${sectionHeader('Màn hình chính hãng', 'Bảo hành 1 đổi 1', ['ASUS', 'LG', 'DELL', 'GIGABYTE', 'AOC'], 10)}
            <div id="monitor-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"></div>
          </div>
        </section>

        <!-- 8. GAMING GEAR -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="bg-white rounded-xl p-4 shadow-sm">
            ${sectionHeader('Gaming Gear bán chạy', 'Giao hàng toàn quốc', ['Logitech', 'Razer', 'Asus', 'Corsair'], 11)}
            <div id="gear-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"></div>
          </div>
        </section>

        <!-- 9. BANNER TIN TỨC -->
        <section class="max-w-7xl mx-auto px-4 mt-6">
          <div class="rounded-xl p-8 md:p-10 flex flex-wrap items-center justify-between gap-4 text-white bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 shadow-sm">
            <div class="text-2xl md:text-3xl font-extrabold leading-snug">Cập nhật tin tức công nghệ<br>mới nhất cùng GearZone</div>
            <a href="#/about" class="border border-white/60 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition">Xem tất cả →</a>
          </div>
        </section>

      </div>
    `);
  }

  // Chạy slider tự chuyển slide mỗi 4 giây
  bindHero() {
    if (heroTimer) clearInterval(heroTimer);

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    let current = 0;

    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('opacity-100', i === current);
        s.classList.toggle('opacity-0', i !== current);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('bg-white', i === current);
        d.classList.toggle('bg-white/50', i !== current);
      });
    };

    const start = () => { heroTimer = setInterval(() => show(current + 1), 4000); };
    const restart = () => { clearInterval(heroTimer); start(); };

    document.getElementById('hero-prev')?.addEventListener('click', () => { show(current - 1); restart(); });
    document.getElementById('hero-next')?.addEventListener('click', () => { show(current + 1); restart(); });

    start();
  }

  renderProductsGroup(containerId, products) {
    const container = this['$']('#' + containerId);
    if (!container) return;

    if (!products || !products.length) {
      container.innerHTML = '<p class="col-span-full text-center text-slate-400 py-6">Đang cập nhật sản phẩm...</p>';
      return;
    }

    container.innerHTML = products.map(p => {
      const discountPercent = p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

      // Chip thông số: chỉ lấy giá trị chữ/số, bỏ true/false
      const specChips = p.specs
        ? Object.values(p.specs)
          .filter(v => typeof v === 'string' || typeof v === 'number')
          .slice(0, 4)
          .map(v => `<span class="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded truncate max-w-full">${escapeHtml(String(v))}</span>`)
          .join('')
        : '';

      const badgeHtml = discountPercent > 0
        ? `<span class="absolute top-2 left-2 z-10 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">Giảm ${discountPercent}%</span>`
        : '';

      const hotHtml = (p.sold && p.sold >= 30)
        ? '<span class="inline-block bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">🔥 HOÁ TỐC</span>'
        : '';

      const oldPriceHtml = p.originalPrice
        ? `<span class="text-xs text-slate-400 line-through">${formatPrice(p.originalPrice)}</span>
           <span class="text-[11px] text-red-500 font-semibold">-${discountPercent}%</span>`
        : '';

      const promoText = p.price >= 2000000 ? '🎁 Miễn phí giao hàng toàn quốc' : '🎁 Mua kèm giá ưu đãi';

      return `
        <div class="group flex flex-col justify-between h-full bg-white rounded-xl p-3 border border-slate-200
                    hover:shadow-xl hover:border-red-300 hover:-translate-y-0.5 transition duration-300">
          <div>
            <div class="relative w-full h-40 flex items-center justify-center mb-2">
              ${badgeHtml}
              <a href="#/product/${p.id}" class="w-full h-full flex items-center justify-center">
                <img src="${p.image}" alt="${escapeHtml(p.name)}"
                     class="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-300"
                     onerror="this.style.display='none'">
              </a>
            </div>

            ${hotHtml}
            <a href="#/product/${p.id}" class="no-underline">
              <h3 class="text-[13px] font-semibold text-slate-800 leading-snug h-9 overflow-hidden group-hover:text-red-600 transition"
                  title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h3>
            </a>

            <div class="flex flex-wrap gap-1 mt-2 min-h-[22px]">${specChips}</div>
          </div>

          <div class="mt-3">
            <div class="flex items-center gap-2 h-4">${oldPriceHtml}</div>
            <div class="text-base font-extrabold text-red-600">${formatPrice(p.price)}</div>

            <div class="mt-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 truncate">
              ${promoText}
            </div>

            <button class="btn-buy mt-2 w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold
                           text-xs py-2 rounded-lg transition cursor-pointer"
                    data-add="${p.id}">
              🛒 Thêm vào giỏ
            </button>
          </div>
        </div>`;
    }).join('');
  }

  bindAddToCart(handler) {
    // Gỡ listener của lần vào trang chủ trước để không bị chạy trùng
    if (cartClickListener) {
      document.removeEventListener('click', cartClickListener);
    }

    cartClickListener = e => {
      const btn = e.target.closest('[data-add]');
      if (btn) {
        const id = btn.dataset.add;
        if (id) handler(Number(id));
      }
    };

    document.addEventListener('click', cartClickListener);
  }
}