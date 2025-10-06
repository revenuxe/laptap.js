import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import TrustSignals from "@/components/TrustSignals";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProcessSteps />
        <TrustSignals />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
