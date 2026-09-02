---
id: PEND-007
type: Pending
tier: Project
status: Blocked
impact: High
priority: High
lifetime: Project
created: 2026-08-22T14:30:00.000Z
updated: 2026-08-22T14:30:00.000Z
---

# PEND-007 — Integrar feature/roles-puestos del repo villa-broaster-sistema (commit f064c81 e

**reason:** Orden explícita del proyecto 2026-08-22: 'no quiero que hagas nada de código aún, quiero los planes'. Feature completa y verde; será integrada cuando el proyecto lo autorice.

**task:** Integrar feature/roles-puestos del repo villa-broaster-sistema (commit f064c81 en la rama): acceso por roles y puestos modelo Mercaplaza — usuarios admin/cajero con PIN (scrypt), puesto por equipo (localStorage, primer arranque), cookie firmada HMAC {usuarioId, rol, puesto, exp}, exigirSeccion con 401/403, cajero solo Órdenes con sede fija del puesto, pestaña Usuarios, bloqueo por usuario+puesto; 107 tests en verde, e2e del admin OK. PAUSADO por orden del proyecto ('nada de código aún'); al integrar: QA independiente (cajero 403 en gastos, primer arranque una vez por navegador, admin semilla entra con ADMIN_CLAVE), luego el senior completa T-11 (auditoría de cobro, re-autenticación, endurecimiento). Lección técnica: usuarios.ts (puro) separado de usuarios-disco.ts (node:fs/scrypt) para no arrastrar node:fs al bundle cliente (Turbopack entra en pánico).

