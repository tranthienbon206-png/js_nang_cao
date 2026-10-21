import { escapeHtml } from '../utils/helpers.js';

const API = 'http://localhost:3000';   // đổi cho đúng cổng json-server của bạn

export function Header() {
  return `
    <!-- Top bar -->
    <div class="bg-dark text-white small py-1 d-none d-md-block">
      <div class="container d-flex justify-content-between">
        <span><i class="bi bi-telephone-fill me-1"></i> Hotline: 1900 1234</span>
        <span><i class="bi bi-truck me-1"></i> Miễn phí giao hàng cho đơn từ 5.000.000đ</span>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" href="#/">TTD Shop</a>

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="#/">Trang chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="#/products">Sản phẩm</a></li>

            <li class="nav-item dropdown" id="category-dropdown">
              <button class="nav-link dropdown-toggle bg-transparent border-0" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false">Danh mục</button>
              <ul class="dropdown-menu border-0 shadow" id="category-menu">
                <li><span class="dropdown-item text-muted">Đang tải...</span></li>
              </ul>
            </li>

            <li class="nav-item"><a class="nav-link" href="#/about">Giới thiệu</a></li>
            <li class="nav-item"><a class="nav-link" href="#/contact">Liên hệ</a></li>
          </ul>

          <!-- Tìm kiếm -->
          <form id="search-form" class="d-flex me-lg-3 my-2 my-lg-0" role="search">
            <div class="input-group">
              <input id="search-input" class="form-control" type="search"
                     placeholder="Tìm sản phẩm..." aria-label="Tìm kiếm">
              <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
            </div>
          </form>

          <!-- Giỏ hàng + tài khoản -->
          <div class="d-flex align-items-center gap-3">
            <a href="#/cart" class="btn btn-outline-primary position-relative">
              <i class="bi bi-cart3"></i>
              <span id="cart-count"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
            </a>
            <div id="auth-menu" class="d-flex align-items-center gap-2"></div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

/* Đánh dấu mục menu đang active theo hash */
function setActiveLink() {
  const current = location.hash.split('?')[0] || '#/';
  const inCategory = current.startsWith('#/category/');

  // Các link thường
  document.querySelectorAll('#mainNav .navbar-nav > .nav-item > a.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });

  // Mục "Danh mục" và mục con
  document.querySelector('#category-dropdown > .nav-link')?.classList.toggle('active', inCategory);
  document.querySelectorAll('#category-menu .dropdown-item').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });

  // Đóng menu hamburger trên mobile sau khi chuyển trang
  const nav = document.querySelector('#mainNav');
  if (nav?.classList.contains('show')) {
    window.bootstrap?.Collapse.getOrCreateInstance(nav).hide();
  }
}

/* Lấy danh mục từ db.json */
async function loadCategoryMenu() {
  const menu = document.querySelector('#category-menu');
  if (!menu) return;
  try {
    const res = await fetch(`${API}/categories`);
    if (!res.ok) throw new Error();
    const cats = await res.json();

    menu.innerHTML = cats.length
      ? cats.map((c) => `
          <li><a class="dropdown-item" href="#/category/${c.id}">${escapeHtml(c.name)}</a></li>`).join('')
      : '<li><span class="dropdown-item text-muted">Chưa có danh mục</span></li>';
  } catch {
    menu.innerHTML = '<li><span class="dropdown-item text-muted">Không tải được danh mục</span></li>';
  }
  setActiveLink();   // gọi lại để tô sáng mục con vừa render
}

function bindSearch() {
  const form = document.querySelector('#search-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.querySelector('#search-input').value.trim();
    location.hash = q ? `#/products?q=${encodeURIComponent(q)}` : '#/products';
  });
}

let hashBound = false;

export function mountHeader(selector = '#header') {
  const el = document.querySelector(selector);
  if (!el) return;

  el.innerHTML = Header();
  bindSearch();
  setActiveLink();
  loadCategoryMenu();

  if (!hashBound) {
    window.addEventListener('hashchange', setActiveLink);
    hashBound = true;
  }
}