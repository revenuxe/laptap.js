import { MapPin } from "lucide-react";

interface AreasWeServiceProps {
  city: string;
  areas: string[];
}

const AreasWeService = ({ city, areas }: AreasWeServiceProps) => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Areas We Service in {city}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Free doorstep pickup service available across all localities in {city}. 
            Our verified technicians reach your location within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary transition-all hover:shadow-md"
            >
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{area}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Don't see your area? <span className="text-primary font-medium">We service all areas in {city}!</span> Contact us for immediate pickup.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AreasWeService;
