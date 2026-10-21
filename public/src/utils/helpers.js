// Định dạng tiền VNĐ
export const formatPrice = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';

// Chống XSS khi chèn dữ liệu người dùng vào innerHTML
export const escapeHtml = (str = '') =>
  String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Debounce cho ô tìm kiếm
export const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Validate form: rules = { field: [ [checkFn, message], ... ] }
export const validate = (data, rules) => {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    for (const [check, message] of checks) {
      if (!check(data[field], data)) { errors[field] = message; break; }
    }
  }
  return errors;
};

export const required = v => String(v ?? '').trim() !== '';
export const minLength = n => v => String(v ?? '').trim().length >= n;
export const positiveNumber = v => Number(v) > 0;
