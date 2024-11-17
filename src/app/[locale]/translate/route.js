import { Translator } from 'deepl-node';

const authKey = 'e2fd0fb7-b292-464c-8188-f402f49f0327:fx'; // Your actual DeepL API key
const translator = new Translator(authKey);

const validLangCodes = ['EN', 'DE', 'FR', 'ES', 'IT', 'NL', 'PL', 'RU', 'JA', 'ZH'];

// Handle POST request for translation
export async function POST(req) {
  const { text, targetLang } = await req.json();

  // Check for missing parameters
  if (!text || !targetLang) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: text or targetLang' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check if targetLang is valid
  if (!validLangCodes.includes(targetLang.toUpperCase())) {
    return new Response(
      JSON.stringify({ error: `Invalid targetLang: ${targetLang}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Use the correct method to translate text
    const result = await translator.translateText(text, null, targetLang.toUpperCase());
    return new Response(
      JSON.stringify({ translation: result.text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Translation error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
