import { ContactView } from '../views/ContactView.js';

export default class ContactController {
  index() {
    document.querySelector('#app').innerHTML = ContactView();
    this.bindForm();
  }

  bindForm() {
    const form = document.querySelector('#contact-form');
    const alertBox = document.querySelector('#contact-alert');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const data = Object.fromEntries(new FormData(form));
      data.createdAt = new Date().toISOString();

      try {
        const res = await fetch('http://localhost:3000/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();

        alertBox.innerHTML = `<div class="alert alert-success">Gửi thành công! Chúng tôi sẽ phản hồi sớm.</div>`;
        form.reset();
        form.classList.remove('was-validated');
      } catch {
        alertBox.innerHTML = `<div class="alert alert-danger">Gửi thất bại, vui lòng thử lại.</div>`;
      }
    });
  }
}