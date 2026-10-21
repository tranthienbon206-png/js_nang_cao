import Storage from '../utils/storage.js';

const KEY = 'cart';

// Giỏ hàng lưu ở localStorage (không cần gọi API)
class CartModel {
  get items() { return Storage.get(KEY) ?? []; }
  save(items) { Storage.set(KEY, items); }

  add(product, qty = 1) {
    const items = this.items;
    const found = items.find(i => i.id === product.id);
    if (found) found.qty += qty;
    else items.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
    this.save(items);
  }

  updateQty(id, qty) {
    this.save(this.items.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  remove(id) { this.save(this.items.filter(i => i.id !== id)); }
  clear() { this.save([]); }

  get count() { return this.items.reduce((sum, i) => sum + i.qty, 0); }
  get total() { return this.items.reduce((sum, i) => sum + i.price * i.qty, 0); }
}

export default new CartModel();
