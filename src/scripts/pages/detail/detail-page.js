import DetailPresenter from './detail-presenter.js';

class DetailPage {
  async render() {
    return `
      <section class="container">
        <h2>Detail Story</h2>
        <div id="detailContainer"></div>
        <div id="storyDetail"></div>
        <div id="storyMap" style="height: 300px; margin-top: 20px;"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new DetailPresenter();
    presenter.init();
  }
}

export default DetailPage;
