import Api from "../../data/api";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, hideLoadingAlert } from "../../utils/alerts";

class LoginPresenter {
  constructor() {
    this.init();
  }
  async init() {
    showLoadingAlert();
    try {
      const form = document.getElementById('loginForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoadingAlert();
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        const response = await Api.login(email, password);
        if (!response.error) {
          hideLoadingAlert();
          showSuccessAlert('Login berhasil!');
          localStorage.setItem('token', response.loginResult.token);
          localStorage.setItem('name', response.loginResult.name);
          window.location.hash = '#/';
        } else {
          showErrorAlert('❌ ' + response.message);
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      showErrorAlert('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      hideLoadingAlert();
    }   
  } 
};

export default LoginPresenter;
