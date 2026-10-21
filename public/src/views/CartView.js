import BaseView from './BaseView.js';
import { formatPrice, escapeHtml } from '../utils/helpers.js';

export default class CartView extends BaseView {
  render(items, total) {
    if (!items.length) {
      this.setHTML('<h2>Giỏ hàng</h2><p>Giỏ hàng trống. <a href="#/">Mua sắm ngay</a></p>');
      return;
    }
    this.setHTML(`
      <h2>Giỏ hàng</h2>
      <table>
        <thead><tr><th></th><th>Sản phẩm</th><th>Giá</th><th>SL</th><th>Thành tiền</th><th></th></tr></thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td><img src="${i.image}" alt=""></td>
              <td>${escapeHtml(i.name)}</td>
              <td>${formatPrice(i.price)}</td>
              <td><input type="number" min="1" value="${i.qty}" data-qty="${i.id}" style="width:70px"></td>
              <td>${formatPrice(i.price * i.qty)}</td>
              <td><button class="btn btn-danger" data-remove="${i.id}">Xóa</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <h3>Tổng: <span class="price">${formatPrice(total)}</span></h3>

      <form id="checkout-form" class="form">
        <h3>Thông tin đặt hàng</h3>
        <input name="fullname" placeholder="Họ tên"><small class="error" data-error="fullname"></small>
        <input name="phone" placeholder="Số điện thoại"><small class="error" data-error="phone"></small>
        <input name="address" placeholder="Địa chỉ"><small class="error" data-error="address"></small>
        <button class="btn">Đặt hàng</button>
      </form>
    `);
  }

  // Gắn listener vào <table> (được tạo lại mỗi lần render) thay vì #app
  // để tránh bị gắn trùng listener sau nhiều lần render.
  bindChangeQty(handler) {
    this.$('table')?.addEventListener('change', e => {
      if (e.target.dataset.qty) handler(Number(e.target.dataset.qty), Number(e.target.value));
    });
  }

  bindRemove(handler) {
    this.$('table')?.addEventListener('click', e => {
      if (e.target.dataset.remove) handler(Number(e.target.dataset.remove));
    });
  }

  bindCheckout(handler) {
    const form = this.$('#checkout-form');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getFormData(form));
    });
  }
}
