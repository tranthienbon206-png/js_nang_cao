import BaseModel from './BaseModel.js';

class OrderModel extends BaseModel {
  constructor() { super('orders'); }
}

export default new OrderModel();
