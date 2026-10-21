import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

export default class CategoryView extends BaseView {
  render(category, products) {
    this.setHTML(`
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 class="h3 fw-bold mb-1">${escapeHtml(category.name)}</h1>
          <span id="cat-count" class="text-muted small">${products.length} sản phẩm</span>
        </div>
        <select id="cat-sort" class="form-select w-auto shadow-sm">
          <option value="">Sắp xếp</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
          <option value="name">Tên A → Z</option>
        </select>
      </div>

      <div id="cat-products" class="row g-4"></div>
    `);

    this.renderProducts(products);
  }

  renderProducts(products) {
    const box = this.$('#cat-products');

    if (!products.length) {
      box.innerHTML = `
        <div class="col-12">
          <div class="bg-white rounded-3 shadow-sm text-center py-5">
            <i class="bi bi-inbox display-4 d-block mb-2 text-muted"></i>
            <p class="text-muted mb-3">Chưa có sản phẩm nào trong danh mục này.</p>
            <a href="#/" class="btn btn-primary btn-sm">Về trang chủ</a>
          </div>
        </div>`;
      return;
    }

    box.innerHTML = products.map((p) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
          <a href="#/product/${p.id}" class="overflow-hidden d-block">
            <img src="${p.image}" alt="${escapeHtml(p.name)}"
                 class="card-img-top" loading="lazy">
          </a>
          <div class="card-body d-flex flex-column">
            <h2 class="h6 card-title product-title mb-2">
              <a href="#/product/${p.id}" class="text-dark text-decoration-none">${escapeHtml(p.name)}</a>
            </h2>
            <div class="fw-bold text-danger fs-5 mb-3">${formatPrice(p.price)}</div>
            <a href="#/product/${p.id}" class="btn btn-primary btn-sm mt-auto">
              <i class="bi bi-eye me-1"></i>Xem chi tiết
            </a>
          </div>
        </div>
      </div>`).join('');
  }

  bindSort(handler) {
    this.$('#cat-sort').addEventListener('change', (e) => handler(e.target.value));
  }
}