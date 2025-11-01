import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Laptop, Monitor } from 'lucide-react';

const RepairCategory = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Laptop,
      title: 'Laptop Repair',
      description: 'Get your laptop repaired by expert technicians',
      category: 'laptop',
      gradient: 'from-card to-card/50',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10'
    },
    {
      icon: Monitor,
      title: 'Desktop Repair',
      description: 'Professional desktop computer repair services',
      category: 'desktop',
      gradient: 'from-card to-card/50',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Select Device Type for Repair | Laptap</title>
        <meta name="description" content="Choose your device type to schedule a repair service." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 md:py-20">
          <div className="container max-w-5xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-center">
              What Device Needs Repair?
            </h1>
            <p className="mb-12 text-center text-muted-foreground">
              Select your device type to get started with our expert repair services
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <Card
                  key={category.category}
                  className={`group relative overflow-hidden rounded-3xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br ${category.gradient} hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50 cursor-pointer`}
                  onClick={() => navigate(`/repair/brands?category=${category.category}`)}
                >
                  <div className="p-8 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl ${category.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 mx-auto`}>
                      <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RepairCategory;