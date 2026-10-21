// View cha: chỉ lo HIỂN THỊ và BẮT SỰ KIỆN, không gọi API, không xử lý nghiệp vụ.
export default class BaseView {
  constructor() {
    this.app = document.getElementById('app');
  }

  setHTML(html) { this.app.innerHTML = html; }
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
