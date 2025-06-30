
// Mock authentication service - In production, this would connect to your backend API
export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'organizer' | 'attendee';
  };
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user validation
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@eventhub.com', password: 'admin123', role: 'admin' as const },
      { id: '2', name: 'Event Organizer', email: 'organizer@eventhub.com', password: 'org123', role: 'organizer' as const },
      { id: '3', name: 'John Attendee', email: 'attendee@eventhub.com', password: 'att123', role: 'attendee' as const },
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: `mock-jwt-token-${user.id}`
    };
  },

  async signup(name: string, email: string, password: string, role: string): Promise<LoginResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would validate email uniqueness and create user in database
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'admin' | 'organizer' | 'attendee'
    };

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`
    };
  },

  async verifyToken(token: string) {
    // Simulate token verification
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract user ID from mock token
    const userId = token.split('-').pop();
    const mockUsers = [
      { id: '1', name: 'Admin User', email: 'admin@eventhub.com', role: 'admin' as const },
      { id: '2', name: 'Event Organizer', email: 'organizer@eventhub.com', role: 'organizer' as const },
      { id: '3', name: 'John Attendee', email: 'attendee@eventhub.com', role: 'attendee' as const },
    ];

    return mockUsers.find(u => u.id === userId) || null;
  }
};
