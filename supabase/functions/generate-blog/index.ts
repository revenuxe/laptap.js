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
    const API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("OPENAI_API_KEY");

    if (!API_KEY) {
      throw new Error("AI API Key (GEMINI_API_KEY or OPENAI_API_KEY) is not configured");
    }

    console.log("Generating blog for topic:", topic);

    // Step 1: Generate the blog content
    const contentPrompt = `You are an expert blog writer for a laptop and mobile buying/selling service. Write a comprehensive, human-like blog post about "${topic}".

CRITICAL REQUIREMENTS:
1. Word Count: 2500-2700 words (THIS IS MANDATORY)
2. Writing Style: Natural, conversational, and helpful - as if written by a human expert
3. Readability: Write at a 12-year-old reading level (simple, clear language)
4. Keywords to naturally include: ${keywords.join(', ')}
5. Structure:
   - Catchy Title
   - Intro (engaging hook, human storytelling)
   - Multiple H2 Sections with detailed sub-points
   - Bulleted/Numbered lists for readability
   - Real-world advice and practical tips
   - Conclusion with clear CTA to sell device on Laptap

6. SEO Best Practices:
   - Use keywords naturally throughout (no stuffing)
   - Intent-based content (answer what users really want to know)
   - Include practical tips and actionable advice

7. Tone: Warm, helpful, and trustworthy - like a friend giving advice

Please write the full blog post now. Remember: 2500-2700 words is mandatory.`;

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

    const contentData = await contentResponse.json();
    const blogContent = contentData.choices[0].message.content;

    console.log("Blog content generated, word count:", blogContent.split(' ').length);

    // Step 2: Generate meta title and description
    const metaPrompt = `Based on this blog about "${topic}", create:
1. A meta title (50-60 characters, emotional, includes main keyword)
2. A meta description (150-160 characters, emotional, compelling, includes main keyword)

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
          { role: "system", content: "You create compelling, emotional meta titles and descriptions. Always respond with valid JSON." },
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
        wordCount: blogContent.split(' ').length,
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
