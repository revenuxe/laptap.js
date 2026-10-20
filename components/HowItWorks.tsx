"use client";

import { Search, Calculator, Truck, Banknote } from "lucide-react";

const steps = [
  { icon: Search, number: "01", title: "Choose your device", description: "Find your brand and exact model in the catalog." },
  { icon: Calculator, number: "02", title: "Share its condition", description: "Add specifications, any faults, and included accessories." },
  { icon: Truck, number: "03", title: "Plan your pickup", description: "Share your pincode to check collection availability." },
  { icon: Banknote, number: "04", title: "Review and hand over", description: "Confirm the assessment and payment before completing the sale." },
];

const HowItWorks = () => {
  return (
    <section className="how-it-works py-10 sm:py-16 md:py-32">
      <div className="container">
        <div className="process-intro text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Know what to expect from device selection to handover
          </p>
        </div>

        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 hidden lg:block" 
               style={{ top: '4rem', width: 'calc(100% - 8rem)', left: '4rem' }} 
          />

          <div className="process-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="process-card relative">
                  <div className="process-body text-center">
                    <div className="process-icon-wrap relative inline-block mb-4 sm:mb-6">
                      <div className="process-glow absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                      <div className="process-icon relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full border-2 border-primary bg-background mx-auto">
                        <Icon aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <div className="process-number absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-[10px] sm:text-xs md:text-sm font-bold text-primary-foreground">
                        {step.number}
                      </div>
                    </div>
                    
                    <h3 className="process-title text-sm sm:text-lg md:text-xl font-bold mb-1 sm:mb-3">{step.title}</h3>
                    <p className="process-description text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
