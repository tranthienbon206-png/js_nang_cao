export function ContactView() {
  return `
    <h1 class="fw-bold mb-4">Liên hệ</h1>

    <div class="row g-4 mb-5">
      <!-- Thông tin -->
      <div class="col-lg-5">
        <div class="bg-white rounded-3 shadow-sm p-4 h-100">
          <h2 class="h5 fw-bold mb-3">Thông tin cửa hàng</h2>
          <ul class="list-unstyled mb-4">
            <li class="mb-3"><i class="bi bi-geo-alt-fill text-primary me-2"></i>Cần Thơ, Việt Nam</li>
            <li class="mb-3"><i class="bi bi-telephone-fill text-primary me-2"></i>1900 1234</li>
            <li class="mb-3"><i class="bi bi-envelope-fill text-primary me-2"></i>support@jsmvcshop.vn</li>
            <li><i class="bi bi-clock-fill text-primary me-2"></i>8:00 - 21:00 (Thứ 2 - Chủ nhật)</li>
          </ul>
          <div class="fs-4 d-flex gap-3">
            <a href="#"><i class="bi bi-facebook"></i></a>
            <a href="#"><i class="bi bi-youtube"></i></a>
            <a href="#"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="col-lg-7">
        <form id="contact-form" class="bg-white rounded-3 shadow-sm p-4" novalidate>
          <h2 class="h5 fw-bold mb-3">Gửi tin nhắn cho chúng tôi</h2>
          <div id="contact-alert"></div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Họ tên *</label>
              <input name="name" class="form-control" required>
              <div class="invalid-feedback">Vui lòng nhập họ tên.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Email *</label>
              <input name="email" type="email" class="form-control" required>
              <div class="invalid-feedback">Email không hợp lệ.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại</label>
              <input name="phone" class="form-control" pattern="[0-9]{9,11}">
              <div class="invalid-feedback">Số điện thoại gồm 9-11 chữ số.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Chủ đề</label>
              <select name="subject" class="form-select">
                <option>Tư vấn mua hàng</option>
                <option>Bảo hành</option>
                <option>Khiếu nại</option>
                <option>Khác</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label">Nội dung *</label>
              <textarea name="message" rows="5" class="form-control" required minlength="10"></textarea>
              <div class="invalid-feedback">Nội dung tối thiểu 10 ký tự.</div>
            </div>
            <div class="col-12">
              <button class="btn btn-primary px-4" type="submit">
                <i class="bi bi-send me-1"></i>Gửi liên hệ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Bản đồ -->
    <div class="ratio ratio-21x9 rounded-3 overflow-hidden shadow-sm mb-5">
      <iframe src="https://www.google.com/maps?q=Can+Tho,+Vietnam&output=embed"
              loading="lazy" style="border:0" allowfullscreen></iframe>
    </div>
  `;
}