# ms-requirements — Contexto específico del microservicio

Puerto: 3001
Sprint activo: Sprint 1
Estado: EN DESARROLLO

---

## Responsabilidades de este microservicio

Este es el microservicio más crítico del sprint 1. Es responsable de:
- Gestión de la jerarquía: Empresa → Área → Disciplina
- Gestión de expedientes y sus documentos adjuntos
- Motor del proceso documental: etapas, tareas, colaboraciones
- Historial inmutable de acciones sobre expedientes
- Comunicación con SharePoint vía Graph API (sprint 2, cuando llegue el tenant)

---

## HU implementadas en este sprint

| HU | Descripción | Estado |
|---|---|---|
| HU-05 | CRUD empresas contratistas | En desarrollo |
| HU-06 | CRUD áreas por empresa | En desarrollo |
| HU-07 | CRUD disciplinas por área | En desarrollo |

---

## Endpoints disponibles (sprint 1)

```
GET    /health                          → estado del servicio

GET    /api/empresas                    → listar empresas (activo=true)
GET    /api/empresas/:id                → obtener por ID
POST   /api/empresas                    → crear empresa
PUT    /api/empresas/:id                → actualizar empresa
DELETE /api/empresas/:id                → desactivar (activo=false)

GET    /api/areas                       → listar áreas (activo=true)
GET    /api/areas/:id                   → obtener por ID
GET    /api/areas?empresaId=:id         → filtrar por empresa
POST   /api/areas                       → crear área
PUT    /api/areas/:id                   → actualizar área
DELETE /api/areas/:id                   → desactivar (activo=false)

GET    /api/disciplinas                 → listar disciplinas (activo=true)
GET    /api/disciplinas/:id             → obtener por ID
GET    /api/disciplinas?areaId=:id      → filtrar por área
POST   /api/disciplinas                 → crear disciplina
PUT    /api/disciplinas/:id             → actualizar disciplina
DELETE /api/disciplinas/:id             → desactivar (activo=false)
```

---

## Schema de base de datos (Drizzle ORM)

Archivo: src/db/schema.ts

```typescript
// Empresas — raíz de la jerarquía
empresas {
  id:        uuid PK (defaultRandom)
  nombre:    varchar(200) NOT NULL
  rut:       varchar(20)  NOT NULL UNIQUE
  activo:    boolean DEFAULT true
  createdAt: timestamp DEFAULT now()
  updatedAt: timestamp DEFAULT now()
}

// Áreas — hijas de empresa
areas {
  id:         uuid PK
  nombre:     varchar(200) NOT NULL
  empresaId:  uuid FK → empresas.id NOT NULL
  activo:     boolean DEFAULT true
  createdAt:  timestamp DEFAULT now()
  updatedAt:  timestamp DEFAULT now()
}

// Disciplinas — hijas de área
disciplinas {
  id:       uuid PK
  nombre:   varchar(200) NOT NULL
  areaId:   uuid FK → areas.id NOT NULL
  activo:   boolean DEFAULT true
  createdAt: timestamp DEFAULT now()
  updatedAt: timestamp DEFAULT now()
}
```

---

## Reglas de negocio de este microservicio

### Empresas
- El RUT es único en todo el sistema → validar antes de crear y al actualizar
- Al desactivar empresa NO desactivar automáticamente sus áreas (esperar confirmación del cliente)

### Áreas
- Validar que la empresa existe Y está activa antes de crear un área
- El mismo nombre de área puede existir en distintas empresas (no es único global)
- Al desactivar área NO desactivar automáticamente sus disciplinas (misma razón)

### Disciplinas
- Validar que el área existe Y está activa antes de crear una disciplina
- El mismo nombre de disciplina puede existir en distintas áreas

### General
- NUNCA eliminar físicamente. SIEMPRE activo = false
- Los listados solo retornan registros con activo = true
- Los filtros por empresaId/areaId deben validar que el padre existe

---

## Validaciones con Zod (en controllers)

```typescript
// Empresa
const createEmpresaSchema = z.object({
  nombre: z.string().min(1).max(200),
  rut: z.string().min(8).max(20).regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'RUT inválido')
})

// Área
const createAreaSchema = z.object({
  nombre: z.string().min(1).max(200),
  empresaId: z.string().uuid()
})

// Disciplina
const createDisciplinaSchema = z.object({
  nombre: z.string().min(1).max(200),
  areaId: z.string().uuid()
})
```

---

## Dependencias del package.json

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "drizzle-orm": "^0.29.3",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "drizzle-kit": "^0.20.14",
    "@types/express": "^4.17.21",
    "@types/pg": "^8.10.9",
    "@types/cors": "^2.8.17",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "ts-jest": "^29.1.2",
    "supertest": "^6.3.4",
    "@types/supertest": "^6.0.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.18.1",
    "@typescript-eslint/eslint-plugin": "^6.18.1"
  },
  "scripts": {
    "dev":      "tsx watch src/index.ts",
    "build":    "tsc",
    "start":    "node dist/index.js",
    "test":     "jest --coverage",
    "lint":     "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "db:push":  "drizzle-kit push:pg",
    "db:studio":"drizzle-kit studio"
  }
}
```

---

## Variables de entorno requeridas

```bash
DATABASE_URL=postgresql://usuario:password@host:5432/dbname
PORT=3001
NODE_ENV=development
```

En Railway, DATABASE_URL se inyecta automáticamente cuando tienes
un servicio PostgreSQL en el mismo proyecto. No necesitas configurarlo manualmente.

---

## Cobertura de tests esperada

Mínimo 70% de cobertura.
Ejecutar con: npm test -- --coverage

Cada endpoint debe tener tests que cubran:
- Caso exitoso (200/201)
- Recurso no encontrado (404)
- Datos inválidos (400)
- Error del padre (si aplica FK): padre no existe o está inactivo
- Duplicado (si aplica unique): RUT duplicado en empresas
