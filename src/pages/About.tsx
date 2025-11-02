import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Award, ShoppingBag, CheckCircle, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const stats = [
    { icon: Award, value: "7+", label: "Years in Business" },
    { icon: Users, value: "500+", label: "Happy Customers" },
    { icon: ShoppingBag, value: "1000+", label: "Units Sold" },
    { icon: CheckCircle, value: "100%", label: "Quality Assured" },
  ];

  return (
    <>
      <Helmet>
        <title>About Laptap - 7 Years of Trusted Laptop & Desktop Sales | 500+ Happy Customers</title>
        <meta name="description" content="Laptap has been serving customers for 7 years with 500+ satisfied clients and 1000+ units sold. Learn about our journey in refurbished laptops and desktops in Bangalore." />
        <meta name="keywords" content="about laptap, laptop dealers bangalore, refurbished laptops, used laptops, pre-owned tech, hbr layout" />
        <link rel="canonical" href="https://laptap.in/about" />
        <meta property="og:title" content="About Laptap - 7 Years of Trusted Service" />
        <meta property="og:description" content="500+ happy customers, 1000+ units sold. Learn about Laptap's journey in providing quality refurbished laptops." />
        <meta property="og:url" content="https://laptap.in/about" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Laptap",
            "url": "https://laptap.in",
            "logo": "https://laptap.in/logo.png",
            "description": "India's most trusted platform for selling used laptops and desktops with 7 years of experience",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "HBR Layout, Nagawara Main Road",
              "addressLocality": "Bangalore",
              "postalCode": "560045",
              "addressCountry": "IN"
            },
            "email": "laptap.in@gmail.com",
            "foundingDate": "2018",
            "numberOfEmployees": "10-50"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Laptap</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  We have been in business for 7 years, serving 500+ happy customers and selling more than 1000+ units. 
                  Laptap is trusted for quality, affordability, and customer satisfaction in refurbished and used laptops.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2018, Laptap began with a simple mission: to make quality technology accessible to everyone. 
                    Starting from our location in HBR Layout, Bangalore, we've grown to become one of the most trusted names 
                    in refurbished and pre-owned laptops and desktops.
                  </p>
                  <p>
                    Over the past 7 years, we've helped over 500 customers find the perfect device for their needs, whether 
                    for work, study, or entertainment. Our commitment to quality means every device undergoes rigorous testing 
                    and verification before reaching our customers.
                  </p>
                  <p>
                    With over 1000+ units sold and countless satisfied customers, we continue to set the standard for 
                    reliability, affordability, and customer service in the pre-owned tech market. Our team of experienced 
                    technicians ensures that every transaction is smooth, transparent, and trustworthy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality First</h3>
                    <p className="text-sm text-muted-foreground">
                      Every device is thoroughly tested and verified
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Customer Focused</h3>
                    <p className="text-sm text-muted-foreground">
                      Your satisfaction is our top priority
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Trusted Service</h3>
                    <p className="text-sm text-muted-foreground">
                      7 years of reliable and transparent service
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creator Section */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container relative">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Powered By Innovation</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Are Our Creators</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Behind every great platform is a team that brings vision to life
                  </p>
                </div>

                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                          <Sparkles className="h-12 w-12 text-primary-foreground" />
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-3">Arrowmind</h3>
                        <p className="text-primary font-semibold mb-4">AI Marketing Agency</p>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          With their awesome mind, deep analysis, and commitment to on-time delivery, 
                          Arrowmind helped us launch our platform with excellence. Their expertise in AI-driven 
                          marketing and strategic vision transformed our ideas into reality.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                          <Button asChild variant="default" className="gap-2">
                            <a 
                              href="https://www.arrowmind.in/case-studies/7a0efa9a-d416-4bf3-b851-f4f973db4d2a" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View Our Case Study
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button asChild variant="outline" className="gap-2">
                            <a 
                              href="https://arrowmind.in" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Visit Arrowmind
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
