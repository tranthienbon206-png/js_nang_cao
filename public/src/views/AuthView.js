import BaseView from './BaseView.js';
import { escapeHtml } from '../utils/helpers.js';

export default class AuthView extends BaseView {
  renderLogin() {
    this.setHTML(`
      <form id="auth-form" class="form">
        <h2>Đăng nhập</h2>
        <input name="username" placeholder="Tên đăng nhập"><small class="error" data-error="username"></small>
        <input name="password" type="password" placeholder="Mật khẩu"><small class="error" data-error="password"></small>
        <small class="error" data-error="general"></small>
        <button class="btn">Đăng nhập</button>
        <p>Chưa có tài khoản? <a href="#/register">Đăng ký</a></p>
      </form>
    `);
  }

  renderRegister() {
    this.setHTML(`
      <form id="auth-form" class="form">
        <h2>Đăng ký</h2>
        <input name="fullname" placeholder="Họ tên"><small class="error" data-error="fullname"></small>
        <input name="username" placeholder="Tên đăng nhập"><small class="error" data-error="username"></small>
        <input name="password" type="password" placeholder="Mật khẩu"><small class="error" data-error="password"></small>
        <input name="confirm" type="password" placeholder="Nhập lại mật khẩu"><small class="error" data-error="confirm"></small>
        <small class="error" data-error="general"></small>
        <button class="btn">Đăng ký</button>
      </form>
    `);
  }

  bindSubmit(handler) {
    const form = this.$('#auth-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getFormData(form));
    });
  }

  // Menu đăng nhập/đăng xuất trên header (nằm ngoài #app)
  static renderMenu(user) {
    const el = document.getElementById('auth-menu');
    if (!user) { el.innerHTML = '<a href="#/login">Đăng nhập</a>'; return; }
    el.innerHTML = `
      ${user.role === 'admin' ? '<a href="#/admin/products">Quản trị</a> ' : ''}
      Xin chào, <b>${escapeHtml(user.fullname)}</b> <a href="#/logout">Đăng xuất</a>`;
  }
}
