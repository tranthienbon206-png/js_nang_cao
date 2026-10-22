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

      // Lấy id của danh mục (theo slug) kèm toàn bộ danh mục con
      const idsOf = slug => {
        const root = categories.find(c => c.slug === slug);
        if (!root) return [];
        const kids = categories
          .filter(c => Number(c.parentId) === Number(root.id))
          .map(c => Number(c.id));
        return [Number(root.id), ...kids];
      };

      // Lấy tối đa "count" sản phẩm thuộc các danh mục, bán chạy trước
      const top = (ids, count) => products
        .filter(p => ids.includes(Number(p.categoryId)))
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, count);

      // 1. Render khung HTML
      this.view.renderLayout(categories);

      // 2. Hiển thị từng nhóm, đúng danh mục, không lẫn sản phẩm khác
      this.view.renderProductsGroup('pc-laptop-list', top([...idsOf('pc-gaming'), ...idsOf('laptop')], 5));
      this.view.renderProductsGroup('parts-list', top(idsOf('linh-kien-pc'), 5));
      this.view.renderProductsGroup('monitor-gear-list', top([...idsOf('man-hinh'), ...idsOf('gaming-gear')], 5));
      this.view.renderProductsGroup('best-list', [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5));

      // 3. Slider và sự kiện thêm vào giỏ
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