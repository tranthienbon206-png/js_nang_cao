import BaseView from './BaseView.js';
import { formatPrice, escapeHtml, debounce } from '../utils/helpers.js';

export default class HomeView extends BaseView {
  renderLayout(categories) {
    const mainCategories = categories.filter(c => !c.parentId);

    const menuHtml = mainCategories.map(c => 
      '<a href="#/products?category=' + c.id + '" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-red-600 transition font-medium whitespace-nowrap overflow-hidden text-ellipsis" title="' + escapeHtml(c.name) + '">' + 
        escapeHtml(c.name) + 
      '</a>'
    ).join('');

    const catGridHtml = mainCategories.slice(0, 6).map(c => 
      '<a href="#/products?category=' + c.id + '" class="flex items-center justify-center gap-2 bg-white rounded-xl p-3 text-sm font-medium text-slate-700 shadow-sm hover:text-red-600 hover:shadow-md transition">' +
        '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/></svg>' +
        '<span class="truncate">' + escapeHtml(c.name) + '</span>' +
      '</a>'
    ).join('');

    this.setHTML(`
      <div class="bg-slate-100 pb-8" style="background-color: #f1f5f9; padding-bottom: 2rem;">
          <!-- 1. HERO SECTION -->
          <section class="max-w-7xl mx-auto px-4 pt-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-4 items-start" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
              
              <!-- Menu danh mục bên trái -->
              <nav class="hidden lg:block bg-white rounded-xl py-2 shadow-sm border border-slate-100" style="background: #fff; border-radius: 0.75rem; padding: 0.5rem 0;">
                  ${menuHtml}
              </nav>

              <!-- Banner lớn ở giữa -->
              <div class="rounded-xl bg-gradient-to-r from-red-700 to-red-500 text-white p-8 flex flex-col justify-center min-h-[240px]" style="background: linear-gradient(to right, #b91c1c, #ef4444); color: white; padding: 2rem; border-radius: 0.75rem; min-height: 240px;">
                  <span class="text-xs font-bold uppercase tracking-wider" style="font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">Khuyến mãi tháng 10</span>
                  <h1 class="text-3xl md:text-4xl font-extrabold mt-2 leading-tight" style="font-size: 2.25rem; font-weight: 800; margin-top: 0.5rem; line-height: 1.2;">Build PC Gaming<br>Tặng màn hình 240Hz</h1>
                  <p class="mt-2 text-sm text-red-100" style="margin-top: 0.5rem; font-size: 0.875rem; color: #fee2e2;">Linh kiện chính hãng, lắp ráp và kiểm thử miễn phí.</p>
                  <a href="#pc-cau-hinh" class="mt-4 inline-block bg-white text-red-600 font-bold text-sm px-5 py-2.5 rounded-lg shadow hover:bg-red-50 transition" style="margin-top: 1rem; display: inline-block; background: #fff; color: #dc2626; font-weight: bold; padding: 0.625rem 1.25rem; border-radius: 0.5rem; text-decoration: none; width: fit-content;">Xem ngay</a>
              </div>

              <!-- Banner nhỏ bên phải -->
              <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <div class="rounded-xl bg-slate-800 text-white p-5 flex flex-col justify-center" style="background: #1e293b; color: white; padding: 1.25rem; border-radius: 0.75rem;">
                      <div class="text-lg font-bold" style="font-weight: bold; font-size: 1.125rem;">Laptop Gaming</div>
                      <div class="text-sm text-slate-300" style="font-size: 0.875rem; color: #cbd5e1;">Giảm đến 26%</div>
                  </div>
                  <div class="rounded-xl bg-blue-700 text-white p-5 flex flex-col justify-center" style="background: #1d4ed8; color: white; padding: 1.25rem; border-radius: 0.75rem; margin-top: 0.75rem;">
                      <div class="text-lg font-bold" style="font-weight: bold; font-size: 1.125rem;">Học sinh - Sinh viên</div>
                      <div class="text-sm text-blue-100" style="font-size: 0.875rem; color: #dbeafe;">Giảm thêm 1%</div>
                  </div>
              </div>
          </section>

          <!-- 2. DANH MỤC GRID -->
          <section id="danh-muc" class="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
              ${catGridHtml}
          </section>

          <!-- 3. PC GAMING -->
          <section id="pc-cau-hinh" class="max-w-7xl mx-auto px-4 py-4" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
              <div class="flex justify-between items-center mb-4" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h2 class="text-xl font-bold text-slate-800" style="font-size: 1.25rem; font-weight: bold; color: #1e293b;">PC Gaming bán chạy</h2>
                  <a href="#/products?category=1" class="text-sm font-semibold text-red-600 hover:underline" style="color: #dc2626; font-size: 0.875rem; font-weight: 600;">Xem tất cả</a>
              </div>
              <div id="pc-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;"></div>
          </section>

          <!-- 4. LAPTOP GAMING -->
          <section class="max-w-7xl mx-auto px-4 py-4" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
              <div class="flex justify-between items-center mb-4" style="display: flex; justify-between; align-items: center; margin-bottom: 1rem;">
                  <h2 class="text-xl font-bold text-slate-800" style="font-size: 1.25rem; font-weight: bold; color: #1e293b;">Laptop gaming bán chạy</h2>
                  <a href="#/products?category=2" class="text-sm font-semibold text-red-600 hover:underline" style="color: #dc2626; font-size: 0.875rem; font-weight: 600;">Xem tất cả</a>
              </div>
              <div id="laptop-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;"></div>
          </section>

          <!-- 5. MÀN HÌNH GAMING -->
          <section class="max-w-7xl mx-auto px-4 py-4" style="max-width: 80rem; margin: 0 auto; padding: 1rem;">
              <div class="flex justify-between items-center mb-4" style="display: flex; justify-between; align-items: center; margin-bottom: 1rem;">
                  <h2 class="text-xl font-bold text-slate-800" style="font-size: 1.25rem; font-weight: bold; color: #1e293b;">Màn hình gaming</h2>
                  <a href="#/products?category=10" class="text-sm font-semibold text-red-600 hover:underline" style="color: #dc2626; font-size: 0.875rem; font-weight: 600;">Xem tất cả</a>
              </div>
              <div id="monitor-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;"></div>
          </section>
      </div>
    `);
  }

