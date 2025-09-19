import { mockApiService } from './mockApi';

// Use mock API service for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.useMock = true; // Set to false when you have a real backend
  }

  async request(endpoint, options = {}) {
    // Use mock API for demo
    if (this.useMock) {
      return mockApiService.request(endpoint, options);
    }

    // Real API implementation (for future use)
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Rental endpoints
  async getBikes(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/bikes${queryParams ? `?${queryParams}` : ''}`);
  }

  async getBike(id) {
    return this.request(`/bikes/${id}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
