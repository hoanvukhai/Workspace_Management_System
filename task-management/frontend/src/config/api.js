// API URL từ environment variables
// Nếu không set, fallback để avoid localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://duotask-api.onrender.com';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ REACT_APP_API_URL is not set! Using fallback backend URL');
}

export default API_URL;
