import Api from "../../data/api";
const L = window.L;
const customIcon = L.icon({
  iconUrl: './images/icon-map.png', // path dari root public folder
  iconSize: [45, 51], // default size Leaflet
  iconAnchor: [22, 44], // posisi titik (ujung bawah)
  popupAnchor: [1, -34],
  // shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  // shadowSize: [41, 41],
});


class HomePresenter {
  constructor() {
    this.storyListContainer = document.getElementById("storyList");
    this.renderStories();
  }

  async renderStories() {
    const result = await Api.getStories();

    if (result.error) {
      this.storyListContainer.innerHTML = `<p>❌ ${result.message}</p>`;
      return;
    }

    const stories = result.listStory;

    // Inisialisasi map
    const mapContainer = document.getElementById("homeMap");
    if (mapContainer?._leaflet_id != null) {
      mapContainer._leaflet_id = null;
    }
    const map = L.map("homeMap").setView([-7.0, 110.0], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
    

    // Tambah marker
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon], { icon: customIcon }).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });

    const storyCards = result.listStory.map((story) => this.createStoryCard(story)).join("");
    this.storyListContainer.innerHTML = storyCards;
  }

  createStoryCard(story) {
    return `
    <div class="story-card" tabindex="0" onclick="location.hash='#/detail/${story.id}'">
      <img src="${story.photoUrl}" alt="Foto dari ${story.name}" />
      <div class="story-content">
        <div class="story-name">${story.name}</div>
        <div class="story-caption">${story.description}</div>
      </div>
    </div>
  `;
  }
}

export default HomePresenter;
