import Api from "../../data/api";

class RegisterPresenter {
    constructor() {
        this.init();
    }
  async init() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await Api.register(name, email, password);
      if (!response.error) {
        alert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
      } else {
        alert('❌ ' + response.message);
      }
    });
  }
};

export default RegisterPresenter;
