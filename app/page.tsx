import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { sellingFaqs } from "@/lib/selling-faq";

const title = "Sell Used Laptop & Desktop in Bangalore";
const description = "Sell your used laptop or desktop in Bangalore. Choose your model, share its condition, and discuss assessment and pickup availability with Laptap.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "https://www.laptap.in/" },
  openGraph: { title, description, type: "website", url: "https://www.laptap.in/", images: [{ url: "/opengraph-image" }], locale: "en_IN", siteName: "Laptap" },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

export default function HomePage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": "https://www.laptap.in/#website", name: "Laptap", url: "https://www.laptap.in/" },
    { "@type": "FAQPage", mainEntity: sellingFaqs().map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><HomeClient /></>;
}
