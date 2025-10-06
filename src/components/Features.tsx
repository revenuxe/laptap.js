import { Shield, Zap, DollarSign, Truck, CheckCircle, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Quotes",
    description: "Get real-time pricing for your device in seconds with our smart pricing engine",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description: "We offer competitive market rates ensuring you get the maximum value for your device",
  },
  {
    icon: Truck,
    title: "Free Pickup",
    description: "Convenient doorstep pickup at your preferred time - completely free of charge",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data is wiped securely and all transactions are protected and encrypted",
  },
  {
    icon: Clock,
    title: "Fast Payment",
    description: "Receive payment within 24 hours of device verification directly to your account",
  },
  {
    icon: CheckCircle,
    title: "Quality Check",
    description: "Professional device inspection to ensure fair and accurate pricing",
  },
];

const Features = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make selling your devices simple, secure, and rewarding with our streamlined process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border-2 border-border bg-card p-8 transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
