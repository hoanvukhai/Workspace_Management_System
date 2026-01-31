// API URL - Hardcoded cho Production
// Local: http://localhost:5000
// Production: https://duotask-api.onrender.com

let API_URL;

if (process.env.NODE_ENV === 'development') {
  // Development - use localhost
  API_URL = 'http://localhost:5000';
  console.log('🔧 Development mode - Using localhost:5000');
} else {
  // Production - use Render backend
  API_URL = 'https://duotask-api.onrender.com';
  console.log('🚀 Production mode - Using Render backend:', API_URL);
}

// Debug log
console.log('📡 API_URL:', API_URL);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);

export default API_URL;
