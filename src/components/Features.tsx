import { Shield, Zap, DollarSign, Truck, CheckCircle, Clock } from "lucide-react";
const features = [{
  icon: Zap,
  title: "Instant Quotes",
  description: "Get real-time pricing for your device in seconds with our smart pricing engine"
}, {
  icon: DollarSign,
  title: "Best Prices",
  description: "We offer competitive market rates ensuring you get the maximum value for your device"
}, {
  icon: Truck,
  title: "Free Pickup",
  description: "Convenient doorstep pickup at your preferred time - completely free of charge"
}, {
  icon: Shield,
  title: "100% Secure",
  description: "Your data is wiped securely and all transactions are protected and encrypted"
}, {
  icon: Clock,
  title: "Instant Payment",
  description: "Receive instant payment after device verification directly to your account"
}, {
  icon: CheckCircle,
  title: "Quality Check",
  description: "Professional device inspection to ensure fair and accurate pricing"
}];
const Features = () => {
  return (
    <section className="py-16 bg-accent/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Laptap?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the easiest and most secure way to sell your old laptops and desktops
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-background hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;