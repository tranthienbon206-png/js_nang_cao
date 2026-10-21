import ProductModel from '../models/ProductModel.js';
import CategoryModel from '../models/CategoryModel.js';
import CartModel from '../models/CartModel.js';
import ProductDetailView from '../views/ProductDetailView.js';
import { updateCartBadge } from './shared.js';

export default class ProductController {
  constructor() {
    this.view = new ProductDetailView();
  }

  async detail({ id }) {
    try {
      this.view.showLoading();
      const product = await ProductModel.getById(id);
      const category = await CategoryModel.getById(product.categoryId).catch(() => null);

      this.view.render(product, category?.name);
      this.view.bindAddToCart(qty => {
        CartModel.add(product, qty);
        updateCartBadge();
        alert('Đã thêm vào giỏ hàng');
      });
    } catch {
      this.view.showError('Không tìm thấy sản phẩm');
    }
  }
}
