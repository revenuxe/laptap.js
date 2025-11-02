import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  location?: string;
}

const FAQ = ({ location }: FAQProps) => {
  const locationText = location || "India";
  const locationSlug = location?.toLowerCase() || "";

  const faqs = [
    {
      question: `How do I sell my old laptop in ${locationText}?`,
      answer: `Selling your old laptop in ${locationText} is simple with Laptap. First, get an instant quote by selecting your laptop brand and model on our website. Then schedule a free doorstep pickup at your convenience. Our verified technicians will visit your location in ${locationText}, inspect the device, and provide instant payment via UPI, bank transfer, or cash. The entire process takes less than 24 hours from quote to payment.`,
    },
    {
      question: `What is the best price for my used laptop in ${locationText}?`,
      answer: `Laptap offers the most competitive prices for used laptops in ${locationText}. The price depends on your laptop's brand (Dell, HP, Lenovo, Apple MacBook, Asus, Acer), model, specifications (RAM, processor, storage), age, and physical condition. Our advanced pricing algorithm ensures you get up to 30% more than other buyers. Get an instant quote now to see the best price for your specific laptop model in ${locationText}.`,
    },
    {
      question: `Which laptop brands do you buy in ${locationText}?`,
      answer: `We buy all major laptop brands in ${locationText} including Apple MacBook (MacBook Pro, MacBook Air), Dell (XPS, Inspiron, Latitude, Alienware), HP (Pavilion, EliteBook, Spectre, Omen), Lenovo (ThinkPad, IdeaPad, Legion), Asus (ZenBook, VivoBook, ROG), Acer (Aspire, Predator, Swift), Microsoft Surface, and gaming laptops. Whether you want to sell a premium business laptop or a budget device, we accept all brands and models in any working condition.`,
    },
    {
      question: `How quickly will I receive payment after selling my laptop in ${locationText}?`,
      answer: `You receive instant payment immediately after our technicians verify your laptop during the doorstep pickup in ${locationText}. The verification process takes only 10-15 minutes, and payment is transferred instantly via UPI, IMPS bank transfer, or cash - whichever you prefer. Unlike other buyers who make you wait days for payment, Laptap guarantees same-day payment within 24 hours of scheduling your pickup in ${locationText}.`,
    },
    {
      question: `Is doorstep pickup really free in ${locationText}?`,
      answer: `Yes, we offer completely free same-day doorstep pickup across all areas of ${locationText}. There are no hidden charges or fees. Our verified technicians will come to your home, office, or any location in ${locationText} at your preferred time slot. The pickup service is available 7 days a week, and you can reschedule if needed at no extra cost.`,
    },
    {
      question: `Can I sell a broken or damaged laptop in ${locationText}?`,
      answer: `Absolutely! We buy laptops in all conditions in ${locationText} - working, broken, damaged, or non-functional. Whether your laptop has a cracked screen, dead battery, water damage, motherboard issues, or won't turn on, we'll still make you an offer. Our technicians are experts at evaluating damaged devices and will quote a fair price based on salvageable parts and repair potential in ${locationText}.`,
    },
    {
      question: `What documents do I need to sell my laptop in ${locationText}?`,
      answer: `To sell your laptop in ${locationText}, you need a valid government-issued ID proof (Aadhaar card, PAN card, driver's license, or passport) and proof of purchase if available (original invoice or bill). The ID is required for verification and payment purposes. If you don't have the original purchase invoice, that's okay - we can still process your sale in ${locationText} with just your ID proof.`,
    },
    {
      question: `Do you buy old desktop computers and mobile phones in ${locationText} too?`,
      answer: `Yes! Besides laptops, we also buy used desktop computers (all-in-one PCs, gaming desktops, workstations) and mobile phones (iPhones, Samsung, OnePlus, Xiaomi, etc.) in ${locationText}. Our process is the same - get an instant quote online, schedule free pickup, and receive immediate payment. We're your one-stop solution for selling all types of electronic devices in ${locationText}.`,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about selling your laptop in {locationText}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
