import Api from '../core/Api.js';

// Model cha: CRUD chung cho 1 resource của json-server. Model con chỉ cần kế thừa (extends).
export default class BaseModel {
  constructor(resource) {
    this.resource = resource; // vd: 'products'
  }

  getAll(query = '') { return Api.get(`${this.resource}${query}`); }
  getById(id) { return Api.get(`${this.resource}/${id}`); }
  create(data) { return Api.post(this.resource, data); }
  update(id, data) { return Api.put(`${this.resource}/${id}`, data); }
  remove(id) { return Api.delete(`${this.resource}/${id}`); }
}
