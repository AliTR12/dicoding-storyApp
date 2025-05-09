// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import Camera from "./utils/camera";
import { registerServiceWorker } from "./utils";
import { showConfirmationAlert, showSuccessAlert, showLoadingAlert, hideLoadingAlert } from "./utils/alerts";

document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      showConfirmationAlert(
        "Yakin ingin logout?",
        () => {
          showLoadingAlert();
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          hideLoadingAlert();
          showSuccessAlert("Anda telah keluar dari aplikasi.");
          window.location.hash = "#/login";
        },
        () => {
          console.log("Logout dibatalkan.");
        }
      );
    });
  }

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});