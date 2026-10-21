import UserModel from '../models/UserModel.js';
import AuthView from '../views/AuthView.js';
import Router from '../core/Router.js';
import { validate, required, minLength } from '../utils/helpers.js';
import { updateAuthMenu } from './shared.js';

export default class AuthController {
  constructor() {
    this.view = new AuthView();
  }

  login() {
    this.view.renderLogin();
    this.view.bindSubmit(async data => {
      const errors = validate(data, {
        username: [[required, 'Nhập tên đăng nhập']],
        password: [[required, 'Nhập mật khẩu']],
      });
      this.view.showFieldErrors(errors);
      if (Object.keys(errors).length) return;

      try {
        const user = await UserModel.login(data.username, data.password);
        updateAuthMenu();
        Router.navigate(user.role === 'admin' ? '/admin/products' : '/');
      } catch (err) {
        this.view.showFieldErrors({ general: err.message });
      }
    });
  }

  register() {
    this.view.renderRegister();
    this.view.bindSubmit(async data => {
      const errors = validate(data, {
        fullname: [[required, 'Nhập họ tên']],
        username: [[minLength(4), 'Tên đăng nhập tối thiểu 4 ký tự']],
        password: [[minLength(6), 'Mật khẩu tối thiểu 6 ký tự']],
        confirm: [[(v, all) => v === all.password, 'Mật khẩu nhập lại không khớp']],
      });
      this.view.showFieldErrors(errors);
      if (Object.keys(errors).length) return;

      try {
        const { confirm, ...user } = data;
        await UserModel.register(user);
        alert('Đăng ký thành công, mời đăng nhập');
        Router.navigate('/login');
      } catch (err) {
        this.view.showFieldErrors({ general: err.message });
      }
    });
  }

  logout() {
    UserModel.logout();
    updateAuthMenu();
    Router.navigate('/');
  }
}
