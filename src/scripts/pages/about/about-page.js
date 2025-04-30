export default class AboutPage {
  async render() {
    return `
           <section class="container">
  <h1>Tentang Aplikasi</h1>
  <p>Aplikasi ini dibuat untuk submission Dicoding, menampilkan cerita pengguna dengan lokasi dan foto di peta interaktif.</p>
  <p>Dibuat oleh: <strong>Ali Tawfiqur Rahman</strong></p>
  <p>Email: <a href="mailto:alitawfiqurrahman@gmail.com">alitawfiqurrahman@gmail.com</a></p>
</section>
    
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
