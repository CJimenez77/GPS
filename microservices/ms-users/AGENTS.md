# ms-users — Contexto específico

Puerto: 3002
Sprint: 2 (aún no iniciado)

## Responsabilidades
- Gestión de perfiles de usuario
- Grupos de trabajo por área (colaboradores y lectores)
- Validación de permisos por área (NO son roles globales)
- Integración con Azure AD vía Graph API

## Modelo de permisos (importante)
Los permisos NO son globales. Un usuario puede ser:
- Colaborador en el área de Contabilidad
- Lector en el área de Ingeniería
- Sin acceso al área de Proyectos

Esto es fundamentalmente distinto a un sistema de roles globales.
La tabla USUARIO_GRUPO_AREA es la que define los permisos reales.

## Estado
BLOQUEADO — Requiere acceso al tenant de Cristian para
configurar la integración con Azure Active Directory.
