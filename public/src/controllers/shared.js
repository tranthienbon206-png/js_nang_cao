import CartModel from '../models/CartModel.js';
import UserModel from '../models/UserModel.js';
import AuthView from '../views/AuthView.js';

// Các cập nhật dùng chung cho header
export const updateCartBadge = () => {
  document.getElementById('cart-count').textContent = CartModel.count;
};

export const updateAuthMenu = () => AuthView.renderMenu(UserModel.current());
