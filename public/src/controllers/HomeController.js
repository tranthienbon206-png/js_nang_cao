import ProductModel from '../models/ProductModel.js';
import CategoryModel from '../models/CategoryModel.js';
import CartModel from '../models/CartModel.js';
import HomeView from '../views/HomeView.js';
import { updateCartBadge } from './shared.js';

// Controller: nhận sự kiện từ View -> gọi Model -> đưa dữ liệu cho View hiển thị
export default class HomeController {
  constructor() {
    this.view = new HomeView();
  }

  async index() {
    try {
      this.view.showLoading();
      // Gọi song song 2 API bằng Promise.all
      const [categories, products] = await Promise.all([CategoryModel.getAll(), ProductModel.getAll()]);
      this.products = products;

      this.view.renderLayout(categories);
      this.view.renderProducts(products);
      this.view.bindFilter(filters => this.handleFilter(filters));
      this.view.bindAddToCart(id => this.handleAddToCart(id));
    } catch (err) {
      this.view.showError(err.message);
    }
  }

  async handleFilter(filters) {
    try {
      this.products = await ProductModel.search(filters);
      this.view.renderProducts(this.products);
    } catch (err) {
      alert(err.message);
    }
  }

  handleAddToCart(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;
    CartModel.add(product);
    updateCartBadge();
    alert(`Đã thêm "${product.name}" vào giỏ`);
  }
}
