"use client";

import Link from "next/link";
import { Laptop, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CategorySection = () => {
  const repairService = {
    icon: Laptop,
    title: "Repair Laptop",
    description: "Professional laptop repair services at your doorstep. From screen replacement to hardware upgrades, we've got you covered.",
    features: ["Expert technicians", "Same-day service available", "Free pickup and delivery", "Genuine spare parts"],
    path: "/repair",
    gradient: "from-orange-500/10 to-red-500/10",
    iconColor: "text-orange-600"
  };

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            What Would You Like to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sell Today?
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Choose your device category and get an instant quote. Our evaluation system ensures you get the best price.
          </p>
        </div>

        {/* Repair Service Card */}
        <div className="mt-6 sm:mt-8 max-w-4xl mx-auto">
          <Card className={`group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl bg-gradient-to-br ${repairService.gradient} rounded-2xl`}>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-background shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <repairService.icon className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 ${repairService.iconColor}`} />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{repairService.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {repairService.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {repairService.features.map(feature => (
                      <li key={feature} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button variant="cta" size="sm" asChild className="group-hover:shadow-lg transition-all flex-shrink-0 sm:size-default">
                  <Link href={repairService.path}>
                    Book Repair
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default CategorySection;
