import ProductModel from '../models/ProductModel.js';
import CategoryModel from '../models/CategoryModel.js';
import CartModel from '../models/CartModel.js';
import ProductDetailView from '../views/ProductDetailView.js';
import ProductViews from '../views/ProductViews.js';
import { updateCartBadge } from './shared.js';

export default class ProductController {
  constructor() {
    this.detailView = new ProductDetailView();
    this.listView = new ProductViews();
  }

  async index() {
    try {
      this.listView.showLoading();
      const [categories, products] = await Promise.all([
        CategoryModel.getAll(),
        ProductModel.getAll(),
      ]);
      this.products = products;

      this.listView.renderLayout(categories);
      this.listView.renderProducts(products);
      this.listView.bindFilter(filters => this.handleFilter(filters));
      this.listView.bindAddToCart(id => this.handleAddToCart(id));
    } catch (err) {
      this.listView.showError(err.message);
    }
  }

  async handleFilter(filters) {
    try {
      this.products = await ProductModel.search(filters);
      this.listView.renderProducts(this.products);
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
    this.view = new ProductDetailView();
  }

  async detail({ id }) {

    this.detailView.showLoading();
    const product = await ProductModel.getById(id);
    const category = await CategoryModel.getById(product.categoryId).catch(() => null);

    this.detailView.render(product, category?.name);
    this.detailView.bindAddToCart(async qty => {
      this.view.showLoading();
      const product = await ProductModel.getById(id);
      const category = await CategoryModel.getById(product.categoryId).catch(() => null);

      this.view.render(product, category?.name);
      this.view.bindAddToCart(qty => {
        CartModel.add(product, qty);
        updateCartBadge();
        alert('Đã thêm vào giỏ hàng');
      });
    })
  }
}
