import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const empresas = pgTable('empresas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  rut: text('rut').notNull().unique(),
  activo: boolean('activo').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type EmpresaRow = typeof empresas.$inferSelect;
export type NewEmpresaRow = typeof empresas.$inferInsert;