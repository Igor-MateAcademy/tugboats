import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  validateStatus: (status: number) => status >= 200 && status < 500,
});
