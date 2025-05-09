export default class NotFoundPage {
  async render() {
    return `
      <div class="not-found">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
        <a href="#/" class="btn">Kembali ke Beranda</a>
      </div>
    `;
  }

  async afterRender() {
  }
};

