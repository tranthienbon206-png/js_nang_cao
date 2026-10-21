// src/views/admin/UserAdminView.js
import BaseView from '../BaseView.js';
import { escapeHtml } from '../../utils/helpers.js';

export default class UserAdminView extends BaseView {
  renderList(users) {
    this.setHTML(`
      <div class="container-fluid py-3">
        <h2 class="mb-4">Quản lý người dùng</h2>

        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-3">
              <input id="user-search" class="form-control"
                placeholder="Tìm theo tên, username hoặc email...">
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Tài khoản</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr data-user-row="${u.id}">
                      <td>${u.id}</td>
                      <td>${escapeHtml(u.username ?? '')}</td>
                      <td>${escapeHtml(u.fullname ?? '')}</td>
                      <td>${escapeHtml(u.email ?? '')}</td>
                      <td>
                        <span class="badge ${u.role === 'admin' ? 'text-bg-primary' : 'text-bg-secondary'}">
                          ${u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${u.status === 'active' ? 'text-bg-success' : 'text-bg-danger'}">
                          ${u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary"
                          data-edit="${u.id}">Sửa</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <p class="text-muted mb-0">Tổng số: ${users.length} người dùng</p>
          </div>
        </div>
      </div>
    `);
  }

  renderForm(user) {
    this.setHTML(`
      <div class="container py-4" style="max-width: 700px">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="mb-4">Cập nhật người dùng</h2>

            <form id="user-form" class="form">
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input class="form-control" value="${escapeHtml(user.username ?? '')}" disabled>
              </div>

              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input class="form-control" value="${escapeHtml(user.fullname ?? '')}" disabled>
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control" value="${escapeHtml(user.email ?? '')}" disabled>
              </div>

              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <select class="form-select" name="role">
                  <option value="user" ${user.role === 'user' ? 'selected' : ''}>Khách hàng</option>
                  <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Quản trị viên</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" name="status">
                  <option value="active" ${user.status === 'active' ? 'selected' : ''}>Hoạt động</option>
                  <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Khóa tài khoản</option>
                </select>
              </div>

              <button class="btn btn-primary" type="submit">Lưu thay đổi</button>
              <a class="btn btn-outline-secondary" href="#/admin/users">Quay lại</a>
            </form>
          </div>
        </div>
      </div>
    `);
  }

  bindSearch(users) {
    const input = this.$('#user-search');
    input?.addEventListener('input', () => {
      const keyword = input.value.trim().toLowerCase();

      this.$$('tbody tr').forEach(row => {
        const user = users.find(u => String(u.id) === row.dataset.userRow);
        if (!user) return;

        const content = [
          user.username, user.fullname, user.email
        ].join(' ').toLowerCase();

        row.hidden = !content.includes(keyword);
      });
    });
  }

  bindEdit(handler) {
    this.app.addEventListener('click', e => {
      const button = e.target.closest('[data-edit]');
      if (button && this.app.contains(button)) {
        handler(Number(button.dataset.edit));
      }
    });
  }

  bindSubmit(handler) {
    const form = this.$('#user-form');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(form)));
    });
  }
}