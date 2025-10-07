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
    <section className="py-20 px-4 bg-secondary/10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
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