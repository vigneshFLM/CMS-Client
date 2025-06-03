import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.60.76.132:5000/api',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
