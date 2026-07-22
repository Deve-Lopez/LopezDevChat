export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { messages } = req.body;

    if (messages && messages.length > 0) {
      console.log(`💬 Mensaje interceptado: "${messages[messages.length - 1].content}"`);
    }

    try {
      const response = await fetch(`${process.env.OLLAMA_TUNNEL_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({
          model: 'qwen2.5:3b',
          messages: messages,
          stream: false
        })
      });

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Error conectando con la IA local" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}