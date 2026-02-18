import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ valid: false, reason: 'No image provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ valid: false, reason: 'Service unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image strictly for profile photo verification. Answer ONLY with a JSON object in this exact format, no other text:
{
  "hasFace": true/false,
  "isSinglePerson": true/false,
  "isRealPerson": true/false,
  "isCartoonOrIllustration": true/false,
  "isAnimal": true/false,
  "isLandscapeOrObject": true/false,
  "confidence": "high"/"medium"/"low",
  "reason": "brief explanation"
}

Rules:
- hasFace: true only if a human face is clearly visible
- isSinglePerson: true only if exactly one person is visible
- isRealPerson: true only if it looks like a real photograph of a real human (not AI-generated art, not cartoon)
- isCartoonOrIllustration: true if animated, drawn, illustrated, or AI-art style
- isAnimal: true if the main subject is an animal
- isLandscapeOrObject: true if no person is present (buildings, nature, objects, logos, text, etc.)`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', errText);
      return new Response(JSON.stringify({ valid: false, reason: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content ?? '';

    // Parse the JSON from the AI response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(JSON.stringify({ valid: false, reason: 'Could not analyze image' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!analysis) {
      return new Response(JSON.stringify({ valid: false, reason: 'Could not analyze image' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isValid =
      analysis.hasFace === true &&
      analysis.isSinglePerson === true &&
      analysis.isRealPerson === true &&
      analysis.isCartoonOrIllustration === false &&
      analysis.isAnimal === false &&
      analysis.isLandscapeOrObject === false;

    let userReason = '';
    if (!analysis.hasFace) userReason = 'No face detected in the image. Please upload a clear photo of your face.';
    else if (!analysis.isSinglePerson) userReason = 'Multiple people detected. Please upload a photo with only yourself.';
    else if (analysis.isCartoonOrIllustration) userReason = 'Cartoon or illustration detected. Please upload a real photo.';
    else if (analysis.isAnimal) userReason = 'Animal detected. Please upload a photo of yourself.';
    else if (analysis.isLandscapeOrObject) userReason = 'No person detected. Please upload a photo of yourself.';
    else if (!analysis.isRealPerson) userReason = 'Please upload a real photograph of yourself.';
    else userReason = analysis.reason ?? 'Photo verified successfully.';

    return new Response(
      JSON.stringify({ valid: isValid, reason: userReason, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in verify-face:', err);
    return new Response(
      JSON.stringify({ valid: false, reason: 'Server error during verification' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
