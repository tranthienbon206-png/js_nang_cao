// Điểm khởi chạy: khai báo route -> controller
import Router from './core/Router.js';
import UserModel from './models/UserModel.js';
import HomeController from './controllers/HomeController.js';
import ProductController from './controllers/ProductController.js';
import CartController from './controllers/CartController.js';
import AuthController from './controllers/AuthController.js';
import ProductAdminController from './controllers/admin/ProductAdminController.js';
import { updateCartBadge, updateAuthMenu } from './controllers/shared.js';
import { mountHeader } from './views/Header.js';
import { mountFooter } from './views/Footer.js';
import AboutController from './controllers/AboutController.js';
import ContactController from './controllers/ContactController.js';
import CategoryController from './controllers/CategoryController.js';
import UserAdminController from './controllers/admin/UserAdminController.js';
import CategoryAdminController from './controllers/admin/CategoryAdminController.js';
import OrderAdminController from './controllers/admin/OrderAdminController.js';
import ContactAdminController from './controllers/admin/ContactAdminController.js';

const home = new HomeController();
const product = new ProductController();
const cart = new CartController();
const auth = new AuthController();
const productAdmin = new ProductAdminController();
const about = new AboutController();
const contact = new ContactController();
const category = new CategoryController();
const userAdmin = new UserAdminController();
const categoryAdmin = new CategoryAdminController();
const orderAdmin = new OrderAdminController();
const contactAdmin = new ContactAdminController();


// Middleware đơn giản: chặn trang admin nếu không phải admin
const adminOnly = action => params => {
  if (!UserModel.isAdmin()) {
    alert('Bạn không có quyền truy cập');
    return Router.navigate('/login');
  }
  return action(params);
};

const router = new Router();
router
  .add('/', () => home.index())
  .add('/product/:id', params => product.detail(params))
  .add('/product', () => product.index())
  .add('/cart', () => cart.index())
  .add('/login', () => auth.login())
  .add('/register', () => auth.register())
  .add('/logout', () => auth.logout())
  .add('/about',()=>about.index())
  .add('/contact', () => contact.index())
  .add('/category/:id', (params) => category.show(params.id))
  .add('/admin/products', adminOnly(() => productAdmin.index()))
  .add('/admin/products/add', adminOnly(() => productAdmin.add()))
  .add('/admin/products/edit/:id', adminOnly(params => productAdmin.edit(params)))
  .add('/admin/users', () => userAdmin.index())
  .add('/admin/users/edit/:id', params => userAdmin.edit(params))

  .add('/admin/categories', () => categoryAdmin.index())
  .add('/admin/categories/add', () => categoryAdmin.add())
  .add('/admin/categories/edit/:id', params => categoryAdmin.edit(params))

  .add('/admin/orders', () => orderAdmin.index())
  .add('/admin/orders/:id', params => orderAdmin.detail(params))

  .add('/admin/contacts', () => contactAdmin.index())
  .add('/admin/contacts/:id', params => contactAdmin.detail(params))
  .setNotFound(() => { document.getElementById('app').innerHTML = '<h2>404 - Không tìm thấy trang</h2>'; });


mountHeader();
mountFooter();

updateCartBadge();
updateAuthMenu();
router.resolve();
