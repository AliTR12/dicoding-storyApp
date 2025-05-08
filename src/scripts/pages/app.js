import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { renderNavBasedOnAuth } from "../utils/ui";
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from "../templates";
import { isServiceWorkerAvailable } from "../utils";
import { subscribe, isCurrentPushSubscriptionAvailable, unsubscribe } from "../utils/notification-helper";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
    } else {
      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
      document.getElementById('subscribe-button').addEventListener('click', () => {
        subscribe().finally(() => {
          this.#setupPushNotification();
        });
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    console.log("💡 Route parsed:", url);
    const pageFactory = routes[url];
    const page =  await pageFactory();

    if (!page) {
      this.#content.innerHTML = `<h1>404 Halaman Tidak Ditemukan</h1>`;
      return;
    }
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await renderNavBasedOnAuth(this.#navigationDrawer);
        await page.afterRender();
        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      });
    }
    this.#content.innerHTML = await page.render();
    await renderNavBasedOnAuth(this.#navigationDrawer);
    await page.afterRender();

    if (isServiceWorkerAvailable()) {
      this.#setupPushNotification();
    }
  }
}

export default App;