  renderProductsGroup(containerId, products) {
    const container = this['\$']('#' + containerId);
    if (!container) return;

    if (!products || !products.length) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 1rem 0;">Đang cập nhật sản phẩm...</p>';
      return;
    }

    container.innerHTML = products.map(p => {
      const discountPercent = p.originalPrice && p.price 
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) 
        : 0;

      const specText = p.specs 
        ? Object.values(p.specs).slice(0, 3).join(' | ') 
        : (p.description || '');

      const badgeHtml = discountPercent > 0 
        ? '<span style="position: absolute; top: 8px; left: 8px; background: #dc2626; color: white; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; z-index: 10;">-' + discountPercent + '%</span>' 
        : '';

      const oldPriceHtml = p.originalPrice 
        ? '<div style="font-size: 12px; color: #94a3b8; text-decoration: line-through;">' + formatPrice(p.originalPrice) + '</div>' 
        : '';

      return (
        '<div style="background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">' +
            '<div>' +
                '<div style="position: relative; width: 100%; height: 160px; background: #f8fafc; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">' +
                    badgeHtml +
                    '<a href="#/product/' + p.id + '" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 8px;">' +
                        '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display=\'none\'">' +
                    '</a>' +
                '</div>' +
                '<a href="#/product/' + p.id + '" style="text-decoration: none;">' +
                    '<h3 style="font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title="' + escapeHtml(p.name) + '">' +
                        escapeHtml(p.name) +
                    '</h3>' +
                '</a>' +
                '<p style="font-size: 12px; color: #94a3b8; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + escapeHtml(specText) + '</p>' +
            '</div>' +
            '<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #f8fafc;">' +
                oldPriceHtml +
                '<div style="font-size: 16px; font-weight: bold; color: #dc2626; margin-top: 2px;">' + formatPrice(p.price) + '</div>' +
                '<button class="btn-buy" data-add="' + p.id + '" style="margin-top: 12px; width: 100%; background: #dc2626; color: white; font-weight: 600; font-size: 12px; padding: 8px 0; border-radius: 8px; border: none; cursor: pointer;">' +
                    'Thêm vào giỏ' +
                '</button>' +
            '</div>' +
        '</div>'
      );
    }).join('');
  }

  bindFilter(handler) {
    const keywordEl = this['\$']('#keyword');
    const categoryEl = this['\$']('#category');
    const sortEl = this['\$']('#sort');

    if (!keywordEl || !categoryEl || !sortEl) return;

    const emit = () => handler({
      keyword: keywordEl.value.trim(),
      categoryId: categoryEl.value,
      sort: sortEl.value,
    });

    keywordEl.addEventListener('input', debounce(emit));
    categoryEl.addEventListener('change', emit);
    sortEl.addEventListener('change', emit);
  }

  bindAddToCart(handler) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (btn) {
        const id = btn.dataset.add;
        if (id) handler(Number(id));
      }
    });
  }
}