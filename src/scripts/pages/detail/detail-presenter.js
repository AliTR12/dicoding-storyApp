import Api from "../../data/api.js";
import Database from "../../data/database.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import { showLoadingAlert, showSuccessAlert, hideLoadingAlert, showErrorAlert } from "../../utils/alerts.js";

const L = window.L;
const customIcon = L.icon({
  iconUrl: "./images/icon-map.png",
  iconSize: [45, 51],
  iconAnchor: [22, 41],
  popupAnchor: [1, -34],
});

class DetailPresenter {
  async init() {
    const { id } = parseActivePathname();
    
    // Tampilkan loading alert
    showLoadingAlert("Mengambil data cerita...");

    try {
      const result = await Api.getStoryDetail(id);
      const mapContainer = document.getElementById("storyMapContainer");
      const container = document.getElementById("detailContainer");
      
      if (result.error) {
        hideLoadingAlert();
        showErrorAlert(`❌ ${result.message}`);
        container.innerHTML = `<p>❌ ${result.message}</p>`;
        return;
      }

      const story = result.story;
      const { lat, lon, name, description } = story;

      // Map
      if (lat && lon) {
        mapContainer.style.display = "block";
        const mapEl = document.getElementById("storyMap");
        if (mapEl?._leaflet_id != null) mapEl._leaflet_id = null;

        const map = L.map("storyMap").setView([lat, lon], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        map.dragging.enable();
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
        L.marker([lat, lon], { icon: customIcon }).addTo(map).bindPopup(`<strong>${name}</strong><br>${description}`);
      }

      // Dapatkan nama kota dari koordinat
      const locationText = await this.getCityFromCoords(lat, lon);
      
      // IndexedDB
      const isSaved = await Database.isStorySaved(id);
      const saveButton = `<button id="story-detail-save" class="btn btn-transparent">${isSaved ? 'Buang cerita <i class="fas fa-trash"></i>' : 'Simpan cerita <i class="far fa-bookmark"></i>'}</button>`;

      // Render detail story
      container.innerHTML = `
        <div class="story-card">
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" />
          <div class="story-content">
            <h3 class="story-name">${story.name}</h3>
            <p class="story-caption">${story.description}</p>
            <small>Created at: ${new Date(story.createdAt).toLocaleString()}</small>
            <p>Lokasi: ${locationText}</p>
          </div>        
          ${saveButton}
        </div>
      `;

      // Tambahkan event listener untuk tombol bookmark
      const saveBtnEl = document.getElementById("story-detail-save");
      saveBtnEl.addEventListener("click", async () => {
        try {
          if (await Database.isStorySaved(id)) {
            await Database.deleteStory(id);
            showSuccessAlert("✅ Cerita dibuang dari bookmark!");
          } else {
            await Database.putStory(story);
            showSuccessAlert("✅ Cerita disimpan ke bookmark!");
          }
          // Refresh detail untuk update tombol
          this.init();
        } catch (error) {
          showErrorAlert("❌ Gagal memperbarui bookmark!");
          console.error(error);
        }
      });

      hideLoadingAlert(); // Sembunyikan loading alert setelah data berhasil diambil
    } catch (error) {
      hideLoadingAlert();
      showErrorAlert("❌ Gagal mengambil data cerita!");
      console.error(error);
    }
  }

  async getCityFromCoords(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        headers: {
          "User-Agent": "starter-project-with-webpack/1.0 (your-email@example.com)",
          "Accept-Language": "id",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (!data.address) {
        return "Lokasi tidak diketahui";
      }

      return data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || data.address.state || data.address.country || "Lokasi tidak diketahui";
    } catch (error) {
      console.error("Failed to fetch city from coordinates:", error);
      return "Lokasi tidak diketahui";
    }
  }
}

export default DetailPresenter;
