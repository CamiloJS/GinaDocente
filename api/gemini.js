// Este archivo vive oculto en Vercel y es el único que conoce tu llave secreta.
export default async function handler(req, res) {
  // Solo aceptamos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtenemos la llave secreta de la "caja fuerte" de Vercel que acabas de configurar
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la API Key en el servidor' });
  }

  try {
    const { promptText } = req.body;

    // Conexión oficial al modelo de Gemini usando tu llave secreta
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: promptText }] }] };

    const geminiRes = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!geminiRes.ok) {
      const errorData = await geminiRes.text();
      console.error("Detalle del error de Gemini:", errorData);
      // Le pasamos el error exacto a la página para saber qué pasó
      return res.status(geminiRes.status).json({ error: `Error de Gemini: ${geminiRes.status}` });
    }

    const data = await geminiRes.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({ text: resultText });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: 'Error de red en el servidor' });
  }
}
