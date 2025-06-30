
// Mock event service - In production, this would connect to your backend API
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  registrationDeadline: string;
  maxAttendees: number;
  organizerId: string;
  organizerName: string;
  registeredCount: number;
  imageUrl?: string;
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'React.js Masterclass',
    description: 'Learn advanced React patterns and best practices from industry experts. This comprehensive workshop covers hooks, context, performance optimization, and modern React development.',
    date: '2024-07-15',
    time: '10:00 AM',
    venue: 'Tech Hub, Downtown',
    category: 'Tech',
    registrationDeadline: '2024-07-13',
    maxAttendees: 50,
    organizerId: '2',
    organizerName: 'Event Organizer',
    registeredCount: 35
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'An amazing outdoor music festival featuring local and international artists. Enjoy great food, drinks, and unforgettable performances under the stars.',
    date: '2024-07-20',
    time: '6:00 PM',
    venue: 'Central Park Amphitheater',
    category: 'Music',
    registrationDeadline: '2024-07-18',
    maxAttendees: 500,
    organizerId: '2',
    organizerName: 'Event Organizer',
    registeredCount: 342
  },
  {
    id: '3',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to a panel of experienced investors. Network with entrepreneurs and discover the next big thing.',
    date: '2024-07-25',
    time: '2:00 PM',
    venue: 'Business Center, Suite 200',
    category: 'Business',
    registrationDeadline: '2024-07-23',
    maxAttendees: 100,
    organizerId: '2',
    organizerName: 'Event Organizer',
    registeredCount: 78
  },
  {
    id: '4',
    title: 'Photography Workshop',
    description: 'Learn professional photography techniques from award-winning photographers. Bring your camera and discover the secrets of composition and lighting.',
    date: '2024-08-02',
    time: '9:00 AM',
    venue: 'Art Studio, Gallery District',
    category: 'Arts',
    registrationDeadline: '2024-07-30',
    maxAttendees: 25,
    organizerId: '2',
    organizerName: 'Event Organizer',
    registeredCount: 18
  },
  {
    id: '5',
    title: 'Healthy Cooking Class',
    description: 'Learn to prepare delicious, nutritious meals with our expert chefs. Take home recipes and cooking tips for a healthier lifestyle.',
    date: '2024-08-08',
    time: '11:00 AM',
    venue: 'Culinary Institute Kitchen',
    category: 'Health',
    registrationDeadline: '2024-08-06',
    maxAttendees: 30,
    organizerId: '2',
    organizerName: 'Event Organizer',
    registeredCount: 22
  }
];

const mockRegistrations = new Map<string, string[]>();

export const eventService = {
  async getUpcomingEvents(): Promise<Event[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockEvents.filter(event => new Date(event.date) >= new Date());
  },

  async getEventById(id: string): Promise<Event | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents.find(event => event.id === id) || null;
  },

  async createEvent(eventData: Omit<Event, 'id' | 'registeredCount'>): Promise<Event> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      registeredCount: 0
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const eventIndex = mockEvents.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...eventData };
    return mockEvents[eventIndex];
  },

  async deleteEvent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const eventIndex = mockEvents.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    mockEvents.splice(eventIndex, 1);
  },

  async registerForEvent(eventId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.registeredCount >= event.maxAttendees) {
      throw new Error('Event is full');
    }
    
    if (!mockRegistrations.has(eventId)) {
      mockRegistrations.set(eventId, []);
    }
    const registrations = mockRegistrations.get(eventId)!;
    if (!registrations.includes(userId)) {
      registrations.push(userId);
      event.registeredCount++;
    }
  },

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockEvents.filter(event => event.organizerId === organizerId);
  },

  async getAllEvents(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockEvents;
  },

  async getEventRegistrations(eventId: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock attendee data
    const registrations = mockRegistrations.get(eventId) || [];
    return registrations.map(userId => ({
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      registrationDate: new Date().toISOString()
    }));
  }
};
