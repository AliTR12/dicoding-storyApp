import DetailPresenter from './detail-presenter.js';

class DetailPage {
  async render() {
    return `
      <section class="container">
      <h2>Detail Story</h2>
      <div id="storyMapContainer" style="display: none; margin-top: 20px;">
          <div id="storyMap" style="height: 300px;"></div>
        </div>
        <div id="detailContainer"></div>
        <div id="storyDetail"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new DetailPresenter();
    presenter.init();
  }
}

export default DetailPage;
