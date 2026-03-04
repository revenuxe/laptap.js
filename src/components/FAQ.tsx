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

  const faqs = [
    {
      question: `How do I sell my old laptop in ${locationText}?`,
      answer: `Selling your old laptop in ${locationText} is simple with Laptap. First, get an instant quote by selecting your laptop brand and model on our website. Then schedule a free doorstep pickup at your convenience. Our verified technicians will visit your location, inspect the device, and provide instant payment via UPI, bank transfer, or cash.`,
    },
    {
      question: `What is the best price for my used laptop in ${locationText}?`,
      answer: `Laptap offers the most competitive prices for used laptops in ${locationText}. The price depends on your laptop's brand, model, specifications, age, and physical condition. Our advanced pricing algorithm ensures you get up to 30% more than other buyers.`,
    },
    {
      question: `Which laptop brands do you buy in ${locationText}?`,
      answer: `We buy all major laptop brands in ${locationText} including Apple MacBook, Dell, HP, Lenovo, Asus, Acer, Microsoft Surface, and gaming laptops. We accept all brands and models in any working condition.`,
    },
    {
      question: `How quickly will I receive payment?`,
      answer: `You receive instant payment immediately after our technicians verify your laptop during the doorstep pickup. The verification process takes only 10-15 minutes, and payment is transferred instantly via UPI, IMPS bank transfer, or cash.`,
    },
    {
      question: `Is doorstep pickup really free in ${locationText}?`,
      answer: `Yes, we offer completely free same-day doorstep pickup across all areas of ${locationText}. There are no hidden charges or fees. Our verified technicians will come to your home or office at your preferred time slot.`,
    },
    {
      question: `Can I sell a broken or damaged laptop?`,
      answer: `Absolutely! We buy laptops in all conditions - working, broken, damaged, or non-functional. Whether your laptop has a cracked screen, dead battery, water damage, or motherboard issues, we'll still make you a fair offer.`,
    },
    {
      question: `What documents do I need to sell my laptop?`,
      answer: `You need a valid government-issued ID proof (Aadhaar card, PAN card, driver's license, or passport). If you have the original purchase invoice, that helps but is not required.`,
    },
    {
      question: `Do you buy desktops and mobile phones too?`,
      answer: `Yes! Besides laptops, we also buy used desktop computers and mobile phones. Our process is the same - get an instant quote, schedule free pickup, and receive immediate payment.`,
    },
  ];

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight sm:text-4xl mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Everything you need to know about selling your laptop in {locationText}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border rounded-xl sm:rounded-lg px-4 sm:px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline py-3 sm:py-4">
                  <span className="font-semibold text-sm sm:text-base pr-2">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-xs sm:text-sm leading-relaxed">
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
