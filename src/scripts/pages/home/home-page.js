import HomePresenter from "./home-presenter";

class HomePage {
  async render() {
    return `
      <section class="container">
        <h2 class="welcome">Daftar Story</h2>

        <div id="homeMap" style="height: 300px; margin-bottom: 20px;"></div>
        <div id="storyList" class="story-grid"></div>

        
      </section>
    `;
  }

  async afterRender() {
    new HomePresenter();
  }
}

export default HomePage;
