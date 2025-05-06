import GuestPresenter from "./guest-presenter";

class GuestPage {
  async render() {
    return `
      <section class="container">
        <h2>Tambah Story</h2>

        <label>Ambil Lokasi</label>
<div id="map" style="height: 300px;"></div>
<p>Latitude: <span id="latDisplay"></span> | Longitude: <span id="lonDisplay"></span></p>

<form id="newStoryForm">
  <label for="description">Deskripsi</label>
  <textarea id="description" required></textarea>

  <label for="imageInput">Upload Gambar</label>
  <input type="file" id="imageInput" accept="image/*" />

  <button type="button" id="toggleCameraBtn">Buka/Tutup Kamera</button>
  <button type="button" id="captureBtn">Ambil Gambar</button>
  <select id="cameraSelect">Pilih Kamera</select>
  <video id="video" autoplay></video>
  <canvas id="canvas" style="display:none;"></canvas>
<img id="photoPreview" style="margin-top: 10px; border-radius: 8px; width: 100%;" />


  <button type="submit">Upload</button>
</form>

      </section>
    `;
  }

  async afterRender() {
    new GuestPresenter();
  }
}

export default GuestPage;
