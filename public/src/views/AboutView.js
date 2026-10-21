export function AboutView() {
  return `
    <!-- Hero -->
    <section class="text-center py-5 mb-4 bg-white rounded-3 shadow-sm">
      <h1 class="fw-bold">Về <span class="text-primary">TTD Shop</span></h1>
      <p class="lead text-muted mb-0">
        Chuyên cung cấp laptop, PC gaming, linh kiện và phụ kiện chính hãng.
      </p>
    </section>

    <!-- Câu chuyện -->
    <section class="row align-items-center g-4 mb-5">
      <div class="col-md-6">
        <img src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800"
             class="img-fluid rounded-3 shadow-sm" alt="Cửa hàng">
      </div>
      <div class="col-md-6">
        <h2 class="h3 fw-bold">Câu chuyện của chúng tôi</h2>
        <p>TTD Shop được thành lập với mong muốn mang đến cho game thủ, sinh viên và dân văn phòng những cấu hình máy tính tốt nhất với mức giá hợp lý.</p>
        <p>Chúng tôi cam kết sản phẩm chính hãng, tư vấn đúng nhu cầu và hỗ trợ kỹ thuật tận tâm sau bán hàng.</p>
        <a href="#/products" class="btn btn-primary">Xem sản phẩm</a>
      </div>
    </section>

    <!-- Số liệu -->
    <section class="row text-center g-3 mb-5">
      ${[
        ['10+', 'Năm kinh nghiệm'],
        ['50.000+', 'Khách hàng'],
        ['1.000+', 'Sản phẩm'],
        ['63', 'Tỉnh thành giao hàng'],
      ].map(([num, label]) => `
        <div class="col-6 col-md-3">
          <div class="bg-white rounded-3 shadow-sm p-4 h-100">
            <div class="display-6 fw-bold text-primary">${num}</div>
            <div class="text-muted">${label}</div>
          </div>
        </div>`).join('')}
    </section>

    <!-- Vì sao chọn chúng tôi -->
    <section class="mb-5">
      <h2 class="h3 fw-bold text-center mb-4">Vì sao chọn chúng tôi?</h2>
      <div class="row g-4">
        ${[
          ['bi-shield-check', 'Chính hãng 100%', 'Nguồn hàng rõ ràng, đầy đủ hóa đơn, bảo hành theo hãng.'],
          ['bi-truck', 'Giao hàng nhanh', 'Giao toàn quốc, miễn phí cho đơn từ 5.000.000đ.'],
          ['bi-headset', 'Hỗ trợ 24/7', 'Đội ngũ kỹ thuật sẵn sàng tư vấn và xử lý sự cố.'],
          ['bi-arrow-repeat', 'Đổi trả dễ dàng', 'Đổi trả trong 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất.'],
        ].map(([icon, title, desc]) => `
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 text-center p-3">
              <i class="bi ${icon} display-5 text-primary mb-2"></i>
              <h3 class="h6 fw-bold">${title}</h3>
              <p class="small text-muted mb-0">${desc}</p>
            </div>
          </div>`).join('')}
      </div>
    </section>

    <!-- CTA -->
    <section class="text-center bg-primary text-white rounded-3 p-5">
      <h2 class="h4 fw-bold">Cần tư vấn cấu hình?</h2>
      <p>Liên hệ ngay để được hỗ trợ miễn phí.</p>
      <a href="#/contact" class="btn btn-light">Liên hệ chúng tôi</a>
    </section>
  `;
}