import Database from "../../data/database.js";
import { showLoadingAlert, hideLoadingAlert, showSuccessAlert, showErrorAlert } from "../../utils/alerts.js";

const L = window.L;
const customIcon = L.icon({
  iconUrl: "./images/icon-map.png",
  iconSize: [45, 51],
  iconAnchor: [22, 44],
  popupAnchor: [1, -34],
});

class BookmarkPresenter {
  constructor() {
    this.bookmarkListContainer = document.getElementById("bookmarkList");
    this.renderBookmarks();
  }

  async renderBookmarks() {
    // Tampilkan loading alert saat fetch data
    showLoadingAlert("Mengambil data bookmark...");

    try {
      const stories = await Database.getAllStories();
      
      if (stories.length === 0) {
        this.bookmarkListContainer.innerHTML = `<p>🔖 Tidak ada cerita yang disimpan</p>`;
        hideLoadingAlert();
        return;
      }

      // Inisialisasi map
      const mapContainer = document.getElementById("bookmarkMap");
      if (mapContainer?._leaflet_id != null) {
        mapContainer._leaflet_id = null;
      }
      const map = L.map("bookmarkMap").setView([-7.0, 110.0], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      map.dragging.enable();
      setTimeout(() => {
        map.invalidateSize();
      }, 300);

      // Tambahkan marker
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon], { icon: customIcon }).addTo(map);
          marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        }
      });

      // Render cards
      const storyCards = stories
        .map((story) => this.createStoryCard(story))
        .join("");
      this.bookmarkListContainer.innerHTML = storyCards;

      // Tambahkan event listener untuk setiap card
      this.bookmarkListContainer.querySelectorAll(".story-card").forEach((card) => {
        card.addEventListener("click", (event) => {
          const storyId = card.getAttribute("data-story-id");
          showLoadingAlert("Membuka detail cerita...");
          setTimeout(() => {
            window.location.hash = `#/detail/${storyId}`;
            hideLoadingAlert();
          }, 500); // delay biar loading alert sempat muncul
        });
      });

      hideLoadingAlert();
    } catch (error) {
      console.error("Gagal mengambil data bookmark:", error);
      showErrorAlert("❌ Gagal mengambil data bookmark!");
      hideLoadingAlert();
    }
  }

  createStoryCard(story) {
    return `
      <div class="story-card" tabindex="0" data-story-id="${story.id}">
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" />
        <div class="story-content">
          <h3 class="story-name">${story.name}</h3>
          <p class="story-caption">${story.description}</p>
          <button class="btn"> Selengkapnya </button>
        </div>
      </div>
    `;
  }
}

export default BookmarkPresenter;
