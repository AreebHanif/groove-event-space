
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle
} from 'lucide-react';
import { eventService } from '@/services/eventService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const eventData = await eventService.getEventById(id!);
      if (eventData) {
        setEvent(eventData);
        // Mock registration check
        setIsRegistered(Math.random() > 0.5);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading event:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'attendee') {
      toast({
        title: "Registration not allowed",
        description: "Only attendees can register for events.",
        variant: "destructive",
      });
      return;
    }

    setRegistering(true);
    try {
      await eventService.registerForEvent(event.id, user.id);
      setIsRegistered(true);
      setEvent((prev: any) => ({
        ...prev,
        registeredCount: (prev.registeredCount || 0) + 1
      }));
      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to register for this event.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800">Event not found</h1>
        </div>
      </div>
    );
  }

  const isEventFull = (event.registeredCount || 0) >= event.maxAttendees;
  const isEventPast = new Date(event.date) < new Date();
  const registrationDeadlinePassed = new Date(event.registrationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="aspect-video bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/30 flex items-end">
              <div className="p-8 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-white/90 text-purple-700 hover:bg-white">
                    {event.category}
                  </Badge>
                  {isEventPast && (
                    <Badge variant="secondary">Past Event</Badge>
                  )}
                  {isEventFull && !isEventPast && (
                    <Badge variant="destructive">Sold Out</Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">Organized by {event.organizerName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-gray-600">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-gray-600">
                      {event.registeredCount || 0} of {event.maxAttendees} attendees
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Registration Deadline</p>
                    <p className="text-gray-600">
                      {new Date(event.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRegistered ? 'You\'re Going!' : 'Join This Event'}
                </CardTitle>
                {isRegistered && (
                  <CardDescription className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registration confirmed
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isRegistered && (
                  <Button 
                    className="w-full"
                    onClick={handleRegister}
                    disabled={registering || isEventFull || isEventPast || registrationDeadlinePassed}
                  >
                    {registering ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Registering...</span>
                      </div>
                    ) : isEventPast ? (
                      'Event has ended'
                    ) : isEventFull ? (
                      'Event is full'
                    ) : registrationDeadlinePassed ? (
                      'Registration closed'
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Registration Progress</span>
                    <span>{event.registeredCount || 0}/{event.maxAttendees}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((event.registeredCount || 0) / event.maxAttendees) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{event.organizerName}</p>
                    <p className="text-sm text-gray-600">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
