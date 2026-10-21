// View cha: chỉ lo HIỂN THỊ và BẮT SỰ KIỆN, không gọi API, không xử lý nghiệp vụ.
export default class BaseView {
  constructor() {
    this.app = document.getElementById('app');
  }

  setHTML(html) {
    const currentPath = window.location.hash.slice(1) || '/';
    if (!currentPath.startsWith('/admin/')) {
      this.app.innerHTML = html;
      return;
    }

    const links = [
      { path: '/admin/products', label: 'Sản phẩm', icon: 'bi-box-seam' },
      { path: '/admin/categories', label: 'Danh mục', icon: 'bi-tags' },
      { path: '/admin/orders', label: 'Đơn hàng', icon: 'bi-receipt' },
      { path: '/admin/users', label: 'Người dùng', icon: 'bi-people' },
      { path: '/admin/contacts', label: 'Liên hệ', icon: 'bi-chat-left-text' }
    ];

    const navigation = links.map(({ path, label, icon }) => {
      const active = currentPath === path || currentPath.startsWith(`${path}/`);
      return `
        <a class="admin-sidebar-link${active ? ' active' : ''}"
          href="#${path}"${active ? ' aria-current="page"' : ''}>
          <i class="bi ${icon}" aria-hidden="true"></i>
          <span>${label}</span>
        </a>
      `;
    }).join('');

    this.app.innerHTML = `
      <div class="admin-layout">
        <aside class="admin-sidebar" aria-label="Điều hướng quản trị">
          <div class="admin-sidebar-heading">
            <i class="bi bi-speedometer2" aria-hidden="true"></i>
            <span>Quản trị</span>
          </div>
          <nav class="admin-sidebar-nav">${navigation}</nav>
          <a class="admin-sidebar-link admin-store-link" href="#/">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
            <span>Về cửa hàng</span>
          </a>
        </aside>
        <section class="admin-content">${html}</section>
      </div>
    `;
  }

  renderAdminPage({ title, description, action = '', content }) {
    this.setHTML(`
      <div class="admin-page">
        <header class="admin-page-header">
          <div>
            <div class="admin-page-eyebrow">TRANG QUẢN TRỊ</div>
            <h1>${title}</h1>
            <p>${description}</p>
          </div>
          ${action ? `<div class="admin-page-action">${action}</div>` : ''}
        </header>
        <section class="admin-panel">${content}</section>
      </div>
    `);
  }

  $(selector) { return this.app.querySelector(selector); }
  $$(selector) { return this.app.querySelectorAll(selector); }

  showLoading() { this.setHTML('<p>Đang tải...</p>'); }
  showError(message) { this.setHTML(`<p class="error">${message}</p>`); }

  // Hiển thị lỗi validate dưới từng input: <small class="error" data-error="name">
  showFieldErrors(errors = {}) {
    this.$$('[data-error]').forEach(el => { el.textContent = errors[el.dataset.error] ?? ''; });
  }

  // Lấy toàn bộ giá trị form thành object
  getFormData(form) { return Object.fromEntries(new FormData(form)); }
}
