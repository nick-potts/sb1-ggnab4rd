
import React, { useEffect, useRef } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  
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
    
    const faqElement = faqRef.current;
    if (faqElement) {
      observer.observe(faqElement);
    }
    
    return () => {
      if (faqElement) {
        observer.unobserve(faqElement);
      }
    };
  }, []);

  const faqItems = [
    {
      question: "How does Kin work?",
      answer: "We match 5-6 people based on shared interests or conversation topics. You'll receive a confirmation with the time and location details on Saturday. Simply show up, enjoy your coffee, and connect with new people."
    },
    {
      question: "Is there a fee to participate?",
      answer: "Yes, there's a small fee of $19.99 per meetup to cover administrative costs. The cost of your coffee (and food) is paid directly at the cafe."
    },
    {
      question: "How are groups matched?",
      answer: "Our algorithm matches participants based on interests, conversation preferences, and occasionally diverse backgrounds to create engaging discussions. We aim for a balance of commonality and diversity."
    },
    {
      question: "Where do the meetups take place?",
      answer: "Kin's are held at partner cafés throughout the world. When you book, you'll see available locations near you, and can choose the most convenient option."
    },
    {
      question: "What if I can't make it after booking?",
      answer: "Please cancel at least 24 hours in advance so we can adjust the groups. You will be provided with a full refund."
    },
    {
      question: "How long do the coffee meetups last?",
      answer: "Meetups typically last 1-1.5 hours, though you're welcome to stay longer if your group is enjoying the conversation. We find this is the perfect amount of time for meaningful connections without overwhelming new participants."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-cream-light/50">
      <div 
        ref={faqRef}
        className="max-w-3xl mx-auto opacity-0 translate-y-10 transition-all duration-1000"
      >
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-coffee-medium/20 rounded-full text-sm font-medium text-coffee-dark mb-4">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6">
            Common Questions About Kin
          </h2>
          <p className="text-coffee-dark/80 max-w-2xl mx-auto">
            Everything you need to know about joining our weekly coffee meetups.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-coffee-light/30 last:border-0"
            >
              <AccordionTrigger className="text-left font-medium text-coffee-dark py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-coffee-dark/80 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-coffee-dark/80 mb-4">
            Still have questions? We're happy to help!
          </p>
          <a 
            href="mailto:hello@sundaykin.com?subject=Question" 
            className="inline-flex items-center text-coffee-dark font-medium underline underline-offset-4 decoration-coffee-light hover:decoration-coffee-dark transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
