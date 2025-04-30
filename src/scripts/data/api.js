import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};


const Api = {
  async register(name, email, password) {
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async getStories() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.STORIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async getStoryDetail(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async addStory({ description, photo, lat = null, lon = null }) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat) formData.append('lat', lat);
      if (lon) formData.append('lon', lon);

      const response = await fetch(ENDPOINTS.STORIES, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async addGuestStory({ description, photo, lat = null, lon = null }) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat) formData.append('lat', lat);
      if (lon) formData.append('lon', lon);
  
      const response = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },
  

  async subscribeNotif(subscription) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  async unsubscribeNotif(endpoint) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(ENDPOINTS.SUBSCRIBE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  },
};

export default Api;

