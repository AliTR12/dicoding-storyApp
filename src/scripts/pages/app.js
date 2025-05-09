import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { renderNavBasedOnAuth } from "../utils/ui";
import { generateSubscribeButtonTemplate, generateUnsubscribeButtonTemplate } from "../templates";
import { isServiceWorkerAvailable } from "../utils";
import { subscribe, isCurrentPushSubscriptionAvailable, unsubscribe } from "../utils/notification-helper";
import { showLoadingAlert, showErrorAlert, showSuccessAlert, hideLoadingAlert } from "../utils/alerts";
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
    if (!pushNotificationTools) {
      return;
    }
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        showLoadingAlert();
        unsubscribe().finally(() => {
          this.#setupPushNotification();
          hideLoadingAlert();
        });
      });
    } else {
      pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
      document.getElementById('subscribe-button').addEventListener('click', () => {
        showLoadingAlert();
        subscribe().finally(() => {
          this.#setupPushNotification();
          hideLoadingAlert();
        });
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    console.log("💡 Route parsed:", url);
    let pageFactory = routes[url];

    // If no matching route, use catch-all '*' route if defined
    if (!pageFactory && routes['*']) {
      pageFactory = routes['*'];
    }

    const page = await pageFactory();

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await renderNavBasedOnAuth(this.#navigationDrawer);
        await page.afterRender();
        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      });
    } else {
      this.#content.innerHTML = await page.render();
      await renderNavBasedOnAuth(this.#navigationDrawer);
      await page.afterRender();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    }
  }
}

export default App;
