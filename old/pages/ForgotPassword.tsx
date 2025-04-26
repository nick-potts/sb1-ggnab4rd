
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-light to-white flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif font-semibold text-coffee-black">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-coffee-dark/80">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-8 shadow-md sm:rounded-xl border border-coffee-light/20">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-xl font-medium text-coffee-black">Check your email</h3>
              <p className="mt-2 text-sm text-coffee-dark/80">
                We've sent you an email with a link to reset your password.
              </p>
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-coffee-dark hover:text-coffee-black hover:underline transition-colors"
                >
                  Go back to login
                </Link>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                <div className="flex items-center justify-between pt-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm font-medium text-coffee-dark hover:text-coffee-black hover:underline transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to login
                  </Link>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-coffee-dark hover:bg-coffee-black text-white font-medium py-2.5 px-4 rounded-md h-11 shadow-sm"
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
