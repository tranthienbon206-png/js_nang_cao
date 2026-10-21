import BaseView from '../BaseView.js';
import { formatPrice, escapeHtml } from '../../utils/helpers.js';

export default class OrderAdminView extends BaseView {
  renderList(orders) {
    this.renderAdminPage({
      title: 'Đơn hàng',
      description: 'Theo dõi đơn hàng và cập nhật trạng thái xử lý.',
      content: `
          <div class="admin-panel-toolbar">
            <div class="admin-filter-search">
              <i class="bi bi-search" aria-hidden="true"></i>
              <input id="order-search" class="form-control"
                placeholder="Tìm mã đơn, tên khách hàng, số điện thoại..." aria-label="Tìm đơn hàng">
            </div>
            <div class="admin-filter-select">
              <select id="order-status-filter" class="form-select" aria-label="Lọc theo trạng thái">
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
          <div class="table-responsive admin-table-wrap">
              <table class="table table-hover align-middle admin-data-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Tổng tiền</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.length ? orders.map(o => `
                    <tr data-order-row="${o.id}"
                      data-status="${escapeHtml(o.status ?? 'pending')}">
                      <td>#${o.id}</td>
                      <td>${escapeHtml(o.fullname ?? '')}</td>
                      <td>${escapeHtml(o.phone ?? '')}</td>
                      <td class="text-nowrap">${formatPrice(Number(o.total) || 0)}</td>
                      <td>${this.formatDate(o.createdAt)}</td>
                      <td>${this.statusBadge(o.status)}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary"
                          data-detail="${o.id}">Chi tiết</button>
                      </td>
                    </tr>
                  `).join('') : '<tr><td colspan="7"><div class="admin-empty-state">Chưa có đơn hàng nào.</div></td></tr>'}
                </tbody>
              </table>
          </div>
          <div class="admin-table-footer">Tổng cộng <strong>${orders.length}</strong> đơn hàng</div>
      `
    });
  }

  statusBadge(status) {
    const statuses = {
      pending: ['Chờ xử lý', 'text-bg-warning'],
      confirmed: ['Đã xác nhận', 'text-bg-primary'],
      shipping: ['Đang giao', 'text-bg-info'],
      completed: ['Hoàn thành', 'text-bg-success'],
      cancelled: ['Đã hủy', 'text-bg-danger']
    };

    const [label, css] = statuses[status] ?? [
      status || 'Chưa xác định',
      'text-bg-secondary'
    ];

    return `<span class="badge ${css}">${escapeHtml(label)}</span>`;
  }

  formatDate(value) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('vi-VN');
  }

  renderDetail(order) {
    const items = Array.isArray(order.items) ? order.items : [];

    this.setHTML(`
      <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Chi tiết đơn hàng #${order.id}</h2>
          <a class="btn btn-outline-secondary" href="#/admin/orders">
            Quay lại
          </a>
        </div>

        <div class="row g-4">
          <div class="col-lg-5">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="mb-3">Thông tin khách hàng</h5>
                <p><strong>Họ tên:</strong> ${escapeHtml(order.fullname ?? '')}</p>
                <p><strong>Số điện thoại:</strong> ${escapeHtml(order.phone ?? '')}</p>
                <p><strong>Địa chỉ:</strong> ${escapeHtml(order.address ?? '')}</p>
                <p><strong>Ngày đặt:</strong> ${this.formatDate(order.createdAt)}</p>
                <p><strong>Tổng tiền:</strong>
                  ${formatPrice(Number(order.total) || 0)}
                </p>

                <form id="order-status-form">
                  <label class="form-label" for="order-status">
                    Cập nhật trạng thái
                  </label>

                  <select id="order-status" name="status" class="form-select mb-3">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Đã xác nhận</option>
                    <option value="shipping" ${order.status === 'shipping' ? 'selected' : ''}>Đang giao</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                  </select>

                  <button type="submit" class="btn btn-primary">
                    Lưu trạng thái
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="mb-3">Sản phẩm trong đơn</h5>

                <div class="table-responsive">
                  <table class="table align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${items.map(item => `
                        <tr>
                          <td>
                            <div class="d-flex align-items-center gap-2">
                              ${item.image ? `
                                <img src="${escapeHtml(item.image)}"
                                  alt="" width="55" height="55"
                                  style="object-fit:contain">
                              ` : ''}
                              <span>${escapeHtml(item.name ?? '')}</span>
                            </div>
                          </td>
                          <td class="text-nowrap">${formatPrice(Number(item.price) || 0)}</td>
                          <td>${Number(item.qty) || 0}</td>
                          <td class="text-nowrap">
                            ${formatPrice((Number(item.price) || 0) * (Number(item.qty) || 0))}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                ${items.length === 0
                  ? '<p class="text-muted">Đơn hàng chưa có thông tin sản phẩm.</p>'
                  : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  bindSearch(orders) {
    const search = this.$('#order-search');
    const filter = this.$('#order-status-filter');

    const apply = () => {
      const keyword = search.value.trim().toLowerCase();
      const status = filter.value;

      this.$$('tbody tr').forEach(row => {
        const order = orders.find(o => String(o.id) === row.dataset.orderRow);
        if (!order) return;

        const content = [
          order.id, order.fullname, order.phone
        ].join(' ').toLowerCase();

        row.hidden =
          !content.includes(keyword) ||
          (status !== '' && order.status !== status);
      });
    };

    search?.addEventListener('input', apply);
    filter?.addEventListener('change', apply);
  }

  bindDetail(handler) {
    this.$('table')?.addEventListener('click', e => {
      const button = e.target.closest('[data-detail]');
      if (button) handler(Number(button.dataset.detail));
    });
  }

  bindStatusSubmit(handler) {
    const form = this.$('#order-status-form');

    form?.addEventListener('submit', e => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(form)));
    });
  }
}