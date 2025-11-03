import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";

const IMac = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell iMac Desktop Online - Best Price for iMac 24-inch, 27-inch | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used iMac desktop for instant cash. Get the best resale value for iMac M1, M3, Intel models. Free doorstep pickup across India with instant payment." />
        <meta name="keywords" content="sell iMac, sell iMac desktop, iMac resale value, sell used iMac, iMac buyback, best price iMac India" />
        <link rel="canonical" href="https://www.laptap.in/models/imac" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Monitor className="h-4 w-4" />
                  iMac Desktop
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your iMac Desktop for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for iMac desktops. All models accepted with free doorstep pickup and instant payment.
                </p>

                <Button variant="cta" size="lg" onClick={() => navigate("/sell/desktop")}>
                  Get Instant Quote
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

export default IMac;
