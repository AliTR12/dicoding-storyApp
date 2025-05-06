import { getAccessToken } from "./auth";

export function renderNavBasedOnAuth() {
    const token = getAccessToken();
    const show = (selector, visible) => {
      const el = document.querySelector(selector);
      if (el) el.style.display = visible ? "inline-block" : "none";
    };
  
    show('a[href="#/login"]', !token);
    show('a[href="#/register"]', !token);
    show('a[href="#/guest"]', !token);

    show('a[href="#/"]', !!token);
    show('a[href="#/about"]', !!token);
    show('a[href="#/new"]', !!token);
    show('#logout-btn', !!token);
  }
  