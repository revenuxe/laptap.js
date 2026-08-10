"use client";

import { CheckCircle2, MapPin, Banknote, Package } from "lucide-react";
const steps = [{
  icon: CheckCircle2,
  title: "Select Device",
  description: "Choose your laptop or desktop model"
}, {
  icon: Banknote,
  title: "Get Price Estimate",
  description: "Instant valuation for your device"
}, {
  icon: MapPin,
  title: "Enter Address",
  description: "Provide pickup location details"
}, {
  icon: Package,
  title: "Pickup & Payment",
  description: "Same-day pickup and instant payment"
}];
const ProcessSteps = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sell your device in 4 simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProcessSteps;