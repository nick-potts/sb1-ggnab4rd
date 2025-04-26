import React, { useEffect, lazy, Suspense, useState, useRef } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Improved lazy loading with more meaningful chunk names and better grouping
const Concept = lazy(() => import(/* webpackChunkName: "concept" */ '@/components/Concept'));
const Benefits = lazy(() => import(/* webpackChunkName: "benefits" */ '@/components/Benefits'));
const SecondaryComponents = lazy(() => 
  import(/* webpackChunkName: "secondary" */ '@/components/SecondaryComponents')
);

const SectionLoading = ({ height = "400px" }: { height?: string }) => (
  <div className="py-6 flex justify-center items-center" style={{ height }}>
    <div className="w-8 h-8 border-3 border-coffee-light border-t-coffee-dark rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const secondaryRef = useRef<HTMLDivElement>(null);
  const [componentsVisible, setComponentsVisible] = useState({
    concept: false,
    benefits: false,
    secondary: false
  });

  useEffect(() => {
    const observerOptions = { 
      rootMargin: '200px 0px',
      threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          setComponentsVisible(prev => ({
            ...prev,
            [id]: true
          }));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe only main sections
    const sections = document.querySelectorAll('section[id="concept"], section[id="benefits"]');
    sections.forEach(section => observer.observe(section));
    
    // Observe secondary components container
    if (secondaryRef.current) {
      observer.observe(secondaryRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        
        <section id="concept">
          <Suspense fallback={<SectionLoading height="600px" />}>
            {componentsVisible.concept && <Concept />}
          </Suspense>
        </section>
        
        <section id="benefits">
          <Suspense fallback={<SectionLoading height="650px" />}>
            {componentsVisible.benefits && <Benefits />}
          </Suspense>
        </section>
        
        <div ref={secondaryRef} id="secondary">
          {componentsVisible.secondary && (
            <Suspense fallback={<SectionLoading />}>
              <SecondaryComponents />
            </Suspense>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
