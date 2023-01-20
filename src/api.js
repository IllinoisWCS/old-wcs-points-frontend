import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://points-api.illinoiswcs.org',
  withCredentials: true,
});

instance.interceptors.response.use(undefined, (err) => {
  if (err.response.status === 401) {
    window.location.href = `${instance.defaults.baseURL}/auth/login`;
  }

  return Promise.reject(err);
});

export default instance;
