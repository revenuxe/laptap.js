"use client";

import { Users, Package, DollarSign, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "Your device", label: "Model-specific details" },
  { icon: Package, value: "Your pincode", label: "Collection availability checked" },
  { icon: DollarSign, value: "Clear terms", label: "Review the assessment and offer" },
  { icon: Star, value: "Your next step", label: "Get help before handover" },
];

const Stats = () => {
  return (
    <section className="selling-highlights py-6 sm:py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 sm:p-6 rounded-2xl bg-background/60 border border-border/40">
                <div className="mb-2 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="highlight-title text-base leading-snug sm:text-3xl md:text-4xl font-semibold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs leading-relaxed sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
