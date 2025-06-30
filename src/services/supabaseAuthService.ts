
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/contexts/AuthContext';

export interface LoginResponse {
  user: User;
  token: string;
}

export const supabaseAuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    return {
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'organizer' | 'attendee'
      },
      token: data.session?.access_token || ''
    };
  },

  async signup(name: string, email: string, password: string, role: string): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // The profile will be created automatically by the trigger
    // Wait a moment and then fetch it
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to fetch user profile');
    }

    return {
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'organizer' | 'attendee'
      },
      token: data.session?.access_token || ''
    };
  },

  async verifyToken(token: string): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return null;
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as 'admin' | 'organizer' | 'attendee'
    };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
};
