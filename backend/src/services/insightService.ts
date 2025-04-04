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

export async function generateOrderInsightsService(
  orders: any[],
  orderItems: any[]
): Promise<any> {
  const filteredOrders = orders.filter(
    (order) => order.status === 'entregue' && order.preparation_time && order.preparation_time > 0
  );

  console.log('aqui', filteredOrders)
  const filteredOrderItems = orderItems.filter((item) =>
    filteredOrders.some((order) => order.id === item.order_id)
  );

  console.log('aqui2', filteredOrderItems)

  const prompt = `
Você é um especialista em otimização de processos culinários e análise operacional. Para cada pedido listado abaixo (com status "entregue" e preparation_time > 0), faça o seguinte:
1. Converta o tempo de preparo de segundos para minutos.
2. Classifique o tempo de preparo como "Adequado" se for até 10 minutos ou "Excessivo" se for maior que 10 minutos.
3. Para pedidos com tempo "Excessivo", em no máximo 4 linhas, forneça uma análise técnica sucinta que mencione os ingredientes principais, descreva o que pode ser obtido no prato e sugira alternativas para otimização.
4. Para pedidos com tempo "Adequado", retorne uma mensagem breve afirmando que o desempenho está dentro do esperado.

Responda no formato JSON único, contendo um array com cada entrada no seguinte formato:
{
  "orderId": "id_do_pedido",
  "tempoPreparoClassificacao": "Adequado" ou "Excessivo",
  "tempoEmMinutos": valor_em_minutos,
  "analiseTecnica": "Análise sucinta e recomendações práticas"
}

Dados dos Pedidos:
${JSON.stringify(filteredOrders, null, 2)}

Dados dos Itens dos Pedidos:
${JSON.stringify(filteredOrderItems, null, 2)}
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
