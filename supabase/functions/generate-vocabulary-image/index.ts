import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vocabulary, language } = await req.json();
    
    if (!vocabulary) {
      console.error("Missing vocabulary parameter");
      return new Response(
        JSON.stringify({ error: "Vocabulary word is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating image for vocabulary: "${vocabulary}" (${language})`);

    // Initialize Supabase client with service role for storage operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a cache key from vocabulary
    const vocabularyKey = vocabulary.trim().toLowerCase().replace(/\s+/g, '_');
    
    // Check if image already exists in cache
    console.log(`Checking cache for: ${vocabularyKey}, ${language}`);
    const { data: cachedImage, error: cacheError } = await supabase
      .from('vocabulary_images')
      .select('image_url')
      .eq('vocabulary_key', vocabularyKey)
      .eq('language', language)
      .maybeSingle();

    if (cacheError) {
      console.error("Cache lookup error:", cacheError);
    }

    if (cachedImage?.image_url) {
      console.log(`Cache hit! Returning cached image: ${cachedImage.image_url}`);
      return new Response(
        JSON.stringify({ imageUrl: cachedImage.image_url, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Cache miss, generating new image...");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a prompt for generating vocabulary illustration
    const prompt = language === 'zh' 
      ? `Create a simple, colorful, cartoon-style illustration for the Chinese vocabulary word: "${vocabulary}". The image should be cute, educational, and clearly represent the meaning of the word. No text in the image, just a clear visual representation. Style: flat design, vibrant colors, minimal background, centered composition.`
      : `Create a simple, colorful, cartoon-style illustration for the Vietnamese vocabulary word: "${vocabulary}". The image should be cute, educational, and clearly represent the meaning of the word. No text in the image, just a clear visual representation. Style: flat design, vibrant colors, minimal background, centered composition.`;

    console.log("Calling AI gateway...");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");
    
    const base64Image = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!base64Image) {
      console.error("No image in AI response");
      return new Response(
        JSON.stringify({ error: "No image generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract base64 data and convert to Uint8Array
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique filename
    const fileName = `${vocabularyKey}_${language}_${Date.now()}.png`;
    
    console.log(`Uploading image to storage: ${fileName}`);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vocabulary-images')
      .upload(fileName, binaryData, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // If storage fails, return the base64 image directly
      return new Response(
        JSON.stringify({ imageUrl: base64Image, cached: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('vocabulary-images')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`Image uploaded successfully: ${publicUrl}`);

    // Cache the URL in database
    const { error: insertError } = await supabase
      .from('vocabulary_images')
      .insert({
        vocabulary_key: vocabularyKey,
        language: language,
        image_url: publicUrl
      });

    if (insertError) {
      console.error("Cache insert error:", insertError);
      // Still return the image even if caching fails
    } else {
      console.log("Image URL cached successfully");
    }

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating vocabulary image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
