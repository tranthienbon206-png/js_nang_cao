import BaseView from './BaseView.js';
import { formatPrice, escapeHtml, debounce } from '../utils/helpers.js';

export default class HomeView extends BaseView {
  // Khung trang: toolbar + vùng danh sách
  renderLayout(categories) {
    this.setHTML(`
      <h2>Sản phẩm</h2>
      <div class="toolbar">
        <input id="keyword" placeholder="Tìm theo tên...">
        <select id="category">
          <option value="">Tất cả danh mục</option>
          ${categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
        </select>
        <select id="sort">
          <option value="">Sắp xếp</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="name-asc">Tên A-Z</option>
        </select>
      </div>
      <div id="product-list" class="grid"></div>
    `);
  }

  renderProducts(products) {
    const list = this.$('#product-list');
    if (!products.length) { list.innerHTML = '<p>Không có sản phẩm phù hợp.</p>'; return; }
    list.innerHTML = products.map(p => `
      <div class="card">
        <a href="#/product/${p.id}"><img src="${p.image}" alt="${escapeHtml(p.name)}"></a>
        <div class="card-body">
          <a href="#/product/${p.id}"><strong>${escapeHtml(p.name)}</strong></a>
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn" data-add="${p.id}">Thêm vào giỏ</button>
        </div>
      </div>`).join('');
  }

  // Controller truyền handler vào, View chỉ gọi lại khi có sự kiện
  bindFilter(handler) {
    const emit = () => handler({
      keyword: this.$('#keyword').value.trim(),
      categoryId: this.$('#category').value,
      sort: this.$('#sort').value,
    });
    this.$('#keyword').addEventListener('input', debounce(emit));
    this.$('#category').addEventListener('change', emit);
    this.$('#sort').addEventListener('change', emit);
  }

  // Event delegation: 1 listener cho mọi nút "Thêm vào giỏ"
  bindAddToCart(handler) {
    this.$('#product-list').addEventListener('click', e => {
      const id = e.target.dataset.add;
      if (id) handler(Number(id));
    });
  }
}
