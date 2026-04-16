module.exports = async function (req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Obtenemos la llave de Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la API Key en las variables de entorno de Vercel' });
  }

  try {
    const { promptText } = req.body;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: promptText }] }] };

    const geminiRes = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await geminiRes.json();
    
    // Si Google rechaza la petición, mandamos el error al frontend
    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json(data);
    }
    
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Error interno en el servidor de Vercel: ' + error.message });
  }
};
