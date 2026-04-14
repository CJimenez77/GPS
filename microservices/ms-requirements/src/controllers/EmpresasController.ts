import type { Request, Response } from 'express';
import { z } from 'zod';
import { empresasService } from '../services/EmpresasService.js';

const createEmpresaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  rut: z.string().min(1, 'RUT requerido'),
});

const updateEmpresaSchema = z.object({
  nombre: z.string().min(1).optional(),
  rut: z.string().min(1).optional(),
});

export class EmpresasController {
  async list(req: Request, res: Response) {
    const empresas = await empresasService.findAll();
    res.json(empresas);
  }

  async listInactive(req: Request, res: Response) {
    const empresas = await empresasService.findAllInactive();
    res.json(empresas);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const empresa = await empresasService.findById(id);
    if (!empresa) {
      res.status(404).json({ error: 'Empresa no encontrada' });
      return;
    }
    res.json(empresa);
  }

  async create(req: Request, res: Response) {
    const parsed = createEmpresaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    try {
      const empresa = await empresasService.create(parsed.data);
      res.status(201).json(empresa);
    } catch (error) {
      if (error instanceof Error && error.message === 'RUT_DUPLICADO') {
        res.status(409).json({ error: 'RUT ya existe' });
        return;
      }
      throw error;
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const parsed = updateEmpresaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    try {
      const empresa = await empresasService.update(id, parsed.data);
      res.json(empresa);
    } catch (error) {
      if (error instanceof Error && error.message === 'EMPRESA_NO_ENCONTRADA') {
        res.status(404).json({ error: 'Empresa no encontrada' });
        return;
      }
      if (error instanceof Error && error.message === 'RUT_DUPLICADO') {
        res.status(409).json({ error: 'RUT ya existe' });
        return;
      }
      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await empresasService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'EMPRESA_NO_ENCONTRADA') {
        res.status(404).json({ error: 'Empresa no encontrada' });
        return;
      }
      throw error;
    }
  }

  async activate(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const empresa = await empresasService.activate(id);
      res.json(empresa);
    } catch (error) {
      if (error instanceof Error && error.message === 'EMPRESA_NO_ENCONTRADA') {
        res.status(404).json({ error: 'Empresa no encontrada' });
        return;
      }
      throw error;
    }
  }
}

export const empresasController = new EmpresasController();