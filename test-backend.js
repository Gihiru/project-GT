// Simple test to check if backend routes are working
import axios from 'axios';

const testBackend = async () => {
  try {
    // Test basic API
    const response = await axios.get('http://localhost:4000/');
    console.log('Backend basic test:', response.data);
    
    // Test user routes exist
    const routes = [
      'http://localhost:4000/api/user/register',
      'http://localhost:4000/api/user/login', 
      'http://localhost:4000/api/user/profile'
    ];
    
    for (const route of routes) {
      try {
        await axios.post(route, {});
      } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          console.log(`✅ Route exists: ${route}`);
        } else if (error.response?.status === 404) {
          console.log(`❌ Route not found: ${route}`);
        } else {
          console.log(`⚠️ Route error: ${route} - ${error.response?.status}`);
        }
      }
    }
  } catch (error) {
    console.log('Backend connection failed:', error.message);
  }
};

testBackend();