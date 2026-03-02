const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Sirve el frontend (index.html)
app.use(express.static(path.join(process.cwd())));

app.post('/api/diagnose', async (req, res) => {
  try {
    const { image, answers } = req.body;

    const systemPrompt = `Eres un experto en cuidado de uñas de la marca colombiana Belier. 
Analiza la imagen de uñas proporcionada junto con las respuestas del usuario y proporciona:
1. Un diagnóstico claro del estado de las uñas
2. Los principales problemas identificados
3. Recomendaciones específicas de productos Belier

Catálogo de productos Belier disponibles:
- S.O.S Uñas Quebradizas: Para uñas frágiles y que se rompen fácilmente. Fortalece y repara.
- S.O.S Uñas Mordidas: Tratamiento especial para uñas cortas y dañadas por morderse.
- S.O.S Manchas: Elimina manchas amarillas y decoloración.
- Base Argán: Nutrición profunda con aceite de argán. Ideal para uñas secas.
- Base Fortalecedora: Refuerza uñas débiles antes del esmalte.
- Base Hidratante: Hidratación intensa para cutículas y uñas.
- Biogel Secado Rápido: Esmalte semipermanente de larga duración.
- Top Coat Brillante: Sello final para mayor brillo y duración.
- Top Coat Mate: Acabado mate sofisticado y duradero.
- Aceite de Cutículas Argán: Nutre y suaviza cutículas secas.
- Aceite de Cutículas Almendras: Hidratación y suavidad para cutículas.
- Removedor Sin Acetona: Retiro suave sin dañar la uña natural.
- Dilusor de Esmalte: Recupera esmaltes espesos.
- Desengrasante: Prepara la uña para mejor adherencia.
- Exfoliante de Manos: Elimina células muertas y suaviza la piel.
- Crema de Manos: Hidratación profunda para manos y cutículas.

Responde en español, de forma cálida y profesional. Formato JSON:
{
  "diagnostico": "descripción del estado general",
  "problemas": ["problema 1", "problema 2"],
  "productos": [
    {
      "nombre": "nombre del producto",
      "razon": "por qué lo recomendamos",
      "prioridad": "alta/media/baja"
    }
  ],
  "consejo": "tip adicional de cuidado"
}`;

    const userContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: image.split(';')[0].split(':')[1],
          data: image.split(',')[1]
        }
      },
      {
        type: 'text',
        text: `Analiza estas uñas. Respuestas del usuario sobre sus hábitos:
- ¿Con qué frecuencia te haces manicure? ${answers[0] || 'No especificado'}
- ¿Usas esmalte regularmente? ${answers[1] || 'No especificado'}
- ¿Tienes alguna preocupación específica? ${answers[2] || 'No especificado'}
- ¿Usas productos de cuidado para uñas? ${answers[3] || 'No especificado'}
- ¿Tu estilo de vida (trabajo manual, agua frecuente, etc.)? ${answers[4] || 'No especificado'}`
      }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el diagnóstico' });
  }
});

app.get('/', (req, res) => res.sendFile(path.join(process.cwd(), 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
