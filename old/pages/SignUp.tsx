
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signUp, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const surveyCompleted = localStorage.getItem('surveyCompleted');
    if (!surveyCompleted) {
      toast.error('Please complete the survey before signing up');
      navigate('/pre-login');
    }
  }, [navigate]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const surveyResults = localStorage.getItem('surveyResults');
      
      await signUp(data.email, data.password, data.name);
      
      if (surveyResults) {
        const parsedResults = JSON.parse(surveyResults);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { error: surveyError } = await supabase
            .from('survey_results')
            .insert([
              {
                user_id: session.user.id,
                results: parsedResults
              }
            ]);

          if (surveyError) {
            console.error('Error saving survey results:', surveyError);
            toast.error('Failed to save survey results');
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-light to-white flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-coffee-black">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-coffee-dark/80">
          Or{' '}
          <Link to="/login" className="font-medium text-coffee-dark hover:text-coffee-black hover:underline transition-colors">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-8 shadow-md sm:rounded-xl border border-coffee-light/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-dark font-medium">Name</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-coffee-medium">
                        <User size={18} />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Your Name"
                          className="border-coffee-light/30 focus-visible:ring-coffee-medium/30 pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-dark font-medium">Email address</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-coffee-medium">
                        <Mail size={18} />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="border-coffee-light/30 focus-visible:ring-coffee-medium/30 pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-dark font-medium">Password</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-coffee-medium">
                        <Lock size={18} />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="border-coffee-light/30 focus-visible:ring-coffee-medium/30 pl-10 pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 text-coffee-medium hover:text-coffee-dark"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-coffee-dark font-medium">Confirm Password</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-coffee-medium">
                        <Lock size={18} />
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="border-coffee-light/30 focus-visible:ring-coffee-medium/30 pl-10 pr-10"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-3 text-coffee-medium hover:text-coffee-dark"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                  <span className="block sm:inline text-sm">{authError}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-coffee-dark hover:bg-coffee-black text-white font-medium py-2.5 px-4 rounded-md h-11 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
