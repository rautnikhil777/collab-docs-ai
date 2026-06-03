import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: backendUrl
});

export function withUserHeaders(config, userEmail) {
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      'x-user-email': userEmail
    }
  };
}

