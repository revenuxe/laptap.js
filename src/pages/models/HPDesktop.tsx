import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";

const HPDesktop = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Sell HP Desktop Computer Online - Best Price for HP Desktop | Instant Cash | Laptap</title>
        <meta name="description" content="Sell your used HP desktop computer for instant cash. Get the best resale value for HP desktop models. Free doorstep pickup across India." />
        <meta name="keywords" content="sell HP desktop, sell HP desktop computer, HP desktop resale value, sell used HP desktop, HP desktop buyback India" />
        <link rel="canonical" href="https://www.laptap.in/models/hp-desktop" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-32">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Monitor className="h-4 w-4" />
                  HP Desktop Series
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Sell Your HP Desktop Computer for{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Best Price
                  </span>
                </h1>

                <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                  Get instant cash for HP desktop computers. All models accepted with free doorstep pickup and instant payment.
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

export default HPDesktop;
