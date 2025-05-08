import { getAccessToken } from "./auth";

export function renderNavBasedOnAuth() {
  const token = getAccessToken();
  const show = (selector, visible) => {
      document.querySelectorAll(selector).forEach((el) => {
          el.classList.toggle("hidden", !visible);
      });
  };

  // Hide or show elements based on auth state
  show(".auth-only", !token);
  show(".user-only", !!token);
}
  