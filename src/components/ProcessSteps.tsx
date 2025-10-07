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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
            )}
          </div>
        );
      })}
    </div>
  );
};
export default ProcessSteps;