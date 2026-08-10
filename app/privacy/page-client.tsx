"use client";


import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const PageClient = () => {
  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16 md:py-24">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p>
                  At Laptap, we are committed to protecting your privacy and personal information. This Privacy Policy explains 
                  how we collect, use, store, and protect your data when you use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, postal address</li>
                  <li><strong>Device Information:</strong> Details about laptops/desktops you're selling or buying</li>
                  <li><strong>Transaction Data:</strong> Purchase history, payment information, order details</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                  <li><strong>Usage Data:</strong> How you interact with our website and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing transactions and providing quotes</li>
                  <li>Scheduling pickup and delivery services</li>
                  <li>Communicating about your orders and services</li>
                  <li>Improving our website and customer experience</li>
                  <li>Sending promotional offers (with your consent)</li>
                  <li>Complying with legal obligations</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies & Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                  and understand user preferences. You can control cookie settings through your browser, but disabling cookies 
                  may affect website functionality.
                </p>
                <p className="mt-4">Types of cookies we use:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Sharing & Disclosure</h2>
                <p>
                  We do not sell your personal information to third parties. We may share your data with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Payment processors, delivery partners, technical support</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized access, 
                  alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. Transaction records are typically 
                  retained for 7 years as required by Indian law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Your Rights</h2>
                <p>
                  Under applicable data protection laws, you have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Objection:</strong> Object to certain data processing activities</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Withdraw Consent:</strong> Opt-out of marketing communications</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at laptap.in@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
                <p>
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                  information from children. If we become aware of such collection, we will take steps to delete the information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of 
                  these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries outside of India. We ensure appropriate 
                  safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. GDPR Compliance</h2>
                <p>
                  For users in the European Union, we comply with the General Data Protection Regulation (GDPR). We process 
                  your data based on legal grounds such as consent, contract performance, legal obligations, and legitimate interests.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or 
                  website notification. The "Last Updated" date indicates when the policy was last revised.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> laptap.in@gmail.com<br />
                  <strong>Address:</strong> HBR Layout, Nagawara Main Road, Bangalore – 560045
                </p>
              </section>

              <div className="mt-8 p-6 bg-muted rounded-lg space-y-4">
                <p className="text-center">
                  For more information, read our <Link href="/terms" className="text-primary hover:underline font-semibold">Terms & Conditions</Link>.
                </p>
                <p className="text-center">
                  Ready to sell your laptop? <Link href="/sell" className="text-primary hover:underline font-semibold">Get an instant quote</Link> or learn <Link href="/about" className="text-primary hover:underline font-semibold">more about us</Link>.
                </p>
              </div>

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

