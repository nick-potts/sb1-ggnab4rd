import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTallyForm } from '@/hooks/useTallyForm';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { openTallyForm } = useTallyForm();
  const [location, setLocation] = useState("Near You");
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state immediately to show content
    setIsLoaded(true);
    
    // Check if we already have a location from session storage
    const cachedLocation = sessionStorage.getItem('userCity');
    if (cachedLocation) {
      setLocation(cachedLocation);
      return;
    }

    // Fetch location from ipapi.co
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const city = data.city || data.region || "Near You";
        setLocation(city);
        sessionStorage.setItem('userCity', city);
      })
      .catch(error => {
        console.log('Error fetching location:', error);
      });
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 pt-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-cream-light to-white opacity-50 z-0"
        aria-hidden="true"
      />
      
      <div 
        ref={heroRef}
        className={`w-full max-w-6xl mx-auto text-center relative z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="inline-block bg-coffee-light/30 backdrop-blur-sm px-4 py-1.5 rounded-full mb-8">
          <span className="text-sm font-medium text-coffee-dark flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> 
            {location}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-coffee-black mb-8 md:mb-10 tracking-tight leading-[1.15] max-w-5xl mx-auto">
          Every Sunday, strangers meet for coffee
        </h1>
        
        <p className="text-lg md:text-xl text-coffee-dark/80 max-w-2xl mx-auto mb-10 md:mb-12">
          Book your seat now and meet 5 strangers over coffee, all matched by our personality algorithm.
        </p>
        
        <div className="flex justify-center mb-16 md:mb-20">
          <Button 
            className="bg-coffee-dark hover:bg-coffee-dark/90 text-white text-xl font-normal px-12 py-6 h-auto rounded-lg"
            onClick={openTallyForm}
          >
            Book Your Seat <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <div className="glass-card rounded-lg p-2 relative z-10">
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/402b6664-8b0d-41c7-8b33-cd04be1d1c49.png"
                alt="Group of friends having coffee together at an outdoor cafe" 
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <a 
          href="#concept" 
          className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-all"
          aria-label="Scroll to learn more"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L6 10L7.4 8.6L12 13.2L16.6 8.6L18 10L12 16Z" fill="#6F4E37"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
