import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

// Sửa xung đột Tailwind và Bootstrap: Tailwind có class .collapse { visibility: collapse }
// làm ẩn menu header của Bootstrap. Ghi đè lại để header luôn hiện.
if (!document.getElementById('fix-bootstrap-collapse')) {
  const fix = document.createElement('style');
  fix.id = 'fix-bootstrap-collapse';
  fix.textContent = '.navbar-collapse { visibility: visible !important; }';
  document.head.appendChild(fix);
}

// Lưu listener / timer ở ngoài class để lần sau vào trang chủ còn gỡ được cái cũ
let cartClickListener = null;
let heroTimer = null;

// Tiêu đề mỗi mục: thanh xanh bên trái + "Xem tất cả"
function sectionHeader(title, subtitle, link) {
  return `
    <div class="flex items-end justify-between gap-3 mb-4">
      <div class="border-l-4 border-blue-600 pl-3">
        <h2 class="text-xl md:text-2xl font-extrabold text-slate-800 m-0">${title}</h2>
        <p class="text-sm text-slate-500 m-0">${subtitle}</p>
      </div>
      <a href="${link}" class="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap no-underline">Xem tất cả</a>
    </div>`;
}

export default class HomeView extends BaseView {
  renderLayout(categories) {
    const topCategories = categories
      .filter(c => !c.parentId && c.active !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    this.setHTML(`
      <div class="bg-slate-50 pb-12">

        <!-- 1. HERO -->
        <section class="max-w-7xl mx-auto px-4 pt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div class="relative lg:col-span-2 rounded-2xl overflow-hidden h-[280px] md:h-[360px] shadow-sm">
            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-100 px-8 md:px-14 flex flex-col justify-center text-white bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Khuyến mãi tháng 10</span>
              <h1 class="text-3xl md:text-5xl font-extrabold mt-4 mb-0 leading-tight">Build PC Gaming<br><span class="text-yellow-300">Tặng màn hình 240Hz</span></h1>
              <p class="mt-3 mb-0 text-sm md:text-base text-blue-100">Linh kiện chính hãng, lắp ráp và kiểm thử miễn phí.</p>
              <a href="#/category/1" class="mt-6 w-fit bg-white text-blue-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 no-underline transition">Xem ngay</a>
            </div>

            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 px-8 md:px-14 flex flex-col justify-center text-white bg-gradient-to-br from-indigo-900 via-indigo-700 to-sky-500">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Laptop Gaming</span>
              <h2 class="text-3xl md:text-5xl font-extrabold mt-4 mb-0 leading-tight">Laptop Gaming<br><span class="text-yellow-300">Giảm đến 26%</span></h2>
              <p class="mt-3 mb-0 text-sm md:text-base text-blue-100">RTX 40 Series, màn hình 144Hz, bảo hành 24 tháng.</p>
              <a href="#/category/2" class="mt-6 w-fit bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 no-underline transition">Mua ngay</a>
            </div>

            <div class="hero-slide absolute inset-0 transition-opacity duration-700 opacity-0 px-8 md:px-14 flex flex-col justify-center text-white bg-gradient-to-br from-slate-800 via-slate-700 to-cyan-600">
              <span class="w-fit bg-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Màn hình</span>
              <h2 class="text-3xl md:text-5xl font-extrabold mt-4 mb-0 leading-tight">Màn hình 165Hz<br><span class="text-yellow-300">Giá tốt mỗi ngày</span></h2>
              <p class="mt-3 mb-0 text-sm md:text-base text-slate-200">Chính hãng, bảo hành 36 tháng.</p>
              <a href="#/category/10" class="mt-6 w-fit bg-white text-slate-800 font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-100 no-underline transition">Xem màn hình</a>
            </div>

            <button type="button" id="hero-prev" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 font-bold shadow">&lt;</button>
            <button type="button" id="hero-next" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 font-bold shadow">&gt;</button>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white"></span>
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white/50"></span>
              <span class="hero-dot w-2.5 h-2.5 rounded-full bg-white/50"></span>
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4">
            <a href="#/category/1" class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white p-6 shadow-sm hover:shadow-lg transition no-underline">
              <span class="text-xs uppercase tracking-wide text-blue-100">Build PC</span>
              <span class="text-xl md:text-2xl font-extrabold leading-tight mt-1">Chỉ từ 18.990.000đ</span>
              <span class="text-xs text-blue-100 mt-1">Bảo hành 24 tháng</span>
            </a>
            <a href="#/category/3" class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white p-6 shadow-sm hover:shadow-lg transition no-underline">
              <span class="text-xs uppercase tracking-wide text-slate-300">Linh kiện PC</span>
              <span class="text-xl md:text-2xl font-extrabold leading-tight mt-1">CPU - VGA - RAM</span>
              <span class="text-xs text-slate-300 mt-1">Chính hãng, trả góp 0%</span>
            </a>
          </div>
        </section>

        <!-- 2. CHÍNH SÁCH -->
        <section class="max-w-7xl mx-auto px-4 mt-5">
          <div class="bg-white border border-slate-200 rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            <div class="p-4"><b class="block text-sm text-slate-800">Chính hãng 100%</b><span class="text-xs text-slate-500">Đầy đủ hóa đơn</span></div>
            <div class="p-4"><b class="block text-sm text-slate-800">Giao hàng toàn quốc</b><span class="text-xs text-slate-500">Miễn phí từ 5.000.000đ</span></div>
            <div class="p-4"><b class="block text-sm text-slate-800">Bảo hành dài hạn</b><span class="text-xs text-slate-500">Đến 60 tháng</span></div>
            <div class="p-4"><b class="block text-sm text-slate-800">Hỗ trợ 1900 1234</b><span class="text-xs text-slate-500">Tư vấn miễn phí</span></div>
          </div>
        </section>

        <!-- 3. DANH MỤC (ảnh lấy từ db.json) -->
        <section class="max-w-7xl mx-auto px-4 mt-8">
          ${sectionHeader('Danh mục sản phẩm', 'Chọn nhóm sản phẩm bạn quan tâm', '#/products')}
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            ${topCategories.map(c => `
              <a href="#/category/${c.id}" class="group relative block h-28 md:h-36 rounded-xl overflow-hidden bg-slate-300 no-underline">
                <img src="${c.image}" alt="${escapeHtml(c.name)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.style.display='none'">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-3">
                  <span class="text-white font-semibold text-sm">${escapeHtml(c.name)}</span>
                </div>
              </a>`).join('')}
          </div>
        </section>

        <!-- 4. PC & LAPTOP -->
        <section class="max-w-7xl mx-auto px-4 mt-10">
          ${sectionHeader('PC và Laptop', 'Máy tính dựng sẵn và laptop chính hãng', '#/category/1')}
          <div id="pc-laptop-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"></div>
        </section>

        <!-- 5. LINH KIỆN -->
        <section class="max-w-7xl mx-auto px-4 mt-10">
          ${sectionHeader('Linh kiện máy tính', 'CPU, mainboard, VGA, RAM, SSD, nguồn', '#/category/3')}
          <div id="parts-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"></div>
        </section>

        <!-- 6. MÀN HÌNH & GAMING GEAR -->
        <section class="max-w-7xl mx-auto px-4 mt-10">
          ${sectionHeader('Màn hình và Gaming Gear', 'Màn hình, bàn phím, chuột, tai nghe', '#/category/10')}
          <div id="monitor-gear-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"></div>
        </section>

        <!-- 7. BÁN CHẠY NHẤT -->
        <section class="max-w-7xl mx-auto px-4 mt-10">
          ${sectionHeader('Bán chạy nhất', 'Được khách hàng chọn mua nhiều', '#/products')}
          <div id="best-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"></div>
        </section>

        <!-- 8. LIÊN HỆ -->
        <section class="max-w-7xl mx-auto px-4 mt-12">
          <div class="rounded-2xl p-8 md:p-10 flex flex-wrap items-center justify-between gap-4 text-white bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600">
            <div>
              <div class="text-2xl md:text-3xl font-extrabold leading-snug">Cần tư vấn cấu hình máy?</div>
              <div class="text-sm text-blue-100 mt-1">Gọi 1900 1234 hoặc để lại thông tin, TTD Shop sẽ liên hệ lại.</div>
            </div>
            <a href="#/contact" class="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 no-underline transition">Liên hệ ngay</a>
          </div>
        </section>

      </div>
    `);
  }

  // Slider tự chuyển slide mỗi 4 giây
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
    const container = this.$('#' + containerId);
    if (!container) return;

    if (!products || !products.length) {
      container.innerHTML = '<p class="col-span-full text-center text-slate-400 py-8">Đang cập nhật sản phẩm...</p>';
      return;
    }

    container.innerHTML = products.map(p => {
      const discount = p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

      // Chip thông số: chỉ lấy chữ/số ngắn, tối đa 3 chip
      const chips = Object.values(p.specs || {})
        .filter(v => (typeof v === 'string' || typeof v === 'number') && String(v).length <= 16)
        .slice(0, 3)
        .map(v => `<span class="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">${escapeHtml(String(v))}</span>`)
        .join('');

      const inStock = Number(p.stock) > 0;

      return `
        <div class="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col
                    hover:shadow-lg hover:-translate-y-0.5 transition duration-300">
          <a href="#/product/${p.id}" class="relative block aspect-square bg-slate-100 overflow-hidden no-underline">
            ${discount ? `<span class="absolute top-2 left-2 z-10 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">-${discount}%</span>` : ''}
            <img src="${p.image}" alt="${escapeHtml(p.name)}"
                 class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                 onerror="this.style.display='none'">
          </a>

          <div class="p-3 flex flex-col flex-1">
            <span class="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">${escapeHtml(p.brand || '')}</span>
            <a href="#/product/${p.id}" title="${escapeHtml(p.name)}"
               class="mt-1 text-sm font-semibold text-slate-800 hover:text-blue-600 leading-snug no-underline
                      line-clamp-2 min-h-[2.5rem]">${escapeHtml(p.name)}</a>

            <div class="flex flex-wrap gap-1 mt-2 min-h-[22px]">${chips}</div>

            <div class="mt-auto pt-3">
              <div class="h-4 text-xs text-slate-400 line-through">${discount ? formatPrice(p.originalPrice) : ''}</div>
              <div class="text-lg font-extrabold text-blue-600">${formatPrice(p.price)}</div>
              <div class="mt-1 text-[11px] text-slate-500">Đã bán ${p.sold || 0} | ${inStock ? `Còn ${p.stock}` : 'Hết hàng'}</div>

              <button type="button" data-add="${p.id}" ${inStock ? '' : 'disabled'}
                      class="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm py-2
                             rounded-lg transition cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed">
                ${inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
            </div>
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