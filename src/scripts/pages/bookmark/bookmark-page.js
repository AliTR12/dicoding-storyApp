import BookmarkPresenter from './bookmark-presenter.js';

class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h2 class="welcome">Bookmark Story</h2>

        <div id="bookmarkMap" style="height: 300px; margin-bottom: 20px;"></div>
        <div id="bookmarkList" class="story-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    new BookmarkPresenter();
  }
}

export default BookmarkPage;
