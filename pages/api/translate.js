import { Translator } from 'deepl-node';

const authKey = 'e2fd0fb7-b292-464c-8188-f402f49f0327:fx'; // Your actual DeepL API key
const translator = new Translator(authKey);

const validLangCodes = ['EN', 'DE', 'FR', 'ES', 'IT', 'NL', 'PL', 'RU', 'JA', 'ZH'];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, targetLang } = req.body;

    // Check for missing parameters
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Missing required parameters: text or targetLang' });
    }

    // Check if targetLang is valid
    if (!validLangCodes.includes(targetLang.toUpperCase())) {
      return res.status(400).json({ error: `Invalid targetLang: ${targetLang}` });
    }

    try {
      // Use the correct method to translate text
      const result = await translator.translateText(text, null, targetLang.toUpperCase());
      res.status(200).json({ translation: result.text });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
