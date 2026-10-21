import ContactModel from '../../models/ContactModel.js';
import ContactAdminView from '../../views/admin/ContactAdminView.js';

export default class ContactAdminController {
  constructor() {
    this.view = new ContactAdminView();
  }

  async index() {
    try {
      this.view.showLoading();

      const contacts = await ContactModel.getAll();

      contacts.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      this.view.renderList(contacts);
      this.view.bindSearch(contacts);

      this.view.bindDetail(id => {
        location.hash = `#/admin/contacts/${id}`;
      });

      this.view.bindDelete(async id => {
        try {
          await ContactModel.remove(id);
          await this.index();
        } catch (err) {
          alert(err.message || 'Không thể xóa liên hệ');
        }
      });
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải danh sách liên hệ');
    }
  }

  async detail({ id }) {
    try {
      this.view.showLoading();

      const contact = await ContactModel.getById(id);
      if (!contact) throw new Error('Không tìm thấy liên hệ');

      this.view.renderDetail(contact);

      this.view.bindStatusSubmit(status =>
        this.updateStatus(contact, status)
      );

      this.view.bindDelete(async contactId => {
        try {
          await ContactModel.remove(contactId);
          alert('Đã xóa liên hệ');
          location.hash = '#/admin/contacts';
        } catch (err) {
          alert(err.message || 'Không thể xóa liên hệ');
        }
      });
    } catch (err) {
      this.view.showError(err.message || 'Không thể tải chi tiết liên hệ');
    }
  }

  async updateStatus(contact, status) {
    if (!['new', 'resolved'].includes(status)) {
      alert('Trạng thái không hợp lệ');
      return;
    }

    try {
      await ContactModel.update(contact.id, {
        ...contact,
        status
      });

      alert('Cập nhật trạng thái liên hệ thành công');
      location.hash = `#/admin/contacts/${contact.id}`;
    } catch (err) {
      alert(err.message || 'Không thể cập nhật trạng thái liên hệ');
    }
  }
}