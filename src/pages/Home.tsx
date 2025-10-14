import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import ProcessSteps from "@/components/ProcessSteps";
import TrustSignals from "@/components/TrustSignals";
import { BrandsSection } from "@/components/BrandsSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
const Home = () => {
  return <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "How do I sell my laptop to Laptap?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply select your device, get an instant quote, schedule a pickup, and receive instant payment after verification. Our technicians will come to your doorstep for free pickup."
            }
          }, {
            "@type": "Question",
            "name": "How quickly will I receive payment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You receive instant payment immediately after our technicians verify your device during pickup. We support multiple payment methods including UPI, bank transfer, and digital wallets."
            }
          }, {
            "@type": "Question",
            "name": "Is doorstep pickup available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer free same-day doorstep pickup across Bangalore. Our verified technicians will come to your location at your preferred time."
            }
          }]
        })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <Stats />
          <BrandsSection />
          <Features />
          <HowItWorks />
          
          
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>;
};
export default Home;