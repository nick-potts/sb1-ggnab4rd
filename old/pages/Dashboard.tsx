
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MapPin, RefreshCcw, Bell, MessageSquare, User, Home, ArrowRight, Calendar, Coffee } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(0);
  const isMobile = useIsMobile();
  const [location, setLocation] = useState({
    city: 'Loading...',
    region: ''
  });
  
  // Fetch coffee dates from Supabase
  const { data: availableDates = [], isLoading: isLoadingDates, error: datesError } = useQuery({
    queryKey: ['coffeeDates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_dates')
        .select('*')
        .order('date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      
      // If no data is returned, use fallback data
      if (!data || data.length === 0) {
        return [
          { id: 0, day: 'Sunday', date: 'April 6', time: '10:00 AM' },
          { id: 1, day: 'Sunday', date: 'April 13', time: '10:00 AM' },
          { id: 2, day: 'Sunday', date: 'April 20', time: '10:00 AM' },
        ];
      }
      
      // Format the data from Supabase
      return data.map(date => ({
        id: date.id,
        day: new Date(date.date).toLocaleDateString('en-US', { weekday: 'long' }),
        date: new Date(date.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        time: date.time
      }));
    },
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch coffee dates:', error);
        toast.error('Failed to load coffee dates');
      }
    }
  });

  // Fetch user's location from Supabase
  const { data: userLocation } = useQuery({
    queryKey: ['userLocation', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('city, region')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    },
    enabled: !!user,
    meta: {
      onSettled: (data: any) => {
        if (data) {
          setLocation({
            city: data.city.toUpperCase(),
            region: data.region
          });
        }
      }
    }
  });

  // Book a coffee date
  const bookCoffeeDate = async () => {
    if (!user || !availableDates[selectedDate]) {
      toast.error('Unable to book at this time');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          coffee_date_id: availableDates[selectedDate].id,
          status: 'confirmed'
        });

      if (error) throw error;

      toast.success('Coffee date booked successfully!');
    } catch (error: any) {
      console.error('Error booking coffee date:', error);
      toast.error(error.message || 'Failed to book coffee date');
    }
  };

  const DashboardContent = () => (
    <div className="flex-1 flex flex-col h-full">
      {/* Header Section with Coffee Dark Background */}
      <div className="relative h-[25vh] md:h-[24vh] min-h-[200px]">
        <div 
          className="absolute inset-0 bg-coffee-dark"
        />
        
        {/* Location overlay with improved styling */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm shadow-md mb-3 animate-fade-in">
            <MapPin size={16} className="text-cream-light" />
            <span className="font-sans text-sm font-medium tracking-wide">{location.region}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-3 tracking-wide drop-shadow-lg animate-fade-in" style={{ animationDelay: '100ms' }}>{location.city}</h1>
          
          <button className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white font-sans transition-all hover:bg-white/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Change location <RefreshCcw size={14} className="animate-pulse" />
          </button>
        </div>
      </div>
      
      {/* Content Card - Scrollable */}
      <div className="flex-1 rounded-t-3xl bg-cream-light px-5 md:px-8 py-6 md:py-8 -mt-6 relative z-10 shadow-lg animate-fade-in overflow-y-auto" style={{ animationDelay: '300ms' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-coffee-black mb-2">Book your next coffee</h2>
          <p className="text-lg font-sans text-coffee-black/80 mb-6">5 people are waiting for you</p>
          
          {/* Date Selection */}
          <div className="space-y-4 mb-8">
            {isLoadingDates ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-dark"></div>
              </div>
            ) : datesError ? (
              <div className="text-center py-6 text-red-500">
                Failed to load dates. Please try again.
              </div>
            ) : (
              availableDates.map((date, index) => (
                <div 
                  key={date.id}
                  className={`
                    flex justify-between items-center p-5 rounded-2xl border-2 shadow-sm cursor-pointer transition-all animate-fade-in
                    ${selectedDate === index 
                      ? 'border-coffee-dark bg-white' 
                      : 'border-cream-dark bg-white hover:border-coffee-medium'
                    }
                  `}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                  onClick={() => setSelectedDate(index)}
                >
                  <div>
                    <h3 className="text-xl font-serif font-medium text-coffee-black">{date.day}, {date.date}</h3>
                    <p className="text-coffee-dark/80 font-sans">{date.time}</p>
                  </div>
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                    ${selectedDate === index 
                      ? 'border-coffee-dark bg-coffee-dark' 
                      : 'border-cream-dark'
                    }
                  `}>
                    {selectedDate === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Book Button - Adjusted spacing */}
          <div className="mb-12 md:mb-6">
            <Button 
              className="w-full py-6 text-lg font-medium rounded-xl bg-coffee-dark hover:bg-coffee-dark/90 text-white flex items-center justify-center group transition-colors animate-fade-in"
              style={{ animationDelay: '700ms' }}
              onClick={bookCoffeeDate}
              disabled={isLoadingDates}
            >
              Book my seat <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile view with bottom navigation
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-light overflow-auto pb-16">
        <DashboardContent />
        
        {/* Bottom Navigation - Fixed to Bottom with styled active state */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-around py-4 bg-white border-t z-20 shadow-lg">
          <button className="flex flex-col items-center text-coffee-dark">
            <Home size={24} />
            <span className="text-xs mt-1 font-sans">Home</span>
          </button>
          <button className="flex flex-col items-center text-coffee-medium/60">
            <Bell size={24} />
            <span className="text-xs mt-1 font-sans">Notifications</span>
          </button>
          <button className="flex flex-col items-center text-coffee-medium/60">
            <MessageSquare size={24} />
            <span className="text-xs mt-1 font-sans">Messages</span>
          </button>
          <button className="flex flex-col items-center text-coffee-medium/60">
            <User size={24} />
            <span className="text-xs mt-1 font-sans">Profile</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop view with sidebar
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-cream-light">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center pt-6">
            <div className="w-12 h-12 rounded-full bg-coffee-dark flex items-center justify-center text-white mb-2">
              <Coffee size={24} />
            </div>
            <h3 className="text-lg font-serif text-coffee-black">Coffee Kickoff</h3>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true}>
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Calendar />
                  <span>Schedule</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquare />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Bell />
                  <span>Notifications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="flex justify-center pb-6">
            <Button variant="outline" className="w-full">
              <User size={16} className="mr-2" />
              Profile
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto flex justify-center">
          <div className="w-full max-w-4xl">
            <DashboardContent />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
