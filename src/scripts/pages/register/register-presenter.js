import Api from "../../data/api";
import { showLoadingAlert, hideLoadingAlert, showSuccessAlert, showErrorAlert } from "../../utils/alerts";

class RegisterPresenter {
    constructor() {
        this.init();
    }
  async init() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showLoadingAlert();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await Api.register(name, email, password);
      if (!response.error) {
        hideLoadingAlert();
        await showSuccessAlert('Registrasi berhasil! Silakan login.');
        window.location.hash = '#/login';
      } else {
        showErrorAlert('❌ ' + response.message);
      }
    });
  }
};

export default RegisterPresenter;
