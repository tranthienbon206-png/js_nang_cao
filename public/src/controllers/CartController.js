import CartModel from '../models/CartModel.js';
import OrderModel from '../models/OrderModel.js';
import UserModel from '../models/UserModel.js';
import CartView from '../views/CartView.js';
import Router from '../core/Router.js';
import { validate, required } from '../utils/helpers.js';
import { updateCartBadge } from './shared.js';

export default class CartController {
  constructor() {
    this.view = new CartView();
  }

  index() {
    this.view.render(CartModel.items, CartModel.total);
    // Gắn lại sự kiện sau mỗi lần render
    this.view.bindChangeQty((id, qty) => { CartModel.updateQty(id, qty); this.refresh(); });
    this.view.bindRemove(id => { CartModel.remove(id); this.refresh(); });
    this.view.bindCheckout(data => this.checkout(data));

    // Tự điền thông tin nếu đã đăng nhập
    const user = UserModel.current();
    const nameInput = document.querySelector('#checkout-form [name=fullname]');
    if (user && nameInput) nameInput.value = user.fullname;
  }

  refresh() {
    updateCartBadge();
    this.index();
  }

  async checkout(data) {
    const errors = validate(data, {
      fullname: [[required, 'Vui lòng nhập họ tên']],
      phone: [[required, 'Vui lòng nhập SĐT'], [v => /^0\d{9}$/.test(v), 'SĐT gồm 10 số, bắt đầu bằng 0']],
      address: [[required, 'Vui lòng nhập địa chỉ']],
    });
    this.view.showFieldErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const user = UserModel.current();
      await OrderModel.create({
        ...data,
        // Khách vãng lai: KHÔNG gửi userId: null (json-server 0.17 sẽ lỗi 500 khi xóa dữ liệu)
        ...(user && { userId: user.id }),
        items: CartModel.items,
        total: CartModel.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      CartModel.clear();
      updateCartBadge();
      alert('Đặt hàng thành công!');
      Router.navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }
}
