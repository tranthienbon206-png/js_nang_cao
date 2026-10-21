// Lớp bọc Fetch API dùng chung cho mọi Model (async/await + xử lý lỗi)
export const API_URL = 'http://localhost:3000';

export default class Api {
  static async request(endpoint, options = {}) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
    return res.status === 204 ? null : res.json();
  }

  static get(endpoint) { return this.request(endpoint); }
  static post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
  static put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
  static patch(endpoint, data) { return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }); }
  static delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}
