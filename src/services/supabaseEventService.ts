
import { supabase } from '@/integrations/supabase/client';

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

export const supabaseEventService = {
  async getUpcomingEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      registrationDeadline: event.registration_deadline,
      maxAttendees: event.max_attendees,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name || 'Unknown',
      registeredCount: event.registered_count || 0,
      imageUrl: event.image_url
    }));
  },

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      date: data.date,
      time: data.time,
      venue: data.venue,
      category: data.category,
      registrationDeadline: data.registration_deadline,
      maxAttendees: data.max_attendees,
      organizerId: data.organizer_id,
      organizerName: data.organizer_name || 'Unknown',
      registeredCount: data.registered_count || 0,
      imageUrl: data.image_url
    };
  },

  async createEvent(eventData: Omit<Event, 'id' | 'registeredCount' | 'organizerName'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        venue: eventData.venue,
        category: eventData.category,
        registration_deadline: eventData.registrationDeadline,
        max_attendees: eventData.maxAttendees,
        organizer_id: eventData.organizerId,
        image_url: eventData.imageUrl
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Get the event with counts
    const createdEvent = await this.getEventById(data.id);
    if (!createdEvent) {
      throw new Error('Failed to fetch created event');
    }

    return createdEvent;
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const updateData: any = {};
    
    if (eventData.title) updateData.title = eventData.title;
    if (eventData.description) updateData.description = eventData.description;
    if (eventData.date) updateData.date = eventData.date;
    if (eventData.time) updateData.time = eventData.time;
    if (eventData.venue) updateData.venue = eventData.venue;
    if (eventData.category) updateData.category = eventData.category;
    if (eventData.registrationDeadline) updateData.registration_deadline = eventData.registrationDeadline;
    if (eventData.maxAttendees) updateData.max_attendees = eventData.maxAttendees;
    if (eventData.imageUrl) updateData.image_url = eventData.imageUrl;

    const { error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    const updatedEvent = await this.getEventById(id);
    if (!updatedEvent) {
      throw new Error('Failed to fetch updated event');
    }

    return updatedEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async registerForEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId
      });

    if (error) {
      throw new Error(error.message);
    }
  },

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .eq('organizer_id', organizerId)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      registrationDeadline: event.registration_deadline,
      maxAttendees: event.max_attendees,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name || 'Unknown',
      registeredCount: event.registered_count || 0,
      imageUrl: event.image_url
    }));
  },

  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events_with_counts')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      venue: event.venue,
      category: event.category,
      registrationDeadline: event.registration_deadline,
      maxAttendees: event.max_attendees,
      organizerId: event.organizer_id,
      organizerName: event.organizer_name || 'Unknown',
      registeredCount: event.registered_count || 0,
      imageUrl: event.image_url
    }));
  },

  async getEventRegistrations(eventId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        id,
        registered_at,
        profiles (
          id,
          name,
          email
        )
      `)
      .eq('event_id', eventId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(registration => ({
      id: registration.profiles.id,
      name: registration.profiles.name,
      email: registration.profiles.email,
      registrationDate: registration.registered_at
    }));
  }
};
