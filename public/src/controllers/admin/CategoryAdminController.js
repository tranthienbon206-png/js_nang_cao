import CategoryModel from '../../models/CategoryModel.js';
import CategoryAdminView from '../../views/admin/CategoryAdminView.js';

export default class CategoryAdminController {
  constructor() {
    this.view = new CategoryAdminView();
  }

  async index() {
    try {
      this.view.showLoading();

      const categories = await CategoryModel.getAll();
      this.view.renderList(categories);

      this.view.bindDelete(async id => {
        try {
          await CategoryModel.remove(id);
          await this.index();
        } catch (err) {
          alert(err.message || 'Không thể xóa danh mục');
        }
      });
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải danh mục');
    }
  }

  async add() {
    this.view.renderForm();
    this.view.bindSubmit(data => this.save(data));
  }

  async edit({ id }) {
    try {
      this.view.showLoading();

      const category = await CategoryModel.getById(id);
      if (!category) throw new Error('Không tìm thấy danh mục');

      this.view.renderForm(category);
      this.view.bindSubmit(data => this.save(data, id));
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải danh mục');
    }
  }

  async save(data, id = null) {
    try {
      const categories = await CategoryModel.getAll();

      const duplicate = categories.some(c =>
        c.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        String(c.id) !== String(id)
      );

      if (duplicate) {
        this.view.showFieldErrors({
          name: 'Tên danh mục đã tồn tại'
        });
        return;
      }

      if (id) {
        const oldCategory = await CategoryModel.getById(id);
        await CategoryModel.update(id, { ...oldCategory, ...data });
      } else {
        await CategoryModel.create(data);
      }

      location.hash = '#/admin/categories';
    } catch (err) {
      alert(err.message || 'Không thể lưu danh mục');
    }
  }
}