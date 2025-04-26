
import React from 'react';
import FAQ from './FAQ';
import Reviews from './Reviews';
import SignUpCTA from './SignUpCTA';

const SecondaryComponents = () => {
  return (
    <div className="secondary-sections">
      <section id="faq">
        <FAQ />
      </section>
      
      <section id="reviews">
        <Reviews />
      </section>
      
      <section id="cta">
        <SignUpCTA />
      </section>
    </div>
  );
};

export default SecondaryComponents;
