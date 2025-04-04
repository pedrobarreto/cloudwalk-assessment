import { Request, Response } from 'express';
import { generateProductInsightsService, generateOrderInsightsService } from '../services/insightService';
import { supabase } from '../config/supabaseClient';

export async function generateProductInsights(req: Request, res: Response) {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, description, price' });
  }

  try {
    const result = await generateProductInsightsService(name, description, price);
    return res.json(result);
  } catch (err: any) {
    console.error('[OpenAI Error]', err.message);
    return res.status(500).json({ error: 'Erro ao gerar insights com IA' });
  }
}


export async function generateOrderInsights(req: Request, res: Response) {
  const { orders, orderItems } = req.body;

  if (!orders || !orderItems) {
    return res.status(400).json({ error: 'Campos obrigatórios: orders, orderItems' });
  }

  try {
    const insights = await generateOrderInsightsService(orders, orderItems);
    const positiveMessages = [
      'Bom tempo de preparo',
      'Tempo de preparo adequado',
      'Desempenho ótimo na cozinha',
      'Processo de preparo dentro do esperado'
    ];

    for (const insight of insights) {
      let insightText = '';
      if (insight.tempoPreparoClassificacao === 'Excessivo') {
        insightText = insight.analiseTecnica;
      } else {
        const randomIndex = Math.floor(Math.random() * positiveMessages.length);
        insightText = positiveMessages[randomIndex];
      }

      await supabase
        .from('orders')
        .update({ insight: insightText })
        .eq('id', insight.orderId);
    }

    return res.status(200).json({ message: 'Insights aplicados com sucesso' });
  } catch (err: any) {
    console.error('[OpenAI Error]', err.message);
    return res.status(500).json({ error: 'Erro ao gerar insights com IA' });
  }
}
