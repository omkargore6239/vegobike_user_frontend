class MockApiService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  async request(endpoint, options = {}) {
    // Simulate network delay
    await this.delay(300);

    try {
      const body = options.body ? JSON.parse(options.body) : {};

      if (endpoint.includes('/auth/login')) {
        return this.mockLogin(body);
      }

      if (endpoint.includes('/auth/register')) {
        return this.mockRegister(body);
      }

      if (endpoint.includes('/bikes')) {
        return this.mockGetBikes();
      }

      if (endpoint.includes('/bookings')) {
        return this.mockBookings();
      }

      if (endpoint.includes('/services')) {
        return this.mockServices();
      }

      if (endpoint.includes('/spare-parts')) {
        return this.mockSpareParts();
      }

      if (endpoint.includes('/listings')) {
        return this.mockListings();
      }

      // Default success response
      return { success: true, message: 'Operation successful' };
    } catch (error) {
      throw new Error(error.message || 'API request failed');
    }
  }

  mockLogin(credentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return {
      success: true,
      user: {
        id: Date.now(),
        email: credentials.email.toLowerCase(),
        name: credentials.name || credentials.email.split('@')[0],
        phone: credentials.phone || '',
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  }

  mockRegister(userData) {
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Name, email and password are required');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return {
      success: true,
      user: {
        id: Date.now(),
        email: userData.email.toLowerCase(),
        name: userData.name.trim(),
        phone: userData.phone || '',
        token: 'mock-jwt-token-' + Date.now()
      }
    };
  }

  mockGetBikes() {
    return {
      success: true,
      data: [
        {
          id: 1,
          name: 'Honda Activa 6G',
          brand: 'Honda',
          type: 'Scooter',
          price: 800,
          available: true,
          location: 'Mumbai',
          rating: 4.5,
          features: ['110cc Engine', 'CBS', 'LED Headlight', 'Mobile Charging']
        },
        {
          id: 2,
          name: 'Yamaha FZ-S V3',
          brand: 'Yamaha',
          type: 'Motorcycle',
          price: 1200,
          available: true,
          location: 'Delhi',
          rating: 4.7,
          features: ['149cc Engine', 'ABS', 'LED Lights', 'Digital Console']
        }
      ]
    };
  }

  mockBookings() {
    return {
      success: true,
      data: []
    };
  }

  mockServices() {
    return {
      success: true,
      data: [
        {
          id: 1,
          name: 'General Service',
          description: 'Complete bike maintenance',
          price: 299,
          duration: '2 hours',
          category: 'Maintenance'
        }
      ]
    };
  }

  mockSpareParts() {
    return {
      success: true,
      data: []
    };
  }

  mockListings() {
    return {
      success: true,
      data: []
    };
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
