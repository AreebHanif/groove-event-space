
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventService } from '@/services/eventService';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import OrganizerDashboard from '@/components/dashboards/OrganizerDashboard';
import AttendeeDashboard from '@/components/dashboards/AttendeeDashboard';
import Navbar from '@/components/Navbar';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      let data = {};
      
      if (user?.role === 'admin') {
        const allEvents = await eventService.getAllEvents();
        data = { events: allEvents };
      } else if (user?.role === 'organizer') {
        const organizerEvents = await eventService.getEventsByOrganizer(user.id);
        data = { events: organizerEvents };
      } else if (user?.role === 'attendee') {
        const upcomingEvents = await eventService.getUpcomingEvents();
        data = { events: upcomingEvents };
      }
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard data={dashboardData} onRefresh={loadDashboardData} />;
      case 'organizer':
        return <OrganizerDashboard data={dashboardData} onRefresh={loadDashboardData} />;
      case 'attendee':
        return <AttendeeDashboard data={dashboardData} onRefresh={loadDashboardData} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
