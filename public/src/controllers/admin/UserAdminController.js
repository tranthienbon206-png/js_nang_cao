import UserModel from '../../models/UserModel.js';
import UserAdminView from '../../views/admin/UserAdminView.js';

export default class UserAdminController {
  constructor() {
    this.view = new UserAdminView();
  }

  async index() {
    try {
      this.view.showLoading();

      const users = await UserModel.getAll();
      this.view.renderList(users);
      this.view.bindSearch(users);

      this.view.bindEdit(id => {
        location.hash = `#/admin/users/edit/${id}`;
      });
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải danh sách người dùng');
    }
  }

  async edit({ id }) {
    try {
      this.view.showLoading();

      const user = await UserModel.getById(id);
      if (!user) throw new Error('Không tìm thấy người dùng');

      this.view.renderForm(user);
      this.view.bindSubmit(data => this.save(user, data));
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải thông tin người dùng');
    }
  }

  async save(user, data) {
    if (!['admin', 'user'].includes(data.role)) {
      alert('Vai trò không hợp lệ');
      return;
    }

    if (!['active', 'inactive'].includes(data.status)) {
      alert('Trạng thái không hợp lệ');
      return;
    }

    // Giữ nguyên các trường khác, đặc biệt là mật khẩu.
    const payload = {
      ...user,
      role: data.role,
      status: data.status
    };

    try {
      await UserModel.update(user.id, payload);
      alert('Cập nhật người dùng thành công');
      location.hash = '#/admin/users';
    } catch (err) {
      alert(err.message || 'Cập nhật thất bại');
    }
  }
}