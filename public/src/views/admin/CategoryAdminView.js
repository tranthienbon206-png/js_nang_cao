import BaseView from '../BaseView.js';
import { escapeHtml } from '../../utils/helpers.js';

export default class CategoryAdminView extends BaseView {
  renderList(categories) {
    this.setHTML(`
      <div class="container-fluid py-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Quản lý danh mục</h2>
          <a class="btn btn-primary" href="#/admin/categories/add">
            + Thêm danh mục
          </a>
        </div>

        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${categories.map(c => `
                    <tr>
                      <td>${c.id}</td>
                      <td>${escapeHtml(c.name ?? '')}</td>
                      <td>
                        <a class="btn btn-sm btn-outline-primary"
                          href="#/admin/categories/edit/${c.id}">Sửa</a>
                        <button class="btn btn-sm btn-outline-danger"
                          data-delete="${c.id}">Xóa</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <p class="text-muted mb-0">Tổng số: ${categories.length} danh mục</p>
          </div>
        </div>
      </div>
    `);
  }

  renderForm(category = null) {
    const c = category ?? { name: '' };

    this.setHTML(`
      <div class="container py-4" style="max-width: 700px">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="mb-4">${category ? 'Sửa' : 'Thêm'} danh mục</h2>

            <form id="category-form">
              <div class="mb-3">
                <label class="form-label" for="category-name">Tên danh mục</label>
                <input id="category-name" class="form-control"
                  name="name" required maxlength="100"
                  value="${escapeHtml(c.name ?? '')}"
                  placeholder="Nhập tên danh mục">
                <small class="text-danger" data-error="name"></small>
              </div>

              <button class="btn btn-primary" type="submit">Lưu</button>
              <a class="btn btn-outline-secondary" href="#/admin/categories">Hủy</a>
            </form>
          </div>
        </div>
      </div>
    `);
  }

  bindDelete(handler) {
    this.$('table')?.addEventListener('click', e => {
      const button = e.target.closest('[data-delete]');
      if (!button) return;

      const id = Number(button.dataset.delete);
      if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
        handler(id);
      }
    });
  }

  bindSubmit(handler) {
    const form = this.$('#category-form');

    form?.addEventListener('submit', e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));
      const errors = {};

      if (!data.name.trim()) {
        errors.name = 'Vui lòng nhập tên danh mục';
      }

      this.showFieldErrors(errors);

      if (Object.keys(errors).length === 0) {
        handler({ ...data, name: data.name.trim() });
      }
    });
  }
}