export interface Empresa {
  id: string;
  nombre: string;
  rut: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmpresaInput {
  nombre: string;
  rut: string;
}

export interface UpdateEmpresaInput {
  nombre?: string;
  rut?: string;
}