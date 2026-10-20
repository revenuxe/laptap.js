import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, keywords, category } = await req.json();
    if (typeof topic !== 'string' || !topic.trim() || typeof category !== 'string' || !category.trim() || !Array.isArray(keywords) || !keywords.length || keywords.some((keyword: unknown) => typeof keyword !== 'string' || !keyword.trim())) {
      return new Response(JSON.stringify({ error: 'Provide a topic, category, and at least one non-empty keyword.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    if (!API_KEY) {
      throw new Error("AI API Key (GEMINI_API_KEY or OPENAI_API_KEY) is not configured");
    }

    console.log("Generating blog for topic:", topic);

    // Step 1: Generate the blog content
    const contentPrompt = `You are an expert blog writer for a laptop and mobile buying/selling service. Write a comprehensive, human-like blog post about "${topic}".

CRITICAL REQUIREMENTS:
1. Depth: aim for 1500-2200 useful words. Answer the topic fully without padding or repeating advice.
2. Writing Style: Natural, conversational, and helpful - as if written by a human expert
3. Readability: Write at a 12-year-old reading level (simple, clear language)
4. Keywords to naturally include: ${keywords.join(', ')}
5. Structure:
   - Do not include an H1: the page supplies the title
   - Intro that directly answers the reader's main question
   - A quick-answer summary before the detailed sections
   - Multiple H2 Sections with detailed sub-points
   - Bulleted/Numbered lists for readability
   - Real-world advice and practical tips
   - A practical checklist, comparison, and 4-6 relevant FAQs using H3 questions
   - An appropriate next step, with a descriptive link to /sell/laptop or /contact

6. SEO Best Practices:
   - Use keywords naturally throughout (no stuffing)
   - Intent-based content (answer what users really want to know)
   - Include practical tips and actionable advice
   - Use the primary keyword in the introduction and one relevant H2; use related phrases naturally elsewhere
   - Link to relevant guides only when useful: /blog/prepare-laptop-for-sale, /blog/buying-refurbished-laptop-guide, /blog/refurbished-vs-new-laptops, /blog/best-place-to-sell-used-laptop-bangalore

8. Accuracy:
   - Never invent customer stories, credentials, studies, prices, statistics, or company service guarantees
   - Do not claim guaranteed payouts, universal pickup coverage, certified data erasure, fixed turnaround times, or warranty terms
   - Explain that offers depend on specifications, condition, inspection, and actual service availability
   - Clearly label hypothetical examples as illustrative
   - Cite manufacturer support pages for device reset instructions; do not recommend obsolete erasure tools or claim a consumer reset meets professional sanitisation standards

7. Tone: Warm, helpful, and trustworthy - like a friend giving advice

Please write the full article in Markdown now. Prioritise useful, accurate answers over word count.`;

    const contentResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert blog writer who creates engaging, SEO-optimized content that sounds completely natural and human-written." },
          { role: "user", content: contentPrompt }
        ],
      }),
    });

    if (!contentResponse.ok) throw new Error('The writing service could not generate the article. Please try again.');
    const contentData = await contentResponse.json();
    const blogContent = contentData.choices?.[0]?.message?.content;
    if (typeof blogContent !== 'string' || !blogContent.trim()) throw new Error('The writing service returned an empty article.');

    const wordCount = blogContent.trim().split(/\s+/).length;
    console.log("Blog content generated, word count:", wordCount);

    // Step 2: Generate meta title and description
    const metaPrompt = `Based on this blog about "${topic}", create:
1. A clear meta title (50-60 characters, includes the main keyword without exaggerated claims)
2. An accurate meta description (150-160 characters, includes the main keyword and the reader benefit)

Format your response as JSON:
{
  "title": "your meta title here",
  "description": "your meta description here"
}`;

    const metaResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "You create accurate, descriptive meta titles and descriptions. Never invent prices or service guarantees. Always respond with valid JSON." },
          { role: "user", content: metaPrompt }
        ],
      }),
    });

    const metaData = await metaResponse.json();
    let metaInfo;
    
    try {
      const metaText = metaData.choices[0].message.content;
      const jsonMatch = metaText.match(/\{[\s\S]*\}/);
      metaInfo = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: topic, description: `Learn about ${topic}` };
      if (typeof metaInfo.title !== 'string' || typeof metaInfo.description !== 'string') throw new Error('Invalid metadata');
    } catch (e) {
      metaInfo = { title: topic, description: `Learn about ${topic}` };
    }

    console.log("Meta information generated");

    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    return new Response(
      JSON.stringify({
        title: topic,
        slug,
        content: blogContent,
        excerpt: metaInfo.description,
        metaTitle: metaInfo.title,
        metaDescription: metaInfo.description,
        category,
        keywords,
        wordCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in generate-blog function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
