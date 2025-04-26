import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Survey from '@/components/Survey';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const PreLogin = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const navigate = useNavigate();

  const handleSurveyComplete = async (results: Record<string, string>) => {
    console.log('Survey results:', results);
    localStorage.setItem('surveyCompleted', 'true');
    localStorage.setItem('surveyResults', JSON.stringify(results));
    navigate('/signup');
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-light text-coffee-black">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-coffee-black mb-8 tracking-tight leading-[1.15]">
            Join coffees with 5 amazing strangers
          </h1>
          
          <div className="mt-auto py-12">
            {/* Action buttons */}
            <div className="flex flex-col space-y-4 max-w-md mx-auto">
              <Button 
                onClick={() => setShowSurvey(true)}
                className="w-full py-6 text-lg bg-coffee-dark hover:bg-coffee-dark/90 text-white rounded-lg group transition-colors"
              >
                Get started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform h-5 w-5" />
              </Button>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-lg bg-transparent border-coffee-dark text-coffee-dark hover:bg-coffee-light/20 rounded-lg"
                >
                  I already have an account
                </Button>
              </Link>
            </div>
            
            {/* Terms of service note */}
            <p className="text-sm text-coffee-dark/60 mt-8">
              By signing up you agree to the{' '}
              <a href="#" className="underline hover-link">Terms of Service</a>,{' '}
              <a href="#" className="underline hover-link">Privacy Policy</a> and{' '}
              <a href="#" className="underline hover-link">Community Guidelines</a>
            </p>
          </div>
        </div>
      </main>

      {/* Survey Dialog */}
      <Dialog open={showSurvey} onOpenChange={setShowSurvey}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <Survey onComplete={handleSurveyComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreLogin;
