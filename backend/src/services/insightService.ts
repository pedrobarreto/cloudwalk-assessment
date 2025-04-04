import { openai } from '../config/openAiClient';

export async function generateProductInsightsService(
  name: string,
  description: string,
  price: number
): Promise<any> {
  const prompt = `
Você é um assistente de inteligência artificial que ajuda donos de food trucks e pequenos restaurantes a cadastrarem seus produtos de forma mais atrativa e eficaz.

Seu papel é:
1. Melhorar o nome do produto com apelo comercial.
2. Reescrever a descrição para torná-la mais envolvente e informativa.
3. Avaliar o preço informado, respondendo com uma frase curta (ex: "Justo", "Barato", ou "Caro") baseada em preços médios de produtos similares na região.

Forneça a resposta no seguinte formato JSON:
{
  "optimizedName": "...",
  "optimizedDescription": "...",
  "priceFeedback": "..."
}

Dados:
Nome do produto: ${name}
Descrição atual: ${description}
Preço: R$${price}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = completion.choices[0].message?.content;
  if (!content) {
    throw new Error('OpenAI não retornou resposta');
  }

  const parsed = JSON.parse(content);
  return parsed;
}
