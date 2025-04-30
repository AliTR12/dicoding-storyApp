import Api from '../../data/api.js';
import { parseActivePathname } from '../../routes/url-parser.js';
const L = window.L;
const customIcon = L.icon({
  iconUrl: './images/icon-map.png', // path dari root public folder
  iconSize: [45, 51], // default size Leaflet
  iconAnchor: [22, 41], // posisi titik (ujung bawah)
  popupAnchor: [1, -34],
  // shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  // shadowSize: [41, 41],
});


class DetailPresenter {
  async init() {
    const { id } = parseActivePathname();
    const result = await Api.getStoryDetail(id);

    const container = document.getElementById('detailContainer');
    if (result.error) {
      container.innerHTML = `<p>❌ ${result.message}</p>`;
      return;
    }

    const story = result.story;
    
    const { lat, lon, name, description } = story;

// Map
if (lat && lon) {
  const mapEl = document.getElementById("storyMap");
  if (mapEl?._leaflet_id != null) mapEl._leaflet_id = null;

  const map = L.map("storyMap").setView([lat, lon], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  setTimeout(() => {
    map.invalidateSize();
  }, 300);
  L.marker([lat, lon], { icon: customIcon}).addTo(map).bindPopup(`<strong>${name}</strong><br>${description}`);
}

async function getCityFromCoords(lat, lon) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await res.json();

  if (!data.address) {
    return 'Lokasi tidak diketahui';
  }

  return (
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.suburb ||
    data.address.county ||
    data.address.state ||
    data.address.country ||
    'Lokasi tidak diketahui'
  );
}


  // render map dan marker  
  const locationText = await getCityFromCoords(lat, lon);



    container.innerHTML = `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" />
        <div class="story-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>Created at: ${new Date(story.createdAt).toLocaleString()}</small>
          <p>Lokasi: ${locationText}</p>
        </div>
      </div>
    `;
  }
}

export default DetailPresenter;
