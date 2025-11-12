import SimpleForm from "./SimpleForm";
import { Card } from "./ui/card";

interface HeroFormProps {
  defaultSellingType?: string;
  title?: string;
  description?: string;
}

const HeroForm = ({ defaultSellingType, title, description }: HeroFormProps) => {
  return (
    <Card className="p-6 md:p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-2">
        {title || "Get Instant Quote"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {description || "Fill in your details and get the best price for your device"}
      </p>
      <SimpleForm defaultSellingType={defaultSellingType} />
    </Card>
  );
};

export default HeroForm;