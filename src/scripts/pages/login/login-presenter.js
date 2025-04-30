import Api from "../../data/api";

class LoginPresenter {
  constructor() {
    this.init();
  }
  async init() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await Api.login(email, password);
      if (!response.error) {
        alert('Login berhasil!');
        localStorage.setItem('token', response.loginResult.token);
        localStorage.setItem('name', response.loginResult.name);
        window.location.hash = '#/';
      } else {
        alert('❌ ' + response.message);
      }
    });
  }
};

export default LoginPresenter;
