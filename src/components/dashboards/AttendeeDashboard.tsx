
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search,
  Heart,
  Clock,
  Star
} from 'lucide-react';

interface AttendeeDashboardProps {
  data: any;
  onRefresh: () => void;
}

const AttendeeDashboard = ({ data, onRefresh }: AttendeeDashboardProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const events = data?.events || [];

  const filteredEvents = events.filter((event: any) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = events.filter((event: any) => new Date(event.date) >= new Date());
  const registeredEvents = 3; // Mock data
  const favoriteEvents = 5; // Mock data

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back!</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Available to join
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registeredEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events joined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteEvents}</div>
            <p className="text-xs text-muted-foreground">
              Saved events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Events to attend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Discover Events</CardTitle>
          <CardDescription>
            Find events that match your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events, venues, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event: any) => (
          <Card key={event.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-purple-700 hover:bg-white">
                  {event.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-2xl font-bold">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-sm opacity-90">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg hover:text-purple-600 transition-colors">
                {event.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {event.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {event.venue}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.registeredCount || 0}/{event.maxAttendees} spots
                </div>
                <div className="flex items-center text-sm text-yellow-600">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  4.8
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboard;
