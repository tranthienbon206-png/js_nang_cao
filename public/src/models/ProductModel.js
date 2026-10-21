import BaseModel from './BaseModel.js';

class ProductModel extends BaseModel {
  constructor() { super('products'); }

  // Lọc / tìm kiếm / sắp xếp dùng query của json-server 0.17
  search({ keyword = '', categoryId = '', sort = '' } = {}) {
    const params = new URLSearchParams();
    if (keyword) params.set('name_like', keyword);
    if (categoryId) params.set('categoryId', categoryId);
    if (sort) {
      const [field, order] = sort.split('-'); // 'price-asc'
      params.set('_sort', field);
      params.set('_order', order);
    }
    const qs = params.toString();
    return this.getAll(qs ? `?${qs}` : '');
  }
}

// Xuất 1 instance dùng chung (singleton)
export default new ProductModel();
