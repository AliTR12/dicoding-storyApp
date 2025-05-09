import Api from "../../data/api.js";
import Camera from "../../utils/camera.js";
import { showLoadingAlert, hideLoadingAlert, showSuccessAlert, showErrorAlert } from "../../utils/alerts.js";

const L = window.L;
const customIcon = L.icon({
  iconUrl: './images/icon-map.png', // path dari root public folder
  iconSize: [45, 51], // default size Leaflet
  iconAnchor: [22, 44], // posisi titik (ujung bawah)
  popupAnchor: [1, -34],
  // shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  // shadowSize: [41, 41],
});


class NewPresenter {
  constructor() {
    this.form = document.getElementById("newStoryForm");
    this.canvas = document.getElementById("canvas");
    this.imageInput = document.getElementById("imageInput");

    this.lat = null;
    this.lon = null;
    this.photoBlob = null;
    this.cameraIsOn = false;

    this._initEveryThing();
  }
  async _initEveryThing() {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.cameraSelect = document.getElementById("cameraSelect");

    this.camera = new Camera({
      video: this.video,
      cameraSelect: this.cameraSelect,
      canvas: this.canvas,
    });

    this.toggleCameraBtn = document.getElementById("toggleCameraBtn");
    this.captureBtn = document.getElementById("captureBtn");

    this.toggleCameraBtn.addEventListener("click", async () => {
      if (this.cameraIsOn) {
        this.camera.stop();
        this.cameraIsOn = false;
        this.video.style.display = "none";
      } else {
        await this.camera.launch();
        this.cameraIsOn = true;
        this.video.style.display = "block";
      }
    });

    this.imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this.photoBlob = file; // penting buat submit!
        const previewUrl = URL.createObjectURL(file);
        document.getElementById("photoPreview").src = previewUrl;
      }
    });

    this.captureBtn.addEventListener("click", async () => {
      if (!this.cameraIsOn) {
        alert("Kamera belum dinyalakan!");
        return;
      }
      this.photoBlob = await this.camera.takePicture();
      const previewUrl = URL.createObjectURL(this.photoBlob);
      document.getElementById("photoPreview").src = previewUrl;
      alert("📸 Foto berhasil diambil!");
    });

    this._initMap();
    this._initFormSubmit();
  }

  async _takePhotoAndSubmit() {
    const description = document.getElementById("description").value;

    const photo = await this.camera.capture();
    this.photoBlob = await fetch(photo).then((res) => res.blob());

    this.camera.stop();

    await this._submitToApi(description, this.photoBlob);
  }

  _initFormSubmit() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoadingAlert();

      const description = document.getElementById("description").value;
      const photo = this.photoBlob || this.imageInput.files[0];
      if (!photo) {
        alert("Pilih gambar atau ambil foto dulu!");
        return;
      }

      await this._submitToApi(description, photo);
    });
  }

  async _submitToApi(description, photo) {
    const result = await Api.addStory({
      description,
      photo,
      lat: this.lat,
      lon: this.lon,
    });
    hideLoadingAlert();
    if (!result.error) {
      showSuccessAlert("✅ Story berhasil ditambahkan!");
      setTimeout(() => {
        window.location.hash = "#/";
      }, 1500); // delay 1.5 detik biar alert sempat muncul
    } else {
      showErrorAlert("❌ " + result.message);
    }
  }

  _initMap() {
    setTimeout(() => {
      // Cek dan hapus map sebelumnya
      if (this._map && this._map.remove) {
        this._map.remove(); // Hancurkan instance map sebelumnya
      }
      if (document.getElementById('map')?._leaflet_id != null) {
        const mapContainer = document.getElementById('map');
        mapContainer._leaflet_id = null; // 🔥 RESET Paksa container biar bisa diinit ulang
      }
      
  
      this._map = L.map("map").setView([-7.0639, 110.9504], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this._map);
      this._map.dragging.enable();
      setTimeout(() => {
        this._map.invalidateSize();
      }, 300);
  
      let marker;
      this._map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        this.lat = lat;
        this.lon = lng;
  
        document.getElementById("latDisplay").textContent = lat.toFixed(5);
        document.getElementById("lonDisplay").textContent = lng.toFixed(5);
  
        if (marker) {
          marker.setLatLng([lat, lng], {icon: customIcon});
        } else {
          marker = L.marker([lat, lng], {icon: customIcon}).addTo(this._map);
        }
  
        this._map.invalidateSize();
      });
  
      // Kasih waktu redraw
      setTimeout(() => {
        this._map.invalidateSize();
      }, 200);
    }, 100);
  }  
}

export default NewPresenter;
