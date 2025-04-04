import { Request, Response } from 'express';
import { generateProductInsightsService } from '../services/insightService';

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
