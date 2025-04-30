import LoginPresenter from "./login-presenter";

class LoginPage {
  async render() {
    return `
      <div class="form-container">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email</label>
          <input type="email" id="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" required />

          <button type="submit">Login</button>
        </form>
        <p class="link-text">Belum punya akun? <a href="#/register">Daftar sekarang</a></p>
      </div>
    `;
  }

  async afterRender() {
    new LoginPresenter();
  }
};

export default LoginPage;
