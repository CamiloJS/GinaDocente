// Este archivo vive oculto en Vercel y es el único que conoce tu llave secreta.
export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtenemos la llave secreta de la "caja fuerte" de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la API Key en el servidor' });
  }

  try {
    // Tomamos el mensaje (prompt) que envió tu página
    const { promptText } = req.body;

    // Preparamos la llamada a Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: promptText }] }] };

    const geminiRes = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!geminiRes.ok) {
      throw new Error(`Error de Gemini: ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Le devolvemos la respuesta a tu página web
    return res.status(200).json({ text: resultText });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: 'Error al contactar a la IA' });
  }
}
