
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useTallyForm } from '@/hooks/useTallyForm';

const Benefits = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { openTallyForm } = useTallyForm();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
            
            if (entry.target.classList.contains('slide-right')) {
              entry.target.classList.remove('translate-x-10');
            }
            if (entry.target.classList.contains('slide-left')) {
              entry.target.classList.remove('-translate-x-10');
            }
          }
        });
      },
      ld
      { threshold: 0.1 }
    );
    
    const sectionElement = sectionRef.current;
    const imageElement = imageRef.current;
    
    if (sectionElement) {
      observer.observe(sectionElement);
    }
    if (imageElement) {
      observer.observe(imageElement);
    }
    
    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
      if (imageElement) {
        observer.unobserve(imageElement);
      }
    };
  }, []);

  return (
    <section id="benefits" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            ref={imageRef}
            className="opacity-0 -translate-x-10 slide-left transition-all duration-1000 order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cream-dark/30 to-coffee-light/30 rounded-xl animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="glass-card rounded-lg p-2 relative">
                <div className="aspect-square w-full rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/31c7131d-1496-4d5d-a876-d6c989cfb95e.png" 
                    alt="Group of diverse people having a conversation around a table" 
                    className="w-full h-full object-cover"
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-4 glass-card rounded-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-coffee-medium flex items-center justify-center">
                    <span className="text-white font-medium">92%</span>
                  </div>
                  <div>
                    <p className="text-sm text-coffee-dark">of members report improved wellbeing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            ref={sectionRef}
            className="opacity-0 translate-x-10 slide-right transition-all duration-1000 order-1 lg:order-2"
          >
            <span className="inline-block px-3 py-1 bg-coffee-medium/20 rounded-full text-sm font-medium text-coffee-dark mb-4">
              Why Kin?
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6">
              Sunday mornings are better with coffee &amp; company
            </h2>
            <p className="text-coffee-dark/80 mb-6">
              In our increasingly digital world, genuine face-to-face connections have become rare and precious. Kin creates space for authentic interaction over one of life's simple pleasures.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center mt-1">
                  <span className="text-coffee-dark font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-coffee-dark">Update your routine</h3>
                  <p className="text-coffee-dark/70 text-sm">Start your week with something refreshing and meaningful</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center mt-1">
                  <span className="text-coffee-dark font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-coffee-dark">Meet like-minded people</h3>
                  <p className="text-coffee-dark/70 text-sm">Connect with others who share your interests and perspectives</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cream flex items-center justify-center mt-1">
                  <span className="text-coffee-dark font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-coffee-dark">Discover great coffee spots</h3>
                  <p className="text-coffee-dark/70 text-sm">Explore new cafés and coffee experiences in your area</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="bg-coffee-dark hover:bg-coffee-black text-white text-xl font-normal px-12 py-5 h-auto rounded-lg"
                onClick={openTallyForm}
              >
                Join Your First Kin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
