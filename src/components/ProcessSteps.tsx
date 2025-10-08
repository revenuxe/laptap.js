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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 relative">
              <Icon className="w-6 h-6 text-primary" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {index + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
};
export default ProcessSteps;