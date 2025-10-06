import { Users, Package, DollarSign, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers",
  },
  {
    icon: Package,
    value: "75,000+",
    label: "Devices Sold",
  },
  {
    icon: DollarSign,
    value: "$10M+",
    label: "Paid to Customers",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Customer Rating",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
