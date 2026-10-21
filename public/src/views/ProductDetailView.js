import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

export default class ProductDetailView extends BaseView {
  render(p, categoryName = '') {
    this.setHTML(`
      <p><a href="#/">← Quay lại</a></p>
      <div class="detail">
        <img src="${p.image}" alt="${escapeHtml(p.name)}">
        <div>
          <h2>${escapeHtml(p.name)}</h2>
          <p>Danh mục: ${escapeHtml(categoryName)}</p>
          <p class="price">${formatPrice(p.price)}</p>
          <p>${escapeHtml(p.description)}</p>
          <input id="qty" type="number" min="1" value="1" style="width:80px">
          <button class="btn" id="btn-add">Thêm vào giỏ</button>
        </div>
      </div>
    `);
  }

  bindAddToCart(handler) {
    this.$('#btn-add').addEventListener('click', () => handler(Number(this.$('#qty').value) || 1));
  }
}
