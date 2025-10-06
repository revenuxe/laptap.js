import { CheckCircle2, MapPin, Banknote, Package } from "lucide-react";

const steps = [
  {
    icon: CheckCircle2,
    title: "Select Device",
    description: "Choose your laptop or desktop model",
  },
  {
    icon: Banknote,
    title: "Get Price Estimate",
    description: "Instant valuation for your device",
  },
  {
    icon: MapPin,
    title: "Enter Address",
    description: "Provide pickup location details",
  },
  {
    icon: Package,
    title: "Pickup & Payment",
    description: "Same-day pickup and instant payment",
  },
];

const ProcessSteps = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple & Transparent Process
          </h2>
          <p className="text-lg text-muted-foreground">
            Sell your device in 4 easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden lg:block w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
