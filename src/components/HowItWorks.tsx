import { Search, Calculator, Truck, Banknote } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Select Your Device",
    description: "Choose your device brand, model, and specifications from our extensive catalog",
  },
  {
    icon: Calculator,
    number: "02",
    title: "Get Instant Quote",
    description: "Answer a few questions about device condition and get an instant price estimate",
  },
  {
    icon: Truck,
    number: "03",
    title: "Schedule Pickup",
    description: "Choose a convenient time for free doorstep pickup - we come to you",
  },
  {
    icon: Banknote,
    number: "04",
    title: "Receive Payment",
    description: "Get paid within 24 hours after our experts verify your device",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to turn your old device into instant cash
          </p>
        </div>

        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 hidden lg:block" 
               style={{ top: '4rem', width: 'calc(100% - 8rem)', left: '4rem' }} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="text-center">
                    {/* Number badge */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background mx-auto">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {step.number}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
