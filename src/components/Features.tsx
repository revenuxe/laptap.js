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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
};
export default Features;