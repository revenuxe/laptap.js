import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Laptop, Monitor } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Sell Your Laptop or Desktop{" "}
            <span className="text-primary">Instantly</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Get instant price, doorstep pickup, and fast payment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
              Sell Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/sell")}>
              Get Instant Quote
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div
              className="group cursor-pointer rounded-2xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              onClick={() => navigate("/sell?category=laptop")}
            >
              <Laptop className="mx-auto mb-3 h-12 w-12 text-primary" />
              <h3 className="font-semibold">Sell Laptop</h3>
            </div>
            
            <div
              className="group cursor-pointer rounded-2xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              onClick={() => navigate("/sell?category=desktop")}
            >
              <Monitor className="mx-auto mb-3 h-12 w-12 text-primary" />
              <h3 className="font-semibold">Sell Desktop</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
