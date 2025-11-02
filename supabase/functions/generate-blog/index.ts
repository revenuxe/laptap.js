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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating blog for topic:", topic);

    // Step 1: Generate the blog content
    const contentPrompt = `You are an expert blog writer for a laptop and mobile buying/selling service. Write a comprehensive, human-like blog post about "${topic}".

CRITICAL REQUIREMENTS:
1. Word Count: 2500-2700 words (THIS IS MANDATORY)
2. Writing Style: Natural, conversational, and helpful - as if written by a human expert
3. Readability: Write at a 12-year-old reading level (simple, clear language)
4. Structure:
   - Compelling introduction (hook the reader emotionally)
   - Use H2 headings for main sections (##)
   - Use bullet points and numbered lists for clarity
   - Include 4 sections where images should be placed with marker: [IMAGE_PLACEHOLDER_X] where X is 1-4
   - Conclusion with clear call-to-action

5. Content Quality:
   - Show real expertise with specific examples
   - Include case studies or scenarios (make them realistic)
   - Add statistics or data points (mark with "studies show" or "according to experts")
   - Use long-tail keywords naturally: ${keywords.join(", ")}
   - Make it emotional and relatable
   - Do NOT include image placeholders - content only

6. SEO Best Practices:
   - Use keywords naturally throughout (no stuffing)
   - Intent-based content (answer what users really want to know)
   - Include practical tips and actionable advice

7. Tone: Warm, helpful, and trustworthy - like a friend giving advice

Please write the full blog post now. Remember: 2500-2700 words is mandatory.`;

    const contentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

    const metaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

    // Step 3: Generate featured image
    const imagePrompt = `Professional high-quality photo of a modern laptop on a clean desk with natural lighting, realistic, detailed, 4K quality`;

    let featuredImageUrl = "";

    try {
      console.log("Generating featured image...");
      
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: imagePrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      const imageData = await imageResponse.json();
      
      if (imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
        featuredImageUrl = imageData.choices[0].message.images[0].image_url.url;
        console.log("Featured image generated successfully");
      } else {
        console.error("Failed to generate featured image");
      }
    } catch (imageError) {
      console.error("Error generating featured image:", imageError);
    }

    // Step 4: Clean up content (remove any image placeholders)
    let finalContent = blogContent.replace(/\[IMAGE_PLACEHOLDER_\d+\]/g, "");

    // Generate slug from topic
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create excerpt (first 160 characters)
    const plainText = blogContent.replace(/[#*\[\]]/g, '').trim();
    const excerpt = plainText.substring(0, 157) + '...';

    return new Response(
      JSON.stringify({
        title: topic,
        slug,
        excerpt,
        content: finalContent,
        metaTitle: metaInfo.title,
        metaDescription: metaInfo.description,
        category,
        featuredImage: featuredImageUrl,
        keywords,
        wordCount: blogContent.split(' ').length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating blog:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
