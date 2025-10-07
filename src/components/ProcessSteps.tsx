import { CheckCircle2, MapPin, Banknote, Package } from "lucide-react";
const steps = [{
  icon: CheckCircle2,
  title: "Select Device",
  description: "Choose your laptop or desktop model"
}, {
  icon: Banknote,
  title: "Get Price Estimate",
  description: "Instant valuation for your device"
}, {
  icon: MapPin,
  title: "Enter Address",
  description: "Provide pickup location details"
}, {
  icon: Package,
  title: "Pickup & Payment",
  description: "Same-day pickup and instant payment"
}];
const ProcessSteps = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProcessSteps;