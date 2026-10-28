
import BaseView from './BaseView.js';
import { escapeHtml } from '../utils/helpers.js';

export default class AuthView extends BaseView {
  renderLogin() {
    this.setHTML(`
      <div class="container py-5">
        <div class="row justify-content-center align-items-center">
          <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <div class="auth-icon bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style="width: 72px; height: 72px;">
                    <i class="bi bi-person-lock fs-1"></i>
                  </div>
                  <h2 class="fw-bold mb-2">Đăng nhập</h2>
                  <p class="text-secondary mb-0">
                    Chào mừng bạn quay trở lại!
                  </p>
                </div>

                <form id="auth-form">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Tên đăng nhập</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-person"></i>
                      </span>
                      <input name="username" class="form-control"
                        placeholder="Nhập tên đăng nhập"
                        autocomplete="username" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="username"></small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Mật khẩu</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input name="password" type="password"
                        class="form-control" placeholder="Nhập mật khẩu"
                        autocomplete="current-password" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="password"></small>
                  </div>

                  <small class="error text-danger d-block mb-3"
                    data-error="general"></small>

                  <button type="submit"
                    class="btn btn-primary btn-lg w-100 rounded-3 fw-semibold">
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    Đăng nhập
                  </button>

                  <div class="text-center mt-4">
                    <span class="text-secondary">Chưa có tài khoản?</span>
                    <a href="#/register"
                      class="text-primary text-decoration-none fw-semibold">
                      Đăng ký ngay
                    </a>
                  </div>
                </form>
              </div>
            </div>

            <p class="text-center text-secondary small mt-4">
              © ${new Date().getFullYear()} · Chào mừng bạn đến với cửa hàng
            </p>
          </div>
        </div>
      </div>
    `);
  }

  renderRegister() {
    this.setHTML(`
      <div class="container py-5">
        <div class="row justify-content-center align-items-center">
          <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <div class="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style="width: 72px; height: 72px;">
                    <i class="bi bi-person-plus fs-1"></i>
                  </div>
                  <h2 class="fw-bold mb-2">Tạo tài khoản</h2>
                  <p class="text-secondary mb-0">
                    Đăng ký để bắt đầu mua sắm
                  </p>
                </div>

                <form id="auth-form">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Họ và tên</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-person-vcard"></i>
                      </span>
                      <input name="fullname" class="form-control"
                        placeholder="Nhập họ và tên"
                        autocomplete="name" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="fullname"></small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Tên đăng nhập</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-person"></i>
                      </span>
                      <input name="username" class="form-control"
                        placeholder="Tạo tên đăng nhập"
                        autocomplete="username" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="username"></small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Mật khẩu</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input name="password" type="password"
                        class="form-control" placeholder="Tạo mật khẩu"
                        autocomplete="new-password" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="password"></small>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      Xác nhận mật khẩu
                    </label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-shield-check"></i>
                      </span>
                      <input name="confirm" type="password"
                        class="form-control" placeholder="Nhập lại mật khẩu"
                        autocomplete="new-password" required>
                    </div>
                    <small class="error text-danger d-block mt-1"
                      data-error="confirm"></small>
                  </div>

                  <small class="error text-danger d-block mb-3"
                    data-error="general"></small>

                  <button type="submit"
                    class="btn btn-success btn-lg w-100 rounded-3 fw-semibold">
                    <i class="bi bi-person-check me-2"></i>
                    Tạo tài khoản
                  </button>

                  <div class="text-center mt-4">
                    <span class="text-secondary">Đã có tài khoản?</span>
                    <a href="#/login"
                      class="text-success text-decoration-none fw-semibold">
                      Đăng nhập
                    </a>
                  </div>
                </form>
              </div>
            </div>

            <p class="text-center text-secondary small mt-4">
              © ${new Date().getFullYear()} · Tham gia cùng chúng tôi
            </p>
          </div>
        </div>
      </div>
    `);
  }

  bindSubmit(handler) {
    const form = this.$('#auth-form');

    form.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getFormData(form));
    });
  }

  static renderMenu(user) {
    const el = document.getElementById('auth-menu');
    if (!el) return;

    if (!user) {
      el.innerHTML = `
        <a href="#/login" class="btn btn-outline-primary btn-sm rounded-3">
          <i class="bi bi-box-arrow-in-right me-1"></i>
          Đăng nhập
        </a>
      `;
      return;
    }

    el.innerHTML = `
      ${user.role === 'admin'
        ? `<a href="#/admin/products"
             class="btn btn-outline-primary btn-sm rounded-3 me-2">
             <i class="bi bi-speedometer2 me-1"></i> Quản trị
           </a>`
        : ''}
      <span class="me-2 text-dark">
        <i class="bi bi-person-circle me-1"></i>
        Xin chào, <b>${escapeHtml(user.fullname)}</b>
      </span>
      <a href="#/logout"
        class="btn btn-outline-danger btn-sm rounded-3">
        <i class="bi bi-box-arrow-right me-1"></i>
        Đăng xuất
      </a>
    `;
  }
}
