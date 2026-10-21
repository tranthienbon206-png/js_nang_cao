import CategoryView from '../views/CategoryView.js';

const API = 'http://localhost:3000';

export default class CategoryController {
  constructor() {
    this.view = new CategoryView('#app');   // truyền tham số giống các view khác của bạn
  }

  async show(id) {
    try {
      const [categories, products] = await Promise.all([
        fetch(`${API}/categories`).then((r) => r.json()),
        fetch(`${API}/products?categoryId=${id}`).then((r) => r.json()),
      ]);

      const category = categories.find((c) => String(c.id) === String(id));
      if (!category) {
        document.querySelector('#app').innerHTML =
          '<div class="alert alert-warning">Không tìm thấy danh mục.</div>';
        return;
      }

      this.view.render(category, products, categories);

      this.view.bindSort((type) => {
        const list = [...products];
        if (type === 'asc') list.sort((a, b) => a.price - b.price);
        if (type === 'desc') list.sort((a, b) => b.price - a.price);
        if (type === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        this.view.renderProducts(list);
      });
    } catch {
      document.querySelector('#app').innerHTML =
        '<div class="alert alert-danger">Không tải được dữ liệu, kiểm tra json-server.</div>';
    }
  }
}