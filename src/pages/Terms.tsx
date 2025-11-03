import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Laptap | User Agreement & Policies</title>
        <meta name="description" content="Read Laptap's terms and conditions covering warranties, returns, refunds, pricing, and legal compliance for buying and selling laptops." />
        <link rel="canonical" href="https://www.laptap.in/terms" />
        <meta property="og:title" content="Terms & Conditions - Laptap" />
        <meta property="og:url" content="https://laptap.in/terms" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 md:py-24">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p>
                  Welcome to Laptap. By accessing or using our services, you agree to be bound by these Terms and Conditions. 
                  Please read them carefully before using our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services</h2>
                <p>
                  Laptap provides a platform for buying and selling used, refurbished, and pre-owned laptops and desktops. 
                  We facilitate transactions between sellers and buyers, offering price quotes, pickup services, and payment processing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Pricing & Valuation</h2>
                <p>
                  All price quotes provided through our platform are estimates based on the information provided by the seller. 
                  Final prices may vary after physical inspection of the device. We reserve the right to adjust quotes if the 
                  device condition differs from what was initially described.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Warranties</h2>
                <p>
                  All refurbished devices sold by Laptap come with a limited warranty covering hardware defects. The warranty 
                  period and coverage details are specified at the time of purchase. Warranty does not cover:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Physical damage caused by misuse or accidents</li>
                  <li>Software issues or virus infections</li>
                  <li>Cosmetic wear and tear</li>
                  <li>Unauthorized repairs or modifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Returns & Refunds</h2>
                <p>
                  For devices purchased from Laptap, we offer a 7-day return policy from the date of delivery, subject to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device must be in original condition with all accessories</li>
                  <li>Original packaging must be intact</li>
                  <li>No physical damage or signs of use</li>
                  <li>Return shipping costs are borne by the customer unless the product is defective</li>
                </ul>
                <p className="mt-4">
                  Refunds will be processed within 7-10 business days after inspection of the returned device.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seller Responsibilities</h2>
                <p>
                  When selling a device through Laptap, sellers must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information about the device condition</li>
                  <li>Remove all personal data and perform a factory reset</li>
                  <li>Include all original accessories (if applicable)</li>
                  <li>Provide valid ownership documentation if requested</li>
                  <li>Ensure the device is not reported stolen or locked</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Payment Terms</h2>
                <p>
                  Payments for sold devices are processed immediately after verification. We support multiple payment methods 
                  including bank transfer, UPI, and digital wallets. Payment processing time may vary depending on the method chosen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                <p>
                  Laptap shall not be liable for any indirect, incidental, special, or consequential damages arising from the use 
                  of our services. Our total liability shall not exceed the transaction value of the specific sale or purchase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Intellectual Property</h2>
                <p>
                  All content, trademarks, and intellectual property on the Laptap platform are owned by Laptap or its licensors. 
                  Users may not reproduce, distribute, or create derivative works without explicit permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Privacy & Data Protection</h2>
                <p>
                  Your use of our services is also governed by our Privacy Policy. We are committed to protecting your personal 
                  information and complying with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
                <p>
                  These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive 
                  jurisdiction of courts in Bangalore, Karnataka.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
                <p>
                  Laptap reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant 
                  changes via email or website notification. Continued use of our services after changes constitutes acceptance of 
                  the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
                <p>
                  For questions about these Terms and Conditions, please contact us at:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> laptap.in@gmail.com<br />
                  <strong>Address:</strong> HBR Layout, Nagawara Main Road, Bangalore – 560045
                </p>
              </section>

              <p className="text-sm mt-8">
                <strong>Last Updated:</strong> October 7, 2025
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Terms;
