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

    // Step 1: Generate the blog content (optimized for speed)
    const contentPrompt = `You are an expert blog writer for a laptop and mobile buying/selling service. Write a comprehensive, human-like blog post about "${topic}".

CRITICAL REQUIREMENTS:
1. Word Count: 2500-2700 words (THIS IS MANDATORY)
2. Writing Style: Natural, conversational, and helpful - as if written by a human expert
3. Readability: Write at a 12-year-old reading level (simple, clear language)
4. Structure:
   - Compelling introduction (hook the reader emotionally)
   - Use H2 headings for main sections (##)
   - Use bullet points and numbered lists for clarity
   - Include 2 sections where images should be placed with marker: [IMAGE_PLACEHOLDER_X] where X is 1-2
   - Conclusion with clear call-to-action

5. Content Quality:
   - Show real expertise with specific examples
   - Include case studies or scenarios (make them realistic)
   - Add statistics or data points (mark with "studies show" or "according to experts")
   - Use long-tail keywords naturally: ${keywords.join(", ")}
   - Make it emotional and relatable

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

    if (!contentResponse.ok) {
      throw new Error(`Content generation failed: ${contentResponse.status}`);
    }

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

    // Step 3: Generate images in parallel (reduced to 2 for speed)
    const imagePrompts = [
      `Professional photo of a modern laptop on a clean desk, bright lighting, high quality, realistic`,
      `Happy customer with laptop, professional setting, bright and clean, high quality photo`
    ];

    const imageUrls: string[] = [];
    
    // Generate images in parallel for speed
    console.log('Starting parallel image generation');
    const imagePromises = imagePrompts.map(async (prompt, i) => {
      console.log(`Generating image ${i + 1}/${imagePrompts.length}`);
      
      try {
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"]
          }),
        });

        if (!imageResponse.ok) {
          console.error(`Image ${i + 1} generation failed: ${imageResponse.status}`);
          return "";
        }

        const imageData = await imageResponse.json();
        
        if (imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
          console.log(`Image ${i + 1} generated successfully`);
          return imageData.choices[0].message.images[0].image_url.url;
        } else {
          console.error(`Failed to extract image ${i + 1} URL`);
          return "";
        }
      } catch (imageError) {
        console.error(`Error generating image ${i + 1}:`, imageError);
        return "";
      }
    });

    const generatedImages = await Promise.all(imagePromises);
    imageUrls.push(...generatedImages);

    // Step 4: Insert images into content
    let finalContent = blogContent;
    for (let i = 0; i < imagePrompts.length; i++) {
      if (imageUrls[i]) {
        finalContent = finalContent.replace(
          `[IMAGE_PLACEHOLDER_${i + 1}]`,
          `\n\n![${topic} - Image ${i + 1}](${imageUrls[i]})\n\n`
        );
      } else {
        finalContent = finalContent.replace(`[IMAGE_PLACEHOLDER_${i + 1}]`, "");
      }
    }

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
        images: imageUrls,
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
