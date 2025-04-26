import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Coffee, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question: string;
  subtitle?: string;
  options: {
    id: string;
    text: string;
  }[];
}

interface SurveyProps {
  onComplete?: (results: Record<string, string>) => void;
}

const questions: Question[] = [
  {
    id: 'opinion_guidance',
    question: 'YOUR OPINIONS',
    subtitle: 'ARE USUALLY GUIDED BY',
    options: [
      { id: 'logic', text: 'Logic and facts' },
      { id: 'emotions', text: 'Emotions and feelings' }
    ]
  },
  {
    id: 'social_preference',
    question: 'IN SOCIAL GATHERINGS',
    subtitle: 'YOU TYPICALLY',
    options: [
      { id: 'listen', text: 'Listen more than you speak' },
      { id: 'share', text: 'Share stories and initiate conversations' }
    ]
  },
  {
    id: 'conversation_depth',
    question: 'YOUR IDEAL CONVERSATION',
    subtitle: 'TENDS TO BE',
    options: [
      { id: 'deep', text: 'Deep discussions about few topics' },
      { id: 'varied', text: 'Light discussions about many topics' }
    ]
  },
  {
    id: 'coffee_preference',
    question: 'YOUR COFFEE PREFERENCE',
    subtitle: 'SAYS A LOT ABOUT YOU',
    options: [
      { id: 'black', text: 'Black coffee (straightforward and efficient)' },
      { id: 'specialty', text: 'Specialty drinks (appreciate variety and creativity)' }
    ]
  }
];

const formSchema = z.object(
  questions.reduce((acc, question) => {
    acc[question.id] = z.string({
      required_error: `Please select an option for "${question.question}"`
    });
    return acc;
  }, {} as Record<string, z.ZodString>)
);

type FormValues = z.infer<typeof formSchema>;

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: questions.reduce((acc, question) => {
      acc[question.id] = '';
      return acc;
    }, {} as Record<string, string>)
  });

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleOptionSelect = async (questionId: string, value: string) => {
    form.setValue(questionId, value);
    
    if (isLastQuestion) {
      setIsComplete(true);
      const results = form.getValues();
      
      try {
        localStorage.setItem('surveyCompleted', 'true');
        localStorage.setItem('surveyResults', JSON.stringify(results));
        
        if (supabase.auth.getSession) {
          const session = await supabase.auth.getSession();
          if (session.data.session?.user) {
            await supabase.from('survey_results').insert([
              {
                user_id: session.data.session.user.id,
                results: results
              }
            ]);
          }
        }

        if (onComplete) {
          onComplete(results);
        }
        
        toast({
          title: "Survey Complete!",
          description: "Thank you for completing our personality test.",
          variant: "default"
        });
      } catch (error) {
        console.error('Error saving survey results:', error);
        toast({
          title: "Error",
          description: "There was an error saving your results. Please try again.",
          variant: "destructive"
        });
        
        if (onComplete) {
          onComplete(results);
        }
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

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

  if (isComplete) {
    return (
      <section id="survey" className="py-20 px-6">
        <div 
          ref={sectionRef}
          className="max-w-3xl mx-auto text-center opacity-0 translate-y-10 transition-all duration-1000"
        >
          <div className="bg-white p-8 rounded-xl shadow-md border border-coffee-light/50">
            <Sparkles className="mx-auto h-16 w-16 text-coffee-dark mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-coffee-black mb-6">
              Perfect! We've Got Your Results
            </h2>
            <p className="text-coffee-dark/80 mb-8">
              Based on your answers, we'll match you with strangers who will complement your conversation style while bringing diverse perspectives to the table.
            </p>
            <Button 
              className="bg-coffee-dark hover:bg-coffee-black text-white"
              onClick={() => window.location.href = '#signup'}
            >
              Sign up for a coffee meetup
              <Coffee className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="survey" className="py-20 px-6">
      <div 
        ref={sectionRef}
        className="max-w-3xl mx-auto opacity-0 translate-y-10 transition-all duration-1000"
      >
        <div className="bg-coffee-dark p-8 md:p-12 rounded-xl text-center shadow-lg relative">
          {currentQuestionIndex > 0 && (
            <button 
              onClick={handleBack} 
              className="absolute top-6 left-6 text-cream flex items-center hover:text-cream-light transition-colors"
              aria-label="Go back to previous question"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          
          <p className="text-sm font-medium mb-4 text-cream-light">- Personality Test -</p>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            {currentQuestion.question}
          </h2>
          
          {currentQuestion.subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-cream-light">
              {currentQuestion.subtitle}
            </p>
          )}
          
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name={currentQuestion.id}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col gap-4"
                      >
                        {currentQuestion.options.map(option => (
                          <div key={option.id} className="w-full">
                            <div 
                              className="w-full bg-cream hover:bg-cream-dark transition-colors py-4 px-6 rounded-full text-coffee-black text-center font-medium cursor-pointer"
                              onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                            >
                              {option.text}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          <div className="mt-12">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm text-cream-light mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <Progress value={progress} className="h-2 w-full max-w-md bg-cream/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Survey;
