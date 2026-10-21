import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

export default class ProductDetailView extends BaseView {
  render(p, categoryName = '') {
    const inStock = p.stock === undefined || p.stock > 0;

    this.setHTML(`
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#/">Trang chủ</a></li>
          <li class="breadcrumb-item"><a href="#/products">Sản phẩm</a></li>
          ${categoryName ? `<li class="breadcrumb-item">${escapeHtml(categoryName)}</li>` : ''}
          <li class="breadcrumb-item active" aria-current="page">${escapeHtml(p.name)}</li>
        </ol>
      </nav>

      <div class="row g-4 mb-5">
        <!-- Ảnh -->
        <div class="col-md-6">
          <div class="bg-white rounded-3 shadow-sm p-3">
            <img src="${p.image}" alt="${escapeHtml(p.name)}"
                 class="img-fluid rounded-3 w-100" style="aspect-ratio:4/3;object-fit:cover">
          </div>
        </div>

        <!-- Thông tin -->
        <div class="col-md-6">
          <div class="bg-white rounded-3 shadow-sm p-4 h-100">
            ${categoryName ? `<span class="badge text-bg-primary mb-2">${escapeHtml(categoryName)}</span>` : ''}
            <h1 class="h3 fw-bold">${escapeHtml(p.name)}</h1>

            <div class="mb-3">
              <span class="text-warning">
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
              </span>
              <span class="text-muted small ms-1">(4.5 / 5)</span>
            </div>

            <div class="display-6 fw-bold text-danger mb-3">${formatPrice(p.price)}</div>

            <p class="mb-3">
              Tình trạng:
              ${inStock
                ? '<span class="text-success fw-semibold"><i class="bi bi-check-circle-fill me-1"></i>Còn hàng</span>'
                : '<span class="text-danger fw-semibold"><i class="bi bi-x-circle-fill me-1"></i>Hết hàng</span>'}
            </p>

            <p class="text-muted">${escapeHtml(p.description)}</p>

            <hr>

            <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
              <div class="input-group" style="width:140px">
                <button class="btn btn-outline-secondary" type="button" id="qty-minus">−</button>
                <input id="qty" type="number" min="1" value="1" class="form-control text-center">
                <button class="btn btn-outline-secondary" type="button" id="qty-plus">+</button>
              </div>
              <button class="btn btn-primary btn-lg flex-grow-1" id="btn-add" ${inStock ? '' : 'disabled'}>
                <i class="bi bi-cart-plus me-1"></i>Thêm vào giỏ
              </button>
            </div>

            <ul class="list-unstyled small text-muted mb-0">
              <li class="mb-1"><i class="bi bi-shield-check text-primary me-2"></i>Bảo hành chính hãng</li>
              <li class="mb-1"><i class="bi bi-truck text-primary me-2"></i>Miễn phí giao hàng đơn từ 5.000.000đ</li>
              <li><i class="bi bi-arrow-repeat text-primary me-2"></i>Đổi trả trong 7 ngày nếu lỗi nhà sản xuất</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tabs mô tả -->
      <div class="bg-white rounded-3 shadow-sm p-4">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-desc" type="button">Mô tả</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-policy" type="button">Chính sách</button>
          </li>
        </ul>
        <div class="tab-content pt-3">
          <div class="tab-pane fade show active" id="tab-desc">${escapeHtml(p.description)}</div>
          <div class="tab-pane fade" id="tab-policy">
            Sản phẩm được bảo hành chính hãng, hỗ trợ đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất.
          </div>
        </div>
      </div>
    `);

    this.bindQtyButtons();
  }

  bindQtyButtons() {
    const qty = this.$('#qty');
    this.$('#qty-minus').addEventListener('click', () => {
      qty.value = Math.max(1, (Number(qty.value) || 1) - 1);
    });
    this.$('#qty-plus').addEventListener('click', () => {
      qty.value = (Number(qty.value) || 1) + 1;
    });
  }

  bindAddToCart(handler) {
    this.$('#btn-add').addEventListener('click', () => handler(Number(this.$('#qty').value) || 1));
  }
}