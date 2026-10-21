import BaseView from '../BaseView.js';
import { formatPrice, escapeHtml } from '../../utils/helpers.js';

export default class ProductAdminView extends BaseView {
  renderList(products, categories) {
    const catName = id => categories.find(c => c.id === Number(id))?.name ?? '';
    this.renderAdminPage({
      title: 'Sản phẩm',
      description: 'Theo dõi thông tin, giá bán và danh mục sản phẩm.',
      action: '<a class="btn btn-primary" href="#/admin/products/add"><i class="bi bi-plus-lg me-2" aria-hidden="true"></i>Thêm sản phẩm</a>',
      content: `
        <div class="table-responsive admin-table-wrap">
          <table class="table table-hover align-middle admin-data-table">
            <thead>
              <tr><th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Giá</th><th>Danh mục</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${products.length ? products.map(p => `
                <tr>
                  <td class="text-muted">#${p.id}</td>
                  <td><img class="admin-product-thumb" src="${escapeHtml(p.image ?? '')}" alt="${escapeHtml(p.name ?? '')}"></td>
                  <td class="fw-semibold">${escapeHtml(p.name ?? '')}</td>
                  <td class="text-nowrap fw-semibold">${formatPrice(p.price)}</td>
                  <td>${escapeHtml(catName(p.categoryId))}</td>
                  <td class="text-nowrap">
                    <a class="btn btn-sm btn-outline-primary" href="#/admin/products/edit/${p.id}">Sửa</a>
                    <button class="btn btn-sm btn-outline-danger" data-delete="${p.id}">Xóa</button>
                  </td>
                </tr>`).join('') : '<tr><td colspan="6"><div class="admin-empty-state">Chưa có sản phẩm nào.</div></td></tr>'}
            </tbody>
          </table>
        </div>
        <div class="admin-table-footer">Tổng cộng <strong>${products.length}</strong> sản phẩm</div>
      `
    });
  }

  // product = null -> form thêm; có product -> form sửa
  renderForm(categories, product = null) {
    const p = product ?? { name: '', price: '', image: '', categoryId: '', description: '' };
    this.setHTML(`
      <form id="product-form" class="form">
        <h2>${product ? 'Sửa' : 'Thêm'} sản phẩm</h2>
        <input name="name" placeholder="Tên sản phẩm" value="${escapeHtml(p.name)}"><small class="error" data-error="name"></small>
        <input name="price" type="number" placeholder="Giá" value="${p.price}"><small class="error" data-error="price"></small>
        <input name="image" placeholder="URL ảnh" value="${escapeHtml(p.image)}"><small class="error" data-error="image"></small>
        <select name="categoryId">
          <option value="">-- Chọn danh mục --</option>
          ${categories.map(c => `<option value="${c.id}" ${c.id === Number(p.categoryId) ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select><small class="error" data-error="categoryId"></small>
        <textarea name="description" rows="3" placeholder="Mô tả">${escapeHtml(p.description)}</textarea>
        <div><button class="btn">Lưu</button> <a class="btn btn-light" href="#/admin/products">Hủy</a></div>
      </form>
    `);
  }

  bindDelete(handler) {
    this.app.querySelector('table')?.addEventListener('click', e => {
      const id = e.target.dataset.delete;
      if (id && confirm('Xóa sản phẩm này?')) handler(Number(id));
    });
  }

  bindSubmit(handler) {
    const form = this.$('#product-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.getFormData(form));
    });
  }
}
