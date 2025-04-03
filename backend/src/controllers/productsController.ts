import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = await productService.createProductService(req.body);
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const data = await productService.getProductByIdService(req.params.id);
    return res.json(data);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
};

export const getProductsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const data = await productService.getProductsByUserService(userId);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = await productService.updateProductService(req.params.id, req.body);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProductService(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brand } = req.params;
    const data = await productService.getProductsByBrandService(brand);
    return res.json(data);
  } catch (error: any) {
    const status = error.message === 'Marca não encontrada' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
};
