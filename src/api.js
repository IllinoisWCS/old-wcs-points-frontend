import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://points-api.illinoiswcs.org',
  // baseURL: 'http://127.0.0.1:3000/', // TODO: remove
  withCredentials: true,
});

instance.interceptors.response.use(undefined, (err) => {
  if (err.response.status === 401) {
    window.location.href = `${instance.defaults.baseURL}/auth/login`;
  }

  return Promise.reject(err);
});

export default instance;
