import { db, empresas } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import type { Empresa, CreateEmpresaInput, UpdateEmpresaInput } from '../entities/Empresa.js';

export class EmpresasService {
  async findAll(): Promise<Empresa[]> {
    const result = await db.select().from(empresas).where(eq(empresas.activo, true));
    return result;
  }

  async findAllInactive(): Promise<Empresa[]> {
    const result = await db.select().from(empresas).where(eq(empresas.activo, false));
    return result;
  }

  async findById(id: string): Promise<Empresa | null> {
    const result = await db.select().from(empresas).where(and(eq(empresas.id, id), eq(empresas.activo, true)));
    return result[0] || null;
  }

  async findByIdAny(id: string): Promise<Empresa | null> {
    const result = await db.select().from(empresas).where(eq(empresas.id, id));
    return result[0] || null;
  }

  async findByRut(rut: string): Promise<Empresa | null> {
    const result = await db.select().from(empresas).where(eq(empresas.rut, rut));
    return result[0] || null;
  }

  async create(input: CreateEmpresaInput): Promise<Empresa> {
    const existing = await this.findByRut(input.rut);
    if (existing) {
      throw new Error('RUT_DUPLICADO');
    }

    const [result] = await db.insert(empresas).values({
      nombre: input.nombre,
      rut: input.rut,
    }).returning();

    return result;
  }

  async update(id: string, input: UpdateEmpresaInput): Promise<Empresa> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('EMPRESA_NO_ENCONTRADA');
    }

    if (input.rut && input.rut !== existing.rut) {
      const rutExists = await this.findByRut(input.rut);
      if (rutExists) {
        throw new Error('RUT_DUPLICADO');
      }
    }

    const [result] = await db.update(empresas)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(empresas.id, id))
      .returning();

    return result;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('EMPRESA_NO_ENCONTRADA');
    }

    await db.update(empresas)
      .set({ activo: false, updatedAt: new Date() })
      .where(eq(empresas.id, id));
  }

  async activate(id: string): Promise<Empresa> {
    const existing = await this.findByIdAny(id);
    if (!existing) {
      throw new Error('EMPRESA_NO_ENCONTRADA');
    }

    const [result] = await db.update(empresas)
      .set({ activo: true, updatedAt: new Date() })
      .where(eq(empresas.id, id))
      .returning();

    return result;
  }
}

export const empresasService = new EmpresasService();