import ProductModel from '../../models/ProductModel.js';
import CategoryModel from '../../models/CategoryModel.js';
import ProductAdminView from '../../views/admin/ProductAdminView.js';
import Router from '../../core/Router.js';
import { validate, required, positiveNumber } from '../../utils/helpers.js';

const RULES = {
  name: [[required, 'Nhập tên sản phẩm']],
  price: [[positiveNumber, 'Giá phải lớn hơn 0']],
  image: [[required, 'Nhập URL ảnh']],
  categoryId: [[required, 'Chọn danh mục']],
};

export default class ProductAdminController {
  constructor() {
    this.view = new ProductAdminView();
  }

  async index() {
    try {
      this.view.showLoading();
      const [products, categories] = await Promise.all([ProductModel.getAll(), CategoryModel.getAll()]);
      this.view.renderList(products, categories);
      this.view.bindDelete(async id => {
        await ProductModel.remove(id);
        this.index(); // load lại danh sách
      });
    } catch (err) {
      this.view.showError(err.message);
    }
  }

  async add() {
    const categories = await CategoryModel.getAll();
    this.view.renderForm(categories);
    this.view.bindSubmit(data => this.save(data));
  }

  async edit({ id }) {
    try {
      const [product, categories] = await Promise.all([ProductModel.getById(id), CategoryModel.getAll()]);
      this.view.renderForm(categories, product);
      this.view.bindSubmit(data => this.save(data, id));
    } catch {
      this.view.showError('Không tìm thấy sản phẩm');
    }
  }

  async save(data, id = null) {
    const errors = validate(data, RULES);
    this.view.showFieldErrors(errors);
    if (Object.keys(errors).length) return;

    // Ép kiểu số trước khi lưu
    const payload = { ...data, price: Number(data.price), categoryId: Number(data.categoryId) };
    try {
      if (id) await ProductModel.update(id, payload);
      else await ProductModel.create(payload);
      Router.navigate('/admin/products');
    } catch (err) {
      alert(err.message);
    }
  }
}
