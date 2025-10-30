import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const RepairThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  useEffect(() => {
    if (!orderNumber) {
      navigate('/repair/brands');
    }
  }, [orderNumber, navigate]);

  return (
    <>
      <Helmet>
        <title>Repair Request Confirmed | Laptap</title>
        <meta name="description" content="Your repair request has been successfully submitted." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 md:py-20">
          <div className="container max-w-2xl">
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
              </div>

              <h1 className="mb-4 text-3xl font-bold tracking-tight">Thank You!</h1>
              
              <p className="mb-6 text-lg text-muted-foreground">
                Your repair request has been successfully submitted
              </p>

              <div className="mb-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
                <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              </div>

              <div className="mb-8 text-left space-y-4">
                <h2 className="text-xl font-semibold">What's Next?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-muted-foreground">
                      Our team will review your request and contact you within 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-muted-foreground">
                      You can track your repair status from your dashboard
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-muted-foreground">
                      We'll schedule a pickup at your convenience
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="default" onClick={() => navigate('/dashboard')}>
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RepairThankYou;