
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const ThankYou = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your payment. Your booking is confirmed!",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-100 p-3 animate-fade-in">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-4">
            Thank You for Your Booking
          </h1>
          
          <div className="glass-card bg-cream/30 rounded-lg p-6 mb-8">
            <p className="text-lg text-coffee-dark/80 mb-4">
              Your coffee meetup has been confirmed! We'll send you details about your upcoming meetup, including location and time, via email.
            </p>
            
            <p className="text-coffee-dark/70 mb-6">
              Be sure to check your inbox (and spam folder) for confirmation emails and further instructions.
            </p>
            
            <div className="border-t border-coffee-light/40 pt-4 mt-4">
              <p className="text-sm text-coffee-dark/60 italic">
                "The best conversations happen over coffee. We're excited to help you make meaningful connections!"
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYou;
