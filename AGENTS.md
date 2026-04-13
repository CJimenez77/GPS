# GPS — Sistema de Gestión de Requerimientos

## Stack tecnológico
- **Backend:** Node.js 18 + Express.js + TypeScript
- **ORM:** Drizzle ORM (no Prisma)
- **BD:** PostgreSQL (no SQLite)
- **Testing:** Jest + Supertest

## Arquitectura por capa (OBLIGATORIA)
```
routes/       → endpoints REST, CERO lógica
controllers/  → valida con zod, llama service, responde
services/     → TODA lógica de negocio, SIN HTTP
db/           → schema Drizzle + conexión PostgreSQL
entities/     → interfaces TypeScript del dominio
```

## Modelo jerárquico (CORE)
```
EMPRESA → AREA → DISCIPLINA → EXPEDIENTE → TAREA
```
- EXPEDIENTE tiene: empresa + área + disciplina + tipo_documento
- Estados: borrador → en_revision → aprobado | rechazado
- Historial inmutable (nunca modificar/eliminar)

## Reglas de negocio (CRÍTICAS)
1. **Nunca eliminar.** Siempre `activo = false`
2. No crear entidad hija sin validar padre existe Y está activo
3. Permisos POR ÁREA, no globales
4. Al crear expediente → sistema detecta área → crea tarea para revisor etapa 1
5. Colaboradores cierran tarea con comentario. Solo revisor avanza etapas.

## NO HACER (reglas duras)
- ❌ NO usar `any` sin justificación
- ❌ NO saltarse capas (routes → services directo)
- ❌ NO eliminar registros (usar activo = false)
- ❌ NO console.log en producción
- ❌ NO instalar dependencias sin avisar

## Comandos desarrollo
```bash
# Dentro de microservices/ms-requirements/
npm run dev          # tsx watch
npm test             # Jest
npm run lint         # ESLint
npm run build       # tsc
```

## Estructura servicio
```
microservices/
├── ms-requirements/   ← sprint 1 activo (puerto 3001)
├── ms-users/         ← sprint 2
└── ms-reports/      ← sprint 2
```

## Convenciones
- Commits: `feat(ms-requirements): descripcion` (Conventional Commits)
- Ramas: `main`, `develop`, `feature/HU-XX-desc`
- TypeScript: `strict: true` en tsconfig

## Referencias
- `microservices/ms-requirements/AGENTS.md` — contexto servicio activo
- `docs/diagramas/modelo-datos.mermaid` — modelo relacional completo
- `docs/diagramas/flujo-proceso.mermaid` — flujo documental