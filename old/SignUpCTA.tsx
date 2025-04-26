
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useTallyForm } from '@/hooks/useTallyForm';

const SignUpCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { openTallyForm } = useTallyForm();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const sectionElement = sectionRef.current;
    if (sectionElement) {
      observer.observe(sectionElement);
    }
    
    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  return (
    <section className="py-16 px-6 bg-cream" id="cta">
      <div 
        ref={sectionRef}
        className="max-w-3xl mx-auto text-center opacity-0 translate-y-10 transition-all duration-700"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6">
          Ready to join a Sunday conversation?
        </h2>
        <p className="text-coffee-dark/80 mb-8 max-w-xl mx-auto">
          Sign up today and experience meaningful connections with new people in your area.
        </p>
        <div className="flex justify-center">
          <Button 
            className="bg-coffee-dark hover:bg-coffee-black text-white text-base md:text-xl font-normal px-8 md:px-12 py-4 md:py-5 h-auto rounded-lg group transition-colors"
            onClick={openTallyForm}
          >
            Sign Up Now 
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignUpCTA;
