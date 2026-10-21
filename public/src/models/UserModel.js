import BaseModel from './BaseModel.js';
import Storage from '../utils/storage.js';

const KEY = 'currentUser';

class UserModel extends BaseModel {
  constructor() { super('users'); }

  async login(username, password) {
    const users = await this.getAll(`?username=${encodeURIComponent(username)}`);
    const user = users.find(u => u.password === password);
    if (!user) throw new Error('Sai tên đăng nhập hoặc mật khẩu');
    const { password: _, ...safeUser } = user; // destructuring + rest: bỏ password
    Storage.set(KEY, safeUser);
    return safeUser;
  }

  async register(data) {
    const exists = await this.getAll(`?username=${encodeURIComponent(data.username)}`);
    if (exists.length) throw new Error('Tên đăng nhập đã tồn tại');
    return this.create({ ...data, role: 'user' });
  }

  logout() { Storage.remove(KEY); }
  current() { return Storage.get(KEY); }
  isAdmin() { return this.current()?.role === 'admin'; }
}

export default new UserModel();
