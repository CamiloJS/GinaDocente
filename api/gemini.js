export default async function handler(req, res) {
  // Solo aceptamos peticiones POST desde tu frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtenemos la llave secreta directamente de Vercel (NUNCA de GitHub)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la API Key en el servidor de Vercel' });
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

    const data = await geminiRes.json();
    
    // Le enviamos la respuesta de Google de vuelta a tu frontend
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Error al procesar la solicitud en Vercel' });
  }
}
