// Fallback để tránh lỗi undefined
// Production: phải có REACT_APP_API_URL trong environment
// Local: fallback tới localhost
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://duotask-api.onrender.com'  // fallback production
    : 'http://localhost:5000');             // fallback local

export default API_URL;
