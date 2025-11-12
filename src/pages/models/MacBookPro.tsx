import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Laptop, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import HeroForm from "@/components/HeroForm";
import FAQ from "@/components/FAQ";

const MacBookPro = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell MacBook Pro Online - Get Instant Cash for Your MacBook | Best Price Guaranteed | Laptap</title>
        <meta name="description" content="Sell your used MacBook Pro for instant cash. Get the best resale value for MacBook Pro 13-inch, 14-inch, 15-inch, 16-inch models (M1, M2, M3, Intel). Free doorstep pickup across India. Instant payment via UPI. Trusted by 10,000+ MacBook sellers. Sell MacBook Pro 2024, 2023, 2022, 2021, 2020 models." />
        <meta name="keywords" content="sell MacBook Pro, sell MacBook Pro online, MacBook Pro resale value, sell used MacBook Pro, sell old MacBook Pro, MacBook Pro buyback, best price MacBook Pro, sell MacBook Pro 16 inch, sell MacBook Pro 14 inch, sell MacBook Pro 13 inch, sell MacBook Pro M3, sell MacBook Pro M2, sell MacBook Pro M1, sell MacBook Pro 2024, sell MacBook Pro 2023, sell MacBook Pro India, instant cash MacBook Pro" />
        <link rel="canonical" href="https://www.laptap.in/models/macbook-pro" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Laptop className="h-4 w-4" />
                    MacBook Pro
                  </div>

                  <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Sell Your MacBook Pro for{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Instant Cash
                    </span>
                  </h1>

                  <p className="mb-8 text-lg text-muted-foreground">
                    Get the best resale value for your MacBook Pro. All models accepted - M3, M2, M1, Intel. 
                    Free doorstep pickup with instant payment.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="cta" size="lg" onClick={() => navigate("/sell/laptop")}>
                      Get Instant Quote
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                      Contact Us
                    </Button>
                  </div>
                </div>

                <HeroForm defaultSellingType="laptop" />
              </div>
            </div>
          </section>

          {/* Models We Accept - Above Footer */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                MacBook Pro Models We Buy
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  { name: "MacBook Pro 16-inch M3 Max/Pro", year: "2024" },
                  { name: "MacBook Pro 14-inch M3 Max/Pro", year: "2024" },
                  { name: "MacBook Pro 16-inch M2 Max/Pro", year: "2023" },
                  { name: "MacBook Pro 14-inch M2 Max/Pro", year: "2023" },
                  { name: "MacBook Pro 13-inch M2", year: "2022" },
                  { name: "MacBook Pro 16-inch M1 Max/Pro", year: "2021" },
                  { name: "MacBook Pro 14-inch M1 Max/Pro", year: "2021" },
                  { name: "MacBook Pro 13-inch M1", year: "2020" },
                  { name: "MacBook Pro 16-inch Intel", year: "2019-2020" },
                  { name: "MacBook Pro 15-inch Intel", year: "2016-2019" },
                  { name: "MacBook Pro 13-inch Intel", year: "2016-2020" },
                  { name: "MacBook Pro Retina", year: "2012-2015" },
                ].map((model, index) => (
                  <div key={index} className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.year}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  All MacBook Pro models accepted - M3, M2, M1, Intel - in any condition
                </p>
                <Button variant="cta" size="lg" onClick={() => navigate("/sell")}>
                  Get Instant Quote Now
                </Button>
              </div>
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Sell Your MacBook Pro Online with Laptap?
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p>
                  Looking to sell your used MacBook Pro? You've come to the right place. Laptap offers India's most trusted platform for selling MacBook Pro laptops online with instant cash payment. Whether you own a MacBook Pro M3, M2, M1, or an older Intel-based model, we guarantee the best resale value in the market.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Best Price for MacBook Pro in India</h3>
                <p>
                  MacBook Pro laptops retain excellent resale value, especially the newer Apple Silicon models. Our dynamic pricing algorithm considers your MacBook's processor (M3 Max, M2 Pro, M1, Intel), screen size (13-inch, 14-inch, 16-inch), RAM configuration, storage capacity, and physical condition to offer you the highest possible price. We buy MacBook Pro 2024, 2023, 2022, 2021, and older models.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Free Doorstep Pickup Across India</h3>
                <p>
                  Forget the hassle of visiting multiple shops or dealing with unreliable buyers. Our verified technicians provide free same-day doorstep pickup service across all major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, and Pune. Schedule a convenient time slot, and we'll come to your home or office for free.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Instant Payment & Safe Transaction</h3>
                <p>
                  Get paid instantly after device verification. We support multiple payment methods including UPI, IMPS bank transfer, and cash. Your MacBook Pro data is completely wiped using industry-standard security protocols. Every transaction is transparent, secure, and backed by our 10,000+ satisfied customer reviews.
                </p>

                <h3 className="text-2xl font-bold text-foreground mt-8">Sell Damaged or Broken MacBook Pro</h3>
                <p>
                  Even if your MacBook Pro has a cracked screen, keyboard issues, battery problems, water damage, or won't turn on, we'll still make you a fair offer. Our expert technicians can accurately assess the value of damaged devices and offer competitive prices based on salvageable components.
                </p>
              </div>
            </div>
          </section>

          <FAQ />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};

export default MacBookPro;
