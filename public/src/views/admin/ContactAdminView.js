import BaseView from '../BaseView.js';
import { escapeHtml } from '../../utils/helpers.js';

export default class ContactAdminView extends BaseView {
  renderList(contacts) {
    this.renderAdminPage({
      title: 'Liên hệ',
      description: 'Tiếp nhận phản hồi và theo dõi tình trạng xử lý liên hệ.',
      content: `
            <div class="admin-panel-toolbar">
              <div class="admin-filter-search">
                <i class="bi bi-search" aria-hidden="true"></i>
                <input id="contact-search" class="form-control"
                  placeholder="Tìm tên, email hoặc tiêu đề..." aria-label="Tìm liên hệ">
              </div>
              <div class="admin-filter-select">
                <select id="contact-status-filter" class="form-select" aria-label="Lọc theo trạng thái">
                  <option value="">Tất cả liên hệ</option>
                  <option value="new">Chưa xử lý</option>
                  <option value="resolved">Đã xử lý</option>
                </select>
              </div>
            </div>

            <div class="table-responsive admin-table-wrap">
              <table class="table table-hover align-middle admin-data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Người gửi</th>
                    <th>Email</th>
                    <th>Tiêu đề</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${contacts.length ? contacts.map(c => {
                    const status = c.status || 'new';

                    return `
                      <tr data-contact-row="${c.id}">
                        <td>${c.id}</td>
                        <td>${escapeHtml(c.name ?? '')}</td>
                        <td>${escapeHtml(c.email ?? '')}</td>
                        <td>${escapeHtml(c.subject ?? '')}</td>
                        <td>${this.formatDate(c.createdAt)}</td>
                        <td>
                          <span class="badge ${status === 'resolved' ? 'text-bg-success' : 'text-bg-warning'}">
                            ${status === 'resolved' ? 'Đã xử lý' : 'Chưa xử lý'}
                          </span>
                        </td>
                        <td class="text-nowrap">
                          <button class="btn btn-sm btn-outline-primary"
                            data-detail="${c.id}">Xem</button>
                          <button class="btn btn-sm btn-outline-danger"
                            data-delete="${c.id}">Xóa</button>
                        </td>
                      </tr>
                    `;
                  }).join('') : '<tr><td colspan="7"><div class="admin-empty-state">Chưa có liên hệ nào.</div></td></tr>'}
                </tbody>
              </table>
            </div>
            <div class="admin-table-footer">Tổng cộng <strong>${contacts.length}</strong> liên hệ</div>
      `
    });
  }

  formatDate(value) {
    if (!value) return '—';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('vi-VN');
  }

  renderDetail(contact) {
    const status = contact.status || 'new';

    this.setHTML(`
      <div class="container py-4" style="max-width: 900px">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="mb-0">Liên hệ #${contact.id}</h2>
              <a href="#/admin/contacts" class="btn btn-outline-secondary">
                Quay lại
              </a>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Họ tên</label>
              <p>${escapeHtml(contact.name ?? '')}</p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Email</label>
              <p>
                <a href="mailto:${escapeHtml(contact.email ?? '')}">
                  ${escapeHtml(contact.email ?? '')}
                </a>
              </p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Số điện thoại</label>
              <p>${escapeHtml(contact.phone ?? '')}</p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Tiêu đề</label>
              <p>${escapeHtml(contact.subject ?? '')}</p>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Nội dung</label>
              <div class="border rounded p-3 bg-light"
                style="white-space: pre-wrap; overflow-wrap: anywhere">${escapeHtml(contact.message ?? '')}</div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">Ngày gửi</label>
              <p>${this.formatDate(contact.createdAt)}</p>
            </div>

            <form id="contact-status-form">
              <label class="form-label" for="contact-status">Trạng thái</label>
              <select class="form-select mb-3" id="contact-status" name="status">
                <option value="new" ${status === 'new' ? 'selected' : ''}>Chưa xử lý</option>
                <option value="resolved" ${status === 'resolved' ? 'selected' : ''}>Đã xử lý</option>
              </select>

              <button type="submit" class="btn btn-primary">
                Lưu trạng thái
              </button>
              <button type="button" class="btn btn-outline-danger"
                data-delete="${contact.id}">Xóa liên hệ</button>
            </form>
          </div>
        </div>
      </div>
    `);
  }

  bindSearch(contacts) {
    const search = this.$('#contact-search');
    const filter = this.$('#contact-status-filter');

    const apply = () => {
      const keyword = search.value.trim().toLowerCase();
      const status = filter.value;

      this.$$('tbody tr').forEach(row => {
        const contact = contacts.find(
          c => String(c.id) === row.dataset.contactRow
        );
        if (!contact) return;

        const content = [
          contact.name, contact.email, contact.subject
        ].join(' ').toLowerCase();

        const contactStatus = contact.status || 'new';

        row.hidden =
          !content.includes(keyword) ||
          (status !== '' && contactStatus !== status);
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

  bindDelete(handler) {
    this.app.addEventListener('click', e => {
      const button = e.target.closest('[data-delete]');
      if (!button || !this.app.contains(button)) return;

      if (confirm('Bạn có chắc muốn xóa liên hệ này?')) {
        handler(Number(button.dataset.delete));
      }
    });
  }

  bindStatusSubmit(handler) {
    const form = this.$('#contact-status-form');

    form?.addEventListener('submit', e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));
      handler(data.status);
    });
  }
}