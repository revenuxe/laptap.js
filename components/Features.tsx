"use client";

import { Shield, Zap, DollarSign, Truck, CheckCircle, Clock } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Quotes", description: "Get real-time pricing for your device in seconds with our smart pricing engine" },
  { icon: DollarSign, title: "Best Prices", description: "We offer competitive market rates ensuring you get the maximum value for your device" },
  { icon: Truck, title: "Free Pickup", description: "Convenient doorstep pickup at your preferred time - completely free of charge" },
  { icon: Shield, title: "100% Secure", description: "Your data is wiped securely and all transactions are protected and encrypted" },
  { icon: Clock, title: "Instant Payment", description: "Receive instant payment after device verification directly to your account" },
  { icon: CheckCircle, title: "Quality Check", description: "Professional device inspection to ensure fair and accurate pricing" },
];

const Features = () => {
  return (
    <section className="py-10 sm:py-16 bg-accent/20">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Choose Laptap?</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Experience the easiest and most secure way to sell your old laptops and desktops
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl bg-background hover:shadow-lg transition-shadow border border-border/50">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
