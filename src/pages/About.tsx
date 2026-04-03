import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Award, ShoppingBag, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const About = () => {
  const stats = [{
    icon: Award,
    value: "7+",
    label: "Years in Business"
  }, {
    icon: Users,
    value: "500+",
    label: "Happy Customers"
  }, {
    icon: ShoppingBag,
    value: "1000+",
    label: "Units Sold"
  }, {
    icon: CheckCircle,
    value: "100%",
    label: "Quality Assured"
  }];
  return <>
      <Helmet>
        <title>About Laptap - 7 Years of Trusted Laptop & Desktop Sales | 500+ Happy Customers</title>
        <meta name="description" content="Laptap has been serving customers for 7 years with 500+ satisfied clients and 1000+ units sold. Learn about our journey in refurbished laptops and desktops in Bangalore." />
        <meta name="keywords" content="about laptap, laptop dealers bangalore, refurbished laptops, used laptops, pre-owned tech, hbr layout" />
        <link rel="canonical" href="https://www.laptap.in/about" />
        <meta property="og:title" content="About Laptap - 7 Years of Trusted Service" />
        <meta property="og:description" content="500+ happy customers, 1000+ units sold. Learn about Laptap's journey in providing quality refurbished laptops." />
        <meta property="og:url" content="https://www.laptap.in/about" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.laptap.in" },
              { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.laptap.in/about" }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Laptap",
            "url": "https://www.laptap.in",
            "logo": "https://www.laptap.in/logo.png",
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
            "numberOfEmployees": "10-50",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "worstRating": "1",
              "reviewCount": "500"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "LocalBusiness",
              "name": "Laptap"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": { "@type": "Person", "name": "Rahul Sharma" },
            "reviewBody": "Excellent service! Got the best price for my MacBook Pro. Quick pickup and instant payment. Highly recommended!"
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
                {stats.map((stat, index) => <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>)}
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

          {/* Built by Revenuxe */}
          <section className="py-12 md:py-16">
            <div className="container">
              <div className="text-center">
                <Card className="border-primary/10 bg-card/30 backdrop-blur-sm inline-block">
                  <CardContent className="px-8 py-5 flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Platform designed & developed by{" "}
                      <a 
                        href="https://revenuxe.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        Revenuxe.com
                      </a>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>;
};
export default About;