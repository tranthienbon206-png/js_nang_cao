import ProductModel from '../models/ProductModel.js';
import CategoryModel from '../models/CategoryModel.js';
import CartModel from '../models/CartModel.js';
import HomeView from '../views/HomeView.js';
import { updateCartBadge } from './shared.js';

export default class HomeController {
  constructor() {
    this.view = new HomeView();
  }

  async index() {
    try {
      this.view.showLoading();

      const [categories, products] = await Promise.all([
        CategoryModel.getAll(),
        ProductModel.getAll()
      ]);
      
      this.products = products;

      // 1. Render khung HTML
      this.view.renderLayout(categories);

      // 2. Phân loại sản phẩm theo categoryId từ db.json
      const pcProducts = products.filter(p => Number(p.categoryId) === 1);
      const laptopProducts = products.filter(p => Number(p.categoryId) === 2);
      const monitorProducts = products.filter(p => Number(p.categoryId) === 10);

      // 3. Hiển thị từng nhóm (nếu thiếu thì tự động lấy sản phẩm khác làm dự phòng)
      this.view.renderProductsGroup('pc-list', pcProducts.length ? pcProducts.slice(0, 4) : products.slice(0, 4));
      this.view.renderProductsGroup('laptop-list', laptopProducts.length ? laptopProducts.slice(0, 4) : products.slice(1, 5));
      this.view.renderProductsGroup('monitor-list', monitorProducts.length ? monitorProducts.slice(0, 4) : products.slice(2, 6));

      // 4. Lắng nghe sự kiện
      this.view.bindFilter(filters => this.handleFilter(filters));
      this.view.bindAddToCart(id => this.handleAddToCart(id));

    } catch (err) {
      this.view.showError(err.message);
    }
  }

  async handleFilter(filters) {
    try {
      this.products = await ProductModel.search(filters);
      if (typeof this.view.renderProducts === 'function') {
        this.view.renderProducts(this.products);
      }
    } catch (err) {
      alert(err.message);
    }
  }

  handleAddToCart(id) {
    const product = this.products.find(p => Number(p.id) === Number(id));
    if (!product) return;

    CartModel.add(product);
    updateCartBadge();
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }
}