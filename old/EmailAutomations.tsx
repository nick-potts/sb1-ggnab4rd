
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EmailAutomations = () => {
  const [stripeWebhookUrl, setStripeWebhookUrl] = useState(localStorage.getItem('stripeWebhookUrl') || '');
  const [resendApiKey, setResendApiKey] = useState(localStorage.getItem('resendApiKey') || '');
  const [webhookTriggerUrl, setWebhookTriggerUrl] = useState(localStorage.getItem('webhookTriggerUrl') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Save webhook URLs and API keys
  const saveSettings = () => {
    localStorage.setItem('stripeWebhookUrl', stripeWebhookUrl);
    localStorage.setItem('resendApiKey', resendApiKey);
    localStorage.setItem('webhookTriggerUrl', webhookTriggerUrl);
    
    toast.success("Settings saved successfully");
  };

  // Test webhook trigger
  const testWebhook = async () => {
    if (!webhookTriggerUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    setIsLoading(true);
    
    try {
      await fetch(webhookTriggerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS restrictions
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event_type: "test_trigger",
          environment: "test",
        }),
      });

      toast.success("Test webhook triggered");
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast.error("Failed to trigger webhook");
    } finally {
      setIsLoading(false);
    }
  };

  // Test sending email
  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    if (!resendApiKey) {
      toast.error("Please enter your Resend API key");
      return;
    }

    setIsLoading(true);
    toast.info("This is a demo - in a real implementation, this would send an email via Resend API");
    
    // In a real implementation, you would call your backend API that uses Resend
    // For demo purposes, we're just showing a success message
    setTimeout(() => {
      toast.success(`Test email would be sent to ${testEmail}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-serif mb-6">Email Automations</h1>
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="stripe">Stripe Emails</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Automations</TabsTrigger>
          <TabsTrigger value="test">Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Email Service Settings</CardTitle>
              <CardDescription>
                Configure your email service providers and webhook endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="resendApiKey" className="text-sm font-medium">
                  Resend API Key
                </label>
                <Input 
                  id="resendApiKey"
                  type="password" 
                  placeholder="re_xxxxxxxxxxxxxxxxxxxx" 
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Get your API key from the <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Resend dashboard</a>
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="stripeWebhook" className="text-sm font-medium">
                  Stripe Webhook URL
                </label>
                <Input 
                  id="stripeWebhook"
                  placeholder="https://your-webhook-endpoint.com/stripe" 
                  value={stripeWebhookUrl}
                  onChange={(e) => setStripeWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  URL that will receive Stripe events (for payment success notifications)
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="webhookUrl" className="text-sm font-medium">
                  External Webhook URL
                </label>
                <Input 
                  id="webhookUrl"
                  placeholder="https://hooks.zapier.com/..." 
                  value={webhookTriggerUrl}
                  onChange={(e) => setWebhookTriggerUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  For Zapier, Make.com, or other automation services
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Email Notifications</CardTitle>
              <CardDescription>
                Configure emails to send after successful Stripe payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Payment Success Email</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Sent automatically when a Stripe payment is successful
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-16">Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Receipt Email</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Detailed receipt of payment with invoice number
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-16">Status:</span>
                    <span className="text-yellow-600 font-medium">Configure</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                To fully configure email templates, set up your Resend API key in settings
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Automations</CardTitle>
              <CardDescription>
                Configure automated ticket delivery and reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Ticket Delivery Email</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Send digital tickets after payment confirmation
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-16">Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Event Reminder</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Send a reminder 24 hours before the event
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-16">Status:</span>
                    <span className="text-yellow-600 font-medium">Configure</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Post-Event Follow-up</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Thank attendees and ask for feedback after the event
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-16">Status:</span>
                    <span className="text-yellow-600 font-medium">Configure</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Email Setup</CardTitle>
              <CardDescription>
                Send test emails or trigger webhook events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="testEmail" className="text-sm font-medium">
                  Test Email Address
                </label>
                <Input 
                  id="testEmail"
                  type="email" 
                  placeholder="your@email.com" 
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button 
                  variant="outline" 
                  disabled={isLoading} 
                  onClick={testWebhook}
                >
                  {isLoading ? "Sending..." : "Test Webhook"}
                </Button>
                
                <Button 
                  disabled={isLoading || !testEmail} 
                  onClick={sendTestEmail}
                >
                  {isLoading ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500">
              Use these tools to verify your email automations are working correctly
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailAutomations;
