import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTallyForm } from '@/hooks/useTallyForm';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { openTallyForm } = useTallyForm();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 md:px-10 transition-colors duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-medium text-coffee-dark">Kin</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <button className="text-coffee-dark hover:underline">
                  Dashboard
                </button>
              </Link>
              <button 
                className="bg-coffee-dark hover:bg-coffee-dark/90 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto rounded-lg font-normal"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Button
                className="bg-coffee-dark hover:bg-coffee-dark/90 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto rounded-lg font-normal"
                onClick={openTallyForm}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
