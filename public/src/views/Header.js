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
        <a class="navbar-brand fw-bold text-primary" href="#/">
        TTD Shop
        </a>

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Menu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="#/">Trang chủ</a></li>
            <li class="nav-item"><a class="nav-link" href="#/products">Sản phẩm</a></li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">Danh mục</a>
              <ul class="dropdown-menu border-0 shadow">
                <li><a class="dropdown-item" href="#/products?category=laptop">Laptop</a></li>
                <li><a class="dropdown-item" href="#/products?category=pc">PC Gaming</a></li>
                <li><a class="dropdown-item" href="#/products?category=linh-kien">Linh kiện</a></li>
                <li><a class="dropdown-item" href="#/products?category=man-hinh">Màn hình</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#/products?category=phu-kien">Phụ kiện</a></li>
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

function setActiveLink() {
  const current = location.hash.split('?')[0] || '#/';
  document.querySelectorAll('#mainNav .nav-link[href]').forEach((a) => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === current);
  });
}

function bindSearch() {
  const form = document.querySelector('#search-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.querySelector('#search-input').value.trim();
    location.hash = q ? `#/products?q=${encodeURIComponent(q)}` : '#/products';
  });
}

export function mountHeader(selector = '#header') {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = Header();
  bindSearch();
  setActiveLink();
  window.addEventListener('hashchange', setActiveLink);
}