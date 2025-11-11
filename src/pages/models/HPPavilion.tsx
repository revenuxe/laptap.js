import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop } from "lucide-react";

const HPPavilion = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell HP Pavilion Laptop Online - Best Price for HP Pavilion | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used HP Pavilion laptop for instant cash. Get the best resale value for HP Pavilion 14, 15, 16 models. Free doorstep pickup across India with instant payment." />
        <meta name="keywords" content="sell HP Pavilion, sell HP Pavilion laptop, HP Pavilion resale value, sell used HP laptop, HP Pavilion buyback India" />
        <link rel="canonical" href="https://www.laptap.in/models/hp-pavilion" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Laptop className="h-4 w-4" />
                  HP Pavilion Series
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your HP Pavilion Laptop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for HP Pavilion laptops. All models accepted with free doorstep pickup and instant payment.
                </p>

                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Instant Quote
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Content */}
          <section className="py-16 md:py-24">
            <div className="container max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="prose prose-slate">
                  <h2 className="text-3xl font-bold mb-6">Sell HP Pavilion - Popular Consumer Laptops</h2>
                  <p className="text-muted-foreground mb-4">
                    Sell your HP Pavilion laptop for the best market price at Laptap. We buy all HP Pavilion models including Pavilion 14, Pavilion 15, Pavilion 16, Pavilion x360 2-in-1 convertibles, and Pavilion Gaming series. Whether you have a recent 13th Gen Intel model or an older configuration, we offer competitive pricing.
                  </p>
                  <p className="text-muted-foreground">
                    HP Pavilion laptops are known for their balanced performance, stylish designs, and affordability. We accept all specifications - Intel Core i3, i5, i7, AMD Ryzen processors, touchscreen variants, and gaming models with dedicated NVIDIA/AMD graphics. Free doorstep pickup across India with instant payment.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Why Choose Laptap for HP Pavilion?</h3>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">Premium Valuations</h4>
                    <p className="text-sm text-muted-foreground">Get top resale value for your HP Pavilion laptop</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">All Configurations Welcome</h4>
                    <p className="text-sm text-muted-foreground">Standard, Gaming, x360 convertibles - we buy them all</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-bold mb-2">Quick & Easy Process</h4>
                    <p className="text-sm text-muted-foreground">Get quote in 2 minutes, pickup within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HP Pavilion Models Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">HP Pavilion Models We Buy</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                We accept all HP Pavilion laptops - consumer, gaming, and convertible models
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "HP Pavilion Plus 14", series: "Premium Thin & Light" },
                  { name: "HP Pavilion 15", series: "All-Purpose Laptop" },
                  { name: "HP Pavilion 16", series: "Large Display" },
                  { name: "HP Pavilion x360 14", series: "2-in-1 Convertible" },
                  { name: "HP Pavilion x360 15", series: "2-in-1 Convertible" },
                  { name: "HP Pavilion Gaming 15", series: "Gaming Laptop" },
                  { name: "HP Pavilion Gaming 16", series: "Gaming Laptop" },
                  { name: "HP Pavilion Aero 13", series: "Ultra-Lightweight" },
                  { name: "HP Pavilion 14", series: "Compact Laptop" },
                  { name: "HP Pavilion 15 (Intel)", series: "12th/13th Gen Intel" },
                  { name: "HP Pavilion 15 (AMD)", series: "Ryzen 5/7 Series" },
                  { name: "HP Pavilion Plus 16", series: "Premium Large Display" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.series}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  Have a different HP Pavilion model? We buy all variants!
                </p>
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Sell Your HP Pavilion Now
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default HPPavilion;
