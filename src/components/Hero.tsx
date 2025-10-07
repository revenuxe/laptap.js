import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, Monitor, Shield, TrendingUp, Zap } from "lucide-react";
import { DeviceSearch } from "@/components/DeviceSearch";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Instant Price Quotes Available
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Sell Your Laptop or Desktop{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Get the best price for your device with instant quotes, free doorstep pickup, 
            and instant secure payment.
          </p>

          {/* Search bar */}
          <div className="mb-12">
            <DeviceSearch />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="cta" size="lg" onClick={() => navigate("/sell")} className="min-w-[200px]">
              Sell Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/sell")} className="min-w-[200px]">
              Get Instant Quote
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Best Market Prices</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>24hr Payment</span>
            </div>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              className="group cursor-pointer rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50"
              onClick={() => navigate("/sell?category=laptop")}
            >
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <Laptop className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sell Laptop</h3>
              <p className="text-sm text-muted-foreground">
                Get instant quotes for all laptop brands
              </p>
            </div>
            
            <div
              className="group cursor-pointer rounded-3xl border-2 border-border bg-gradient-to-br from-card to-card/50 p-8 transition-all hover:border-primary hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-primary/5 hover:to-card/50"
              onClick={() => navigate("/sell?category=desktop")}
            >
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <Monitor className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sell Desktop</h3>
              <p className="text-sm text-muted-foreground">
                Best prices for desktop computers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
