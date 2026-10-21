import OrderModel from '../../models/OrderModel.js';
import OrderAdminView from '../../views/admin/OrderAdminView.js';

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'shipping',
  'completed',
  'cancelled'
];

export default class OrderAdminController {
  constructor() {
    this.view = new OrderAdminView();
  }

  async index() {
    try {
      this.view.showLoading();

      const orders = await OrderModel.getAll();

      // Mới nhất hiển thị trước.
      orders.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      this.view.renderList(orders);
      this.view.bindSearch(orders);

      this.view.bindDetail(id => {
        location.hash = `#/admin/orders/${id}`;
      });
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải đơn hàng');
    }
  }

  async detail({ id }) {
    try {
      this.view.showLoading();

      const order = await OrderModel.getById(id);
      if (!order) throw new Error('Không tìm thấy đơn hàng');

      this.view.renderDetail(order);
      this.view.bindStatusSubmit(data => this.updateStatus(order, data.status));
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải chi tiết đơn hàng');
    }
  }

  async updateStatus(order, status) {
    if (!VALID_STATUSES.includes(status)) {
      alert('Trạng thái không hợp lệ');
      return;
    }

    if (order.status === 'cancelled' || order.status === 'completed') {
      if (order.status !== status) {
        alert('Đơn đã hoàn thành hoặc đã hủy, không thể đổi trạng thái theo cách này.');
        return;
      }
    }

    try {
      await OrderModel.update(order.id, { ...order, status });

      alert('Cập nhật trạng thái thành công');
      location.hash = `#/admin/orders/${order.id}`;
    } catch (err) {
      alert(err.message || 'Không thể cập nhật trạng thái');
    }
  }
}