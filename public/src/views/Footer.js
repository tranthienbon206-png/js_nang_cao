export function Footer() {
  return `
    <footer class="bg-dark text-white-50 pt-5 pb-3 mt-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <h5 class="text-white">TTD Shop</h5>
            <p class="small">Chuyên laptop, PC gaming, linh kiện và phụ kiện chính hãng. Bảo hành uy tín, giao hàng toàn quốc.</p>
            <div class="fs-5 d-flex gap-3">
              <a href="#" class="text-white-50"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-white-50"><i class="bi bi-youtube"></i></a>
              <a href="#" class="text-white-50"><i class="bi bi-tiktok"></i></a>
            </div>
          </div>

          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="text-white">Liên kết</h6>
            <ul class="list-unstyled small">
              <li><a class="text-white-50 text-decoration-none" href="#/">Trang chủ</a></li>
              <li><a class="text-white-50 text-decoration-none" href="#/products">Sản phẩm</a></li>
              <li><a class="text-white-50 text-decoration-none" href="#/about">Giới thiệu</a></li>
              <li><a class="text-white-50 text-decoration-none" href="#/contact">Liên hệ</a></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-6 col-6">
            <h6 class="text-white">Hỗ trợ</h6>
            <ul class="list-unstyled small">
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Thanh toán & giao hàng</li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-6">
            <h6 class="text-white">Liên hệ</h6>
            <ul class="list-unstyled small">
              <li><i class="bi bi-geo-alt me-2"></i>Cần Thơ, Việt Nam</li>
              <li><i class="bi bi-telephone me-2"></i>1900 1234</li>
              <li><i class="bi bi-envelope me-2"></i>support@jsmvcshop.vn</li>
            </ul>
          </div>
        </div>

        <hr class="border-secondary mt-4">
        <p class="text-center small mb-0">© 2026 TTD Shop</p>
      </div>
    </footer>
  `;
}

export function mountFooter(selector = '#footer') {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = Footer();
}