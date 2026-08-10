"use client";

import { Shield, Clock, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Same-Day Pickup",
    description: "Fast and convenient doorstep service",
  },
  {
    icon: Zap,
    title: "Instant Payment",
    description: "Get paid immediately after verification",
  },
  {
    icon: Users,
    title: "Verified Technicians",
    description: "Professional and trusted team",
  },
  {
    icon: Shield,
    title: "Secure Process",
    description: "Safe and transparent transactions",
  },
];

const TrustSignals = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Laptap?
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by thousands of satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-card p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                <feature.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
