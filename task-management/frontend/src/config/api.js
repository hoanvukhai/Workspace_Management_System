// API URL từ environment variables
// Build timestamp: để force rebuild mỗi lần deploy
const BUILD_TIME = new Date().toISOString();

const API_URL = process.env.REACT_APP_API_URL || 'https://duotask-api.onrender.com';

console.log('🚀 API Config loaded at:', BUILD_TIME);
console.log('📡 API_URL:', API_URL);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ REACT_APP_API_URL is not set! Using fallback:', API_URL);
}

export default API_URL;
