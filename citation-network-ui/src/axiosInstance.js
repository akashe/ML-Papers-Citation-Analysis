import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.BACKEND_URL,
});

export default axiosInstance;
