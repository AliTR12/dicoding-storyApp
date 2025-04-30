import RegisterPresenter from "./register-presenter";

class RegisterPage{
  async render() {
    return `
      <div class="form-container">
        <h2>Register</h2>
        <form id="registerForm">
          <label for="name">Nama</label>
          <input type="text" id="name" required />

          <label for="email">Email</label>
          <input type="email" id="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" required />

          <button type="submit">Daftar</button>
        </form>
        <p class="link-text">Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </div>
    `;
  }

  async afterRender() {
    new RegisterPresenter();
  }
};

export default RegisterPage;
