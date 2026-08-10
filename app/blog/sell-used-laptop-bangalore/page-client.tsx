"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, TrendingUp, Shield, Zap, MapPin, Clock, DollarSign, Laptop } from "lucide-react";

export const PageClient = () => {
  const router = useRouter();

  return (
    <>
      

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-16 md:py-24">
            <div className="container max-w-4xl">
              <div className="text-center mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Laptop className="h-4 w-4" />
                  Ultimate Guide 2024
                </div>
                
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  How to Sell Used Laptop in Bangalore:{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Complete Guide
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8">
                  Everything you need to know about selling your used laptop in Bangalore for the best price. 
                  From preparation to payment, we cover it all.
                </p>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span>📅 Updated Jan 2024</span>
                  <span> 15 min read</span>
                  <span>💡 Expert Guide</span>
                </div>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="py-8 bg-muted/30">
            <div className="container max-w-4xl">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold mb-4">📋 Table of Contents</h2>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <a href="#introduction" className="text-primary hover:underline">1. Introduction</a>
                  <a href="#why-sell" className="text-primary hover:underline">2. Why Sell Your Laptop in Bangalore?</a>
                  <a href="#best-places" className="text-primary hover:underline">3. Best Places to Sell</a>
                  <a href="#preparation" className="text-primary hover:underline">4. Preparing Your Laptop</a>
                  <a href="#pricing" className="text-primary hover:underline">5. Understanding Resale Prices</a>
                  <a href="#process" className="text-primary hover:underline">6. Step-by-Step Selling Process</a>
                  <a href="#areas" className="text-primary hover:underline">7. Bangalore Areas Covered</a>
                  <a href="#tips" className="text-primary hover:underline">8. Expert Tips</a>
                  <a href="#common-mistakes" className="text-primary hover:underline">9. Common Mistakes to Avoid</a>
                  <a href="#faq" className="text-primary hover:underline">10. FAQs</a>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <article className="py-16">
            <div className="container max-w-4xl prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section id="introduction" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Introduction: Selling Used Laptops in Bangalore's Tech Hub</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bangalore, India's Silicon Valley, is home to over 12 million people and thousands of tech professionals. With rapid technology upgrades, the city generates massive demand for used laptops while simultaneously creating opportunities to sell old devices. Whether you're upgrading to the latest MacBook Pro M3, switching from Dell to HP, or simply need quick cash, Bangalore offers numerous options to sell your used laptop.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In 2024, the used laptop market in Bangalore is thriving with an estimated ₹500+ crore annual turnover. Areas like Koramangala, Indiranagar, Whitefield, and Electronic City see hundreds of laptop transactions daily. However, getting the best price requires knowledge of market rates, trusted platforms, and smart negotiation strategies.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This comprehensive guide will help you router the entire process of selling your used laptop in Bangalore - from initial preparation to final payment, ensuring you get maximum value while avoiding common pitfalls.
                </p>
              </section>

              {/* Why Sell */}
              <section id="why-sell" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Why Sell Your Used Laptop in Bangalore?</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-xl bg-muted/50 border border-border">
                    <TrendingUp className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-xl font-bold mb-2">Strong Market Demand</h3>
                    <p className="text-sm text-muted-foreground">
                      Bangalore has India's highest demand for used laptops. Students, startups, and SMEs constantly seek affordable devices, ensuring quick sales at competitive prices.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-muted/50 border border-border">
                    <DollarSign className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-xl font-bold mb-2">Better Resale Values</h3>
                    <p className="text-sm text-muted-foreground">
                      Tech-savvy Bangalore buyers appreciate quality devices, offering 40-60% of original price vs 30-40% in tier-2 cities.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-muted/50 border border-border">
                    <Clock className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-xl font-bold mb-2">Quick Transactions</h3>
                    <p className="text-sm text-muted-foreground">
                      Multiple platforms offer instant quotes and same-day doorstep pickup across Bangalore, converting your laptop to cash within hours.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-muted/50 border border-border">
                    <MapPin className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-xl font-bold mb-2">Convenient Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Doorstep pickup available in all areas - Koramangala, HSR, Whitefield, Indiranagar, making selling hassle-free.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 mt-8">Financial Benefits of Selling in Bangalore</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Depreciation Recovery:</strong> Recover 40-60% of original cost instead of 0% by keeping unused devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Upgrade Funding:</strong> Use proceeds to offset costs of new laptop purchases (₹20,000-₹80,000 typical recovery)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Tax Benefits:</strong> Selling through registered platforms provides legitimate receipts for accounting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Environmental Impact:</strong> E-waste reduction while earning money - Bangalore generates 90,000+ tons annually</span>
                  </li>
                </ul>
              </section>

              {/* Best Places */}
              <section id="best-places" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Best Places to Sell Used Laptops in Bangalore (2024)</h2>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-card border-2 border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                      <div>
                        <h3 className="text-xl font-bold">Online Buyback Platforms (Recommended)</h3>
                        <p className="text-sm text-primary">Best for: Quick, Hassle-free Sales with Maximum Price</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      <strong>Platforms like Laptap</strong> offer the most convenient experience in Bangalore:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Instant Online Quotes:</strong> Get accurate pricing in 2 minutes based on model, year, specs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Free Doorstep Pickup:</strong> Same-day service across Koramangala, Whitefield, Indiranagar, HSR (2-4 hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Instant Payment:</strong> UPI, bank transfer, or cash immediately after verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Data Security:</strong> Professional data wiping with certificates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                        <span><strong>Best Prices:</strong> 15-20% higher than local dealers due to no middlemen</span>
                      </li>
                    </ul>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm"><strong>💡 Pro Tip:</strong> Laptap provides the highest resale values in Bangalore with 4.9★ rating from 5000+ sellers across Koramangala, Indiranagar, Whitefield.</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">2</div>
                      <div>
                        <h3 className="text-xl font-bold">SP Road & Commercial Street Markets</h3>
                        <p className="text-sm text-muted-foreground">Best for: Immediate Cash, Negotiable Prices</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      Bangalore's famous electronics markets where dozens of buyers compete:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong className="text-foreground">✓ Pros:</strong>
                        <ul className="text-muted-foreground mt-1 space-y-1">
                          <li>• Instant cash in hand</li>
                          <li>• Multiple buyers = better negotiation</li>
                          <li>• No waiting period</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground"> Cons:</strong>
                        <ul className="text-muted-foreground mt-1 space-y-1">
                          <li>• Prices 20-30% lower than online</li>
                          <li>• Travel required (traffic, parking)</li>
                          <li>• Aggressive negotiation tactics</li>
                          <li>• No data security guarantees</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">3</div>
                      <div>
                        <h3 className="text-xl font-bold">OLX & Quikr Classifieds</h3>
                        <p className="text-sm text-muted-foreground">Best for: Direct Buyer Contact, Potentially Higher Prices</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong className="text-foreground">✓ Pros:</strong>
                        <ul className="text-muted-foreground mt-1 space-y-1">
                          <li>• Set your own price</li>
                          <li>• Direct buyer interaction</li>
                          <li>• Potentially 10-15% more than dealers</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-foreground"> Cons:</strong>
                        <ul className="text-muted-foreground mt-1 space-y-1">
                          <li>• Time-consuming (1-3 weeks typical)</li>
                          <li>• Fake buyers, safety concerns</li>
                          <li>• Meeting strangers for demos</li>
                          <li>• Payment fraud risks</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">4</div>
                      <div>
                        <h3 className="text-xl font-bold">Brand Authorized Service Centers</h3>
                        <p className="text-sm text-muted-foreground">Best for: Exchange Programs, Warranty Concerns</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Apple, Dell, HP, Lenovo service centers in Bangalore offer exchange programs but typically provide 30-40% lower valuations compared to independent buyers.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary">
                  <h3 className="text-xl font-bold mb-3">🎯 Recommendation for Bangalore Sellers</h3>
                  <p className="text-muted-foreground">
                    For 90% of laptop sales in Bangalore, <strong>online buyback platforms like Laptap</strong> provide the best combination of price, convenience, and security. Use SP Road/Commercial Street only if you need cash within 1 hour and don't mind getting 20-30% less.
                  </p>
                </div>
              </section>

              {/* Preparation */}
              <section id="preparation" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Preparing Your Laptop for Sale: 10-Step Checklist</h2>
                
                <p className="text-muted-foreground mb-6">
                  Proper preparation can increase your laptop's resale value by ₹3,000-₹10,000 in Bangalore's competitive market. Follow these steps:
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: "1. Backup All Important Data",
                      desc: "Use Google Drive, Dropbox, or external hard drive. Don't lose photos, documents, or project files worth lakhs of rupees.",
                      tip: "Bangalore tip: Many Koramangala cafes offer free WiFi for cloud backups if your home internet is slow."
                    },
                    {
                      title: "2. Sign Out of All Accounts",
                      desc: "Gmail, Microsoft, Apple ID, banking apps, Adobe, Office 365, VPN services. Prevents unauthorized access post-sale.",
                      tip: "Check 'Settings > Accounts' on Windows or 'System Preferences > Internet Accounts' on Mac."
                    },
                    {
                      title: "3. Deauthorize Software Licenses",
                      desc: "Adobe Creative Suite, Microsoft Office, Antivirus allow limited devices. Deauthorize to use licenses on new laptop.",
                      tip: "Worth ₹10,000+ in license value that you can reuse."
                    },
                    {
                      title: "4. Factory Reset / Format",
                      desc: "Windows: Settings > Update & Security > Recovery > Reset. Mac: Restart > Cmd+R > Disk Utility > Erase.",
                      tip: "Professional buyers verify this. Skipping reduces price by ₹2,000-₹5,000."
                    },
                    {
                      title: "5. Clean Physically",
                      desc: "Wipe screen, keyboard, trackpad with microfiber cloth. Remove dust from vents, ports. Clean appearance = ₹1,000-₹3,000 extra.",
                      tip: "Bangalore dust accumulates fast. Compressed air cans available at SP Road (₹200-₹300)."
                    },
                    {
                      title: "6. Gather Original Accessories",
                      desc: "Charger, box, warranty card, purchase invoice. Having original packaging increases value by 10-15%.",
                      tip: "Original Apple/Dell chargers alone worth ₹2,000-₹5,000 in Bangalore market."
                    },
                    {
                      title: "7. Check for Hardware Issues",
                      desc: "Test keyboard keys, trackpad, USB ports, HDMI, audio, webcam, WiFi, Bluetooth. Note any defects honestly.",
                      tip: "Buyers will test anyway. Honesty builds trust and speeds up sale."
                    },
                    {
                      title: "8. Note Specifications Accurately",
                      desc: "Processor (Intel i5/i7, AMD Ryzen), RAM (8GB/16GB), Storage (256GB SSD/512GB), Graphics (Integrated/Dedicated), Screen size.",
                      tip: "Check System Properties (Windows) or About This Mac (macOS) for exact specs."
                    },
                    {
                      title: "9. Remove Personal Stickers/Marks",
                      desc: "Company logos, political stickers, custom skins reduce appeal. Buyers prefer clean professional look.",
                      tip: "Use Goo Gone or rubbing alcohol to remove adhesive residue safely."
                    },
                    {
                      title: "10. Photograph from Multiple Angles",
                      desc: "For online listings: front, back, sides, screen, keyboard, ports, any damage. Good photos = faster sales.",
                      tip: "Natural lighting gives best results. Bangalore afternoon light (3-5 PM) ideal."
                    }
                  ].map((step, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border">
                      <h3 className="font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{step.desc}</p>
                      <div className="bg-primary/10 p-3 rounded-lg text-sm">
                        <strong>💡 {step.tip}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pricing */}
              <section id="pricing" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Understanding Laptop Resale Prices in Bangalore (2024)</h2>
                
                <p className="text-muted-foreground mb-6">
                  Bangalore's used laptop prices depend on 7 key factors. Here's what determines your laptop's value:
                </p>

                <div className="mb-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Brand & Model</th>
                        <th className="border border-border p-3 text-left">Year</th>
                        <th className="border border-border p-3 text-left">Bangalore Price Range</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border border-border p-3 font-medium">MacBook Pro 16" M3 Max</td>
                        <td className="border border-border p-3">2024</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹1,20,000 - ₹2,50,000</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-3 font-medium">MacBook Air M2</td>
                        <td className="border border-border p-3">2023</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹55,000 - ₹85,000</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Dell XPS 15 (i7, 16GB)</td>
                        <td className="border border-border p-3">2023</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹50,000 - ₹95,000</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-3 font-medium">HP Pavilion (i5, 8GB)</td>
                        <td className="border border-border p-3">2022</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹25,000 - ₹40,000</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">Lenovo ThinkPad X1</td>
                        <td className="border border-border p-3">2021</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹35,000 - ₹65,000</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border border-border p-3 font-medium">Asus VivoBook (i3, 4GB)</td>
                        <td className="border border-border p-3">2020</td>
                        <td className="border border-border p-3 text-primary font-semibold">₹15,000 - ₹25,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-2xl font-bold mb-4">Factors Affecting Bangalore Laptop Prices</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">1. Brand Premium (20-40% variance)</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>High Premium:</strong> Apple MacBook (60% resale value), Dell XPS (55%), Microsoft Surface (50%)<br/>
                      <strong>Medium:</strong> HP Pavilion (45%), Lenovo ThinkPad (45%), Asus ROG (40%)<br/>
                      <strong>Lower:</strong> Acer Aspire (35%), Asus VivoBook (30%)
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">2. Age & Depreciation</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Year 1:</strong> 20-25% depreciation<br/>
                      <strong>Year 2:</strong> Additional 15-20%<br/>
                      <strong>Year 3:</strong> Additional 10-15%<br/>
                      <strong>4+ years:</strong> Drops to 20-30% of original price
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">3. Processor Impact (₹5,000-₹20,000 difference)</h4>
                    <p className="text-sm text-muted-foreground">
                      Intel i3/Celeron: Budget segment<br/>
                      Intel i5/AMD Ryzen 5: +₹8,000-₹12,000<br/>
                      Intel i7/AMD Ryzen 7: +₹15,000-₹25,000<br/>
                      Intel i9/Apple M-series: Premium +₹30,000-₹80,000
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">4. RAM & Storage (₹3,000-₹15,000 boost)</h4>
                    <p className="text-sm text-muted-foreground">
                      4GB RAM: Entry level<br/>
                      8GB RAM: +₹3,000-₹5,000<br/>
                      16GB RAM: +₹8,000-₹12,000<br/>
                      32GB+ RAM: +₹15,000-₹25,000<br/>
                      SSD vs HDD: +₹5,000-₹10,000 (256GB SSD preferred in Bangalore market)
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">5. Physical Condition (₹5,000-₹20,000 variation)</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Excellent (90-95%):</strong> Like new, no scratches, perfect screen<br/>
                      <strong>Good (70-85%):</strong> Minor wear, small scratches acceptable<br/>
                      <strong>Fair (50-65%):</strong> Visible wear, dents, but fully functional<br/>
                      <strong>Poor (30-45%):</strong> Cracked screen, major damage, parts missing
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">6. Bangalore Area Dynamics</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Premium areas</strong> (Koramangala, Indiranagar, Whitefield): Higher-spec laptops preferred, better prices<br/>
                      <strong>Budget areas</strong> (Marathahalli, BTM): Value-focused buyers, negotiate harder<br/>
                      <strong>Corporate belts</strong> (Electronic City, Manyata Tech Park): Business laptops (ThinkPad, Dell Latitude) fetch premium
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h4 className="font-bold mb-2">7. Market Timing</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Peak demand:</strong> July-August (college admissions), December-January (year-end bonuses)<br/>
                      <strong>Lower demand:</strong> February-March (post-festive), May-June (slow period)
                    </p>
                  </div>
                </div>
              </section>

              {/* Process */}
              <section id="process" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Step-by-Step: Selling Your Laptop in Bangalore (Fastest Method)</h2>
                
                <p className="text-muted-foreground mb-6">
                  Here's exactly how to sell your laptop in Bangalore in under 4 hours using online platforms:
                </p>

                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Get Instant Online Quote (2 minutes)",
                      desc: "Visit Laptap.in, select your laptop brand (Apple, Dell, HP, Lenovo, Asus), series, model, and configuration. Answer condition questions honestly.",
                      result: "Receive instant price quote based on current Bangalore market rates.",
                      time: " 2 minutes"
                    },
                    {
                      step: "2",
                      title: "Schedule Free Doorstep Pickup (1 minute)",
                      desc: "Choose convenient time slot (morning 10AM-1PM, afternoon 2PM-5PM, evening 5PM-8PM). Enter your Bangalore address - Koramangala, Indiranagar, Whitefield, HSR, etc.",
                      result: "Confirmation SMS/email with technician details and estimated arrival time.",
                      time: " 1 minute"
                    },
                    {
                      step: "3",
                      title: "Wait for Doorstep Visit (2-4 hours in Bangalore)",
                      desc: "Verified technician with ID proof arrives at your location. Professional, courteous service guaranteed.",
                      result: "No need to travel to SP Road or Commercial Street, saving 2-3 hours.",
                      time: " 2-4 hours waiting"
                    },
                    {
                      step: "4",
                      title: "Laptop Verification (10-15 minutes)",
                      desc: "Technician checks: Power on/off, display quality, keyboard/trackpad functionality, ports (USB, HDMI), WiFi/Bluetooth, battery health, physical condition, specifications match.",
                      result: "Final price confirmed (matches quote if condition accurate).",
                      time: " 10-15 minutes"
                    },
                    {
                      step: "5",
                      title: "Instant Payment (2 minutes)",
                      desc: "Choose payment method: UPI (PhonePe, GPay, Paytm), Bank Transfer (NEFT/IMPS), Cash (up to ₹50,000).",
                      result: "Money in your account immediately after laptop handover.",
                      time: " 2 minutes"
                    },
                    {
                      step: "6",
                      title: "Data Wiping Certificate (Optional)",
                      desc: "Professional data wiping performed with industry-standard tools. Certificate provided for your records.",
                      result: "100% peace of mind about data security.",
                      time: " Done after pickup"
                    }
                  ].map((item, index) => (
                    <div key={index} className="relative pl-16 pb-8 border-l-2 border-dashed border-primary/30 last:border-l-0 last:pb-0">
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {item.step}
                      </div>
                      <div className="bg-card border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <span className="text-sm text-primary font-medium">{item.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                        <div className="bg-primary/10 p-3 rounded-lg text-sm">
                          <strong>✓ Result:</strong> {item.result}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-xl bg-primary/10 border border-primary text-center">
                  <h3 className="text-xl font-bold mb-3">🎯 Total Time: 2-4 Hours</h3>
                  <p className="text-muted-foreground mb-4">
                    From quote to payment in under 4 hours - fastest way to sell laptops in Bangalore. 
                    Compare this to 1-3 weeks on OLX/Quikr or full day trip to SP Road.
                  </p>
                  <Button size="lg" variant="cta" onClick={() => router.push("/sell/laptop")}>
                    Get Your Instant Quote Now
                  </Button>
                </div>
              </section>

              {/* Areas */}
              <section id="areas" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Bangalore Areas with Laptop Pickup Services</h2>
                
                <p className="text-muted-foreground mb-6">
                  Free doorstep laptop pickup available across all Bangalore localities. Here's what makes each area unique:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      area: "Koramangala",
                      desc: "Startup hub with highest MacBook resale demand. 30+ pickups daily. Premium pricing for high-spec laptops.",
                      popular: "MacBook Pro, Dell XPS, ThinkPad X1"
                    },
                    {
                      area: "Indiranagar",
                      desc: "Affluent residential area. Quick sales for gaming laptops (Asus ROG, MSI). 2-hour pickup guarantee.",
                      popular: "Gaming laptops, MacBook Air, HP Envy"
                    },
                    {
                      area: "Whitefield",
                      desc: "IT corridor with massive demand. Best area for corporate laptops (Dell Latitude, HP EliteBook). Same-day payment.",
                      popular: "Business laptops, ThinkPad, Dell Inspiron"
                    },
                    {
                      area: "Electronic City",
                      desc: "Tech park employees upgrading frequently. High volume sales area. Competitive pricing.",
                      popular: "All mid-range laptops (₹20K-₹60K)"
                    },
                    {
                      area: "HSR Layout",
                      desc: "Young professionals area. Strong demand for 2-3 year old laptops. Fast transactions.",
                      popular: "HP Pavilion, Asus VivoBook, Lenovo IdeaPad"
                    },
                    {
                      area: "Marathahalli",
                      desc: "Student-friendly area. Budget laptop demand. Quick cash for older models.",
                      popular: "Entry-level laptops (₹15K-₹35K)"
                    },
                    {
                      area: "BTM Layout",
                      desc: "Mixed residential-commercial. All laptop categories accepted. Multiple pickups hourly.",
                      popular: "Mixed - all brands and budgets"
                    },
                    {
                      area: "Jayanagar",
                      desc: "Established area. Family buyers prefer reliable brands (HP, Dell). Fair pricing.",
                      popular: "HP, Dell mainstream models"
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">{item.area}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                      <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <strong>Popular:</strong> {item.popular}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-5 rounded-xl bg-muted/30 border border-border text-center">
                  <p className="text-muted-foreground">
                    <strong>Other areas covered:</strong> Bannerghatta Road, Sarjapur Road, Hebbal, Yelahanka, Malleshwaram, Rajajinagar, JP Nagar, Bellandur, Bommanahalli, RT Nagar, Banashankari, and all other Bangalore localities.
                  </p>
                </div>
              </section>

              {/* Tips */}
              <section id="tips" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Expert Tips to Get Maximum Value in Bangalore</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: "🎯",
                      title: "Sell Before Major Apple/Dell Launches",
                      tip: "Prices drop 10-15% after new model announcements. Sell 2-3 months before (typically September for Apple, January for Dell/HP)."
                    },
                    {
                      icon: "💰",
                      title: "Keep Original Packaging & Accessories",
                      tip: "Original box, charger, warranty card add ₹2,000-₹5,000 value in Bangalore's quality-conscious market."
                    },
                    {
                      icon: "📱",
                      title: "Compare Multiple Platforms",
                      tip: "Get quotes from 2-3 online platforms. Typically vary by ₹2,000-₹5,000. Choose highest offer with good reviews."
                    },
                    {
                      icon: "",
                      title: "Never Share Passwords/OTPs",
                      tip: "Legitimate buyers never ask for email passwords, banking OTPs, or social media logins. Red flag for fraud."
                    },
                    {
                      icon: "✨",
                      title: "Minor Upgrades Worth It",
                      tip: "Cleaning, replacing worn keyboard stickers costs ₹500 but adds ₹2,000-₹3,000 value. Good ROI."
                    },
                    {
                      icon: "",
                      title: "Sell During Peak Seasons",
                      tip: "July-August (college admissions), December-January (bonuses) see 15-20% higher prices than off-seasons."
                    },
                    {
                      icon: "📸",
                      title: "Quality Photos Matter",
                      tip: "For OLX listings: 8-10 clear photos from all angles. Good lighting (natural afternoon light in Bangalore)."
                    },
                    {
                      icon: "💻",
                      title: "Mention Upgrades Clearly",
                      tip: "Upgraded RAM/SSD after purchase? Mention it! Buyers appreciate transparency and pay more."
                    },
                    {
                      icon: "",
                      title: "Honest Condition Description",
                      tip: "Over-promising leads to price negotiations at pickup. Honesty = smooth transactions."
                    },
                    {
                      icon: "🎓",
                      title: "Corporate Laptops Need De-registration",
                      tip: "Company-issued laptops: Get proper clearance, remove asset tags, deregister from domain. Adds legitimacy."
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-card border border-border">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Common Mistakes */}
              <section id="common-mistakes" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Common Mistakes to Avoid When Selling in Bangalore</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      mistake: " Accepting First Low Offer on SP Road",
                      fix: "✓ Visit 3-4 shops on SP Road or get online quotes first. Price variations of ₹5,000-₹15,000 common.",
                      loss: "Typical loss: ₹8,000-₹20,000"
                    },
                    {
                      mistake: " Meeting Unknown OLX Buyers Alone at Night",
                      fix: "✓ Meet in public places (cafes in Koramangala, Indiranagar during daytime) or use verified doorstep services.",
                      loss: "Safety risk, potential fraud"
                    },
                    {
                      mistake: " Not Backing Up Data Before Sale",
                      fix: "✓ Backup to cloud/external drive first. Once sold, data gone forever. Photos, documents, projects irreplaceable.",
                      loss: "Data loss worth lakhs"
                    },
                    {
                      mistake: " Lying About Laptop Condition",
                      fix: "✓ Disclose all issues honestly. Buyers test thoroughly anyway. Transparency builds trust, faster sales.",
                      loss: "Deal cancellations, wasted time"
                    },
                    {
                      mistake: " Selling Too Late (4+ years old)",
                      fix: "✓ Sell within 3 years for 40-50% recovery. Beyond 4 years, drops to 20-25% of original price.",
                      loss: "₹10,000-₹30,000 in depreciation"
                    },
                    {
                      mistake: " Ignoring Screen/Battery Issues",
                      fix: "✓ Cracked screen repair costs ₹5,000 but reduces sale price by ₹8,000-₹15,000. Consider fixing first.",
                      loss: "₹3,000-₹10,000 extra loss"
                    },
                    {
                      mistake: " Accepting Partial/Delayed Payments",
                      fix: "✓ Demand full payment before laptop handover. No checks, only UPI/cash. Delayed payment = potential fraud.",
                      loss: "Risk of never getting paid"
                    },
                    {
                      mistake: " Not Removing Personal Data Properly",
                      fix: "✓ Factory reset not enough. Use disk wiping tools (DBAN for Windows, Disk Utility for Mac). Identity theft risk otherwise.",
                      loss: "Personal data compromise"
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-card border border-border">
                      <div className="mb-3">
                        <p className="text-red-500 font-semibold mb-1">{item.mistake}</p>
                        <p className="text-green-600 font-semibold">{item.fix}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                        <strong>💸 Potential Loss:</strong> {item.loss}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions - Bangalore Laptop Selling</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      q: "What's the best day/time to sell laptop in Bangalore?",
                      a: "Weekdays 10AM-5PM see fastest pickups (under 2 hours). Avoid Sundays/public holidays when technicians have limited availability. Month-end (last week) slightly better prices as buyers meet targets."
                    },
                    {
                      q: "Can I sell laptop with broken screen in Bangalore?",
                      a: "Yes! Broken/cracked screen laptops accepted with 40-60% price reduction depending on model. MacBook screen damage: -₹15,000 to -₹30,000. Regular laptop screen: -₹3,000 to -₹8,000."
                    },
                    {
                      q: "Do I need to factory reset before selling in Bangalore?",
                      a: "Recommended but not mandatory. Most verified buyers perform factory reset anyway. However, doing it yourself ensures no personal data remains and builds buyer confidence."
                    },
                    {
                      q: "What documents needed to sell laptop in Bangalore?",
                      a: "Personal ID proof (Aadhar/PAN/Driving License) required by legitimate buyers for invoice generation. Original purchase invoice preferred but not mandatory. No other documents needed."
                    },
                    {
                      q: "Can I sell office/company laptop in Bangalore?",
                      a: "Only if you have proper clearance from employer. Company asset without clearance is illegal to sell. Get written permission and asset de-registration from IT department first."
                    },
                    {
                      q: "How long does entire laptop selling process take in Bangalore?",
                      a: "Online platforms (Laptap): 2-4 hours. SP Road visit: 3-5 hours (travel + negotiations). OLX/Quikr: 1-3 weeks (listing + buyer meetings). Fastest = verified online platforms."
                    },
                    {
                      q: "Is it safe to give laptop for inspection to strangers?",
                      a: "Use only verified platforms with technician ID verification. Legitimate services provide technician name, photo, ID proof before visit. Never hand over laptop without payment confirmation."
                    },
                    {
                      q: "What if quoted price doesn't match at pickup in Bangalore?",
                      a: "Happens if condition misrepresented online. Technician explains difference, gives revised quote. You can accept or decline - no obligation. Honest condition description avoids this."
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-card border border-border">
                      <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Conclusion CTA */}
              <section className="mb-16">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary text-center">
                  <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Laptop in Bangalore?</h2>
                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Get instant quotes, free same-day doorstep pickup across Koramangala, Indiranagar, Whitefield, HSR Layout, and all Bangalore areas. Instant payment via UPI or cash.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="cta" onClick={() => router.push("/sell/laptop")}>
                      Get Instant Quote Now
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => router.push("/contact")}>
                      Contact Us
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>100% Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Best Price</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Same Day Pickup</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </article>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
};


