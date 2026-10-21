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

      // 2. Lấy sản phẩm cho từng mục.
      // Lấy theo categoryId trước, thiếu thì bù bằng sản phẩm khác cho đủ số lượng
      const pick = (categoryIds, count, offset = 0) => {
        const own = products.filter(p => categoryIds.includes(Number(p.categoryId)));
        if (own.length >= count) return own.slice(0, count);

        const rest = products.filter(p => !own.includes(p));
        const rotated = rest.slice(offset).concat(rest.slice(0, offset));
        return own.concat(rotated).slice(0, count);
      };

      // 3. Hiển thị từng nhóm
      this.view.renderProductsGroup('pc-list', pick([1], 5, 0));
      this.view.renderProductsGroup('laptop-list', pick([2], 4, 1));
      this.view.renderProductsGroup('parts-list', pick([3, 4, 5, 6, 7, 8, 9], 5, 2));
      this.view.renderProductsGroup('monitor-list', pick([10], 5, 3));
      this.view.renderProductsGroup('gear-list', pick([11], 5, 4));

      // 4. Slider và sự kiện thêm vào giỏ
      this.view.bindHero();
      this.view.bindAddToCart(id => this.handleAddToCart(id));

    } catch (err) {
      this.view.showError(err.message);
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