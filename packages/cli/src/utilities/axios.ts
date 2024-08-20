import axios from 'axios';

// Intercept axios requests and add token to the request
axios.interceptors.request.use((axiosConfig) => {
  if (!axiosConfig.headers.Authorization) {
    if (process.env.TOKEN) {
      axiosConfig.headers.Authorization = `Bearer ${process.env.TOKEN}`;
    }
  }

  return axiosConfig;
});
