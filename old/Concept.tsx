
import React, { useEffect, useRef } from 'react';
import { FileQuestion, Users, Calendar, Navigation, Lightbulb } from 'lucide-react';

const ConceptItem = ({ icon, title, description, delay }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  delay: number
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
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
    
    const itemElement = itemRef.current;
    if (itemElement) {
      observer.observe(itemElement);
    }
    
    return () => {
      if (itemElement) {
        observer.unobserve(itemElement);
      }
    };
  }, []);

  return (
    <div 
      ref={itemRef}
      className="glass-card rounded-xl p-6 opacity-0 translate-y-10 transition-all duration-700"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-coffee-light/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-coffee-dark mb-2">{title}</h3>
      <p className="text-coffee-dark/80">{description}</p>
    </div>
  );
};

const Concept = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
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
    
    const titleElement = titleRef.current;
    if (titleElement) {
      observer.observe(titleElement);
    }
    
    return () => {
      if (titleElement) {
        observer.unobserve(titleElement);
      }
    };
  }, []);

  return (
    <section id="concept" className="py-20 px-6 bg-cream-light/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-coffee-medium/20 rounded-full text-sm font-medium text-coffee-dark mb-4">
            <Lightbulb className="w-4 h-4 inline-block mr-1 -mt-0.5" /> The Concept
          </span>
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6 opacity-0 translate-y-10 transition-all duration-700"
          >
            How Kin Works
          </h2>
          <p className="max-w-2xl mx-auto text-coffee-dark/80">
            We bring together strangers for meaningful conversations every Sunday morning.
            It's simple, enjoyable, and the perfect way to meet new people.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ConceptItem 
            icon={<FileQuestion className="w-6 h-6 text-coffee-dark" />}
            title="Take our quick personality test"
            description="Complete our quick personality test so we can match you with your people."
            delay={100}
          />
          <ConceptItem 
            icon={<Users className="w-6 h-6 text-coffee-dark" />}
            title="We match you with 5 strangers"
            description="Our algorithm crafts a gathering of 5 individuals with likeminded personalities."
            delay={200}
          />
          <ConceptItem 
            icon={<Calendar className="w-6 h-6 text-coffee-dark" />}
            title="We handle everything"
            description="Relax as we secure a welcoming café venue, coordinate schedules, and send personal invitations to everyone."
            delay={300}
          />
          <ConceptItem 
            icon={<Navigation className="w-6 h-6 text-coffee-dark" />}
            title="Experience real connection"
            description="Simply arrive and immerse yourself in authentic conversation. No agenda, just genuine human connection."
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Concept;
