
import React, { useRef, useEffect } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  age: number;
  occupation: string;
  review: string;
  rating: number;
}

const Reviews = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const reviews: Review[] = [
    {
      name: "Sophia",
      age: 27,
      occupation: "Graphic Designer",
      review: "I was hesitant at first, but after my first session I was hooked. The conversations felt so natural and I made genuine connections.",
      rating: 5
    },
    {
      name: "Michael",
      age: 32,
      occupation: "Software Engineer",
      review: "It was slightly awkward for the first 5 minutes, but because everyone wanted to meet new people, it became comfortable quickly. People took interest in each other and the whole experience was truly enjoyable.",
      rating: 4
    },
    {
      name: "Emma",
      age: 29,
      occupation: "Teacher",
      review: "I was so nervous when I first arrived, but within minutes everyone made me feel welcome. Now I look forward to these meaningful conversations every week.",
      rating: 5
    },
    {
      name: "David",
      age: 31,
      occupation: "Architect",
      review: "I've been to three sessions now and each group has been fascinating. It's amazing how quickly you can connect with strangers.",
      rating: 5
    },
    {
      name: "Olivia",
      age: 24,
      occupation: "Marketing Specialist",
      review: "Kin has completely changed my Sunday routine. I look forward to it every week now!",
      rating: 4
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-coffee-dark text-coffee-dark' : 'text-coffee-light'}`} 
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 px-6 bg-white">
      <div 
        ref={sectionRef}
        className="max-w-5xl mx-auto opacity-0 translate-y-10 transition-all duration-1000"
      >
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-coffee-medium/20 rounded-full text-sm font-medium text-coffee-dark mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6">
            From Strangers to Friends
          </h2>
          <p className="text-coffee-dark/80 max-w-2xl mx-auto">
            Don't take our word for it — hear from the people who've experienced Kin firsthand.
          </p>
        </div>

        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Card className="h-full border-coffee-light/30 bg-cream-light/50">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex space-x-1 mb-3">
                      {renderStars(review.rating)}
                    </div>
                    <p className="italic text-coffee-dark/90 mb-4 flex-grow">"{review.review}"</p>
                    <div className="mt-auto">
                      <p className="font-medium text-coffee-black">{review.name}, {review.age}</p>
                      <p className="text-sm text-coffee-dark/70">{review.occupation}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static md:-left-0 mx-2 bg-cream hover:bg-cream-dark border-coffee-light/30 text-coffee-dark" />
            <CarouselNext className="relative static md:-right-0 mx-2 bg-cream hover:bg-cream-dark border-coffee-light/30 text-coffee-dark" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Reviews;
