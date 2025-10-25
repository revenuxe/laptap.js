import { useNavigate } from "react-router-dom";
import { Laptop, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const CategorySection = () => {
  const navigate = useNavigate();
  const categories = [{
    icon: Laptop,
    title: "Sell Laptop",
    description: "Get instant cash for your old laptop with our hassle-free selling process. We accept all brands including Apple MacBook, Dell, HP, Lenovo, and more.",
    features: ["Free doorstep pickup across Bengaluru", "Instant price evaluation within 2 minutes", "Best market prices guaranteed", "Safe and secure payment"],
    path: "/sell/laptop",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600"
  }, {
    icon: Smartphone,
    title: "Sell Mobile",
    description: "Turn your old smartphone into instant cash. Whether it's iPhone, Samsung, OnePlus, or any other brand, get the best resale value today.",
    features: ["Quick 60-second evaluation", "All brands and models accepted", "Immediate payment upon pickup", "Data wiping guarantee"],
    path: "/sell/mobile",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600"
  }, {
    icon: Monitor,
    title: "Sell Desktop",
    description: "Upgrade your desktop computer and earn money from your old system. We buy complete setups including monitors, CPUs, and accessories.",
    features: ["Complete system evaluation", "Premium prices for gaming PCs", "Free pickup and packaging", "Instant quote generation"],
    path: "/sell/desktop",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600"
  }];
  return <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Would You Like to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sell Today?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your device category and get an instant quote. Our AI-powered evaluation system ensures you get the best price for your used electronics in Bengaluru.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => <Card key={category.title} className={`group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br ${category.gradient} animate-fade-in`} style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className="p-6 md:p-8 space-y-6">
                {/* Icon */}
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`w-8 h-8 md:w-10 md:h-10 ${category.iconColor}`} />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{category.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {category.features.map(feature => <li key={feature} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>)}
                </ul>

                {/* CTA Button */}
                <Button variant="cta" className="w-full group-hover:shadow-lg transition-all" onClick={() => navigate(category.path)}>
                  Get Instant Quote
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            </Card>)}
        </div>

        {/* Trust Bar */}
        
      </div>
    </section>;
};
export default CategorySection;