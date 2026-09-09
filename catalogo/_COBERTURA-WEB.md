# Cómo construimos la web — qué quedó cubierto y qué añadimos nosotros

> Encargo del dueño (dictado, 9 sep 2026): «que el trabajo sea específicamente
> enfocado a mejorar todo lo que tenga que ver con la parte de cómo construimos
> la web… que sea un vibe coding estilo saas real», seguido de quince ejes y un
> «y mas cosas».
>
> Este archivo existe para una sola cosa: que el dueño pueda **tachar** lo que
> añadimos por nuestra cuenta. Lo que él dictó no se discute; lo que pusimos
> nosotros está marcado y se puede borrar sin pedir permiso.

## Los quince ejes que dictó, y dónde vive cada uno

| Eje dictado | Antes | Después | Dónde |
|---|---|---|---|
| diseño del sistema | **0** | 52 | categoría `arquitectura` (nueva) |
| arquitectura | **0** | 52 | `arq.decision` `arq.frontera` `arq.contrato` `arq.estado` `arq.flujo` `arq.limite` `arq.evolucion` `arq.forma` |
| frontend | 80 | 80 | `frontend` — ya estaba cubierto, no se tocó |
| apis y backend | 72 | 93 | `backend` + `be.api`, `be.eventos` |
| base de datos | 62 | 62 | `datos` — ya estaba cubierto, no se tocó |
| auth y permisos | 19 | 24 | `sec.auth`, `sec.sesion`, `sec.llaves` |
| hosting y nube | ~6 | 14 | `ops.nube` (nuevo) |
| CI/CD y control de versiones | **1** | 18 | `ops.ci`, `ops.git` (nuevos) |
| seguridad | 70 | 88 | `seguridad` |
| rate limiting | **3** | 11 | `sec.abuso` |
| cache y cdn | 4 / **0** | 13 / 6 | `perf.cache`, `perf.borde` (nuevos) |
| manejo de errores y logs | 12 | 12 | `be.errores`, `be.observabilidad` — ya estaba |
| monitoreo y alertas | 13 | 13 | `ops.observabilidad` — ya estaba |
| testing | 48 | 48 | `calidad` — ya estaba cubierto, no se tocó |
| escalabilidad | 7 | 12 | `perf.escala` (nuevo), `perf.volumen` |

## Lo que añadimos NOSOTROS bajo «y mas cosas» — tachable

El traductor leyó «y mas cosas» como mandato de ampliar, no como coletilla. Esto
es lo que pusimos sin que lo pidiera, cada uno con la razón por la que lo
pusimos. Si algo no le sirve, se borra su bloque del catálogo y ya.

- **Categoría `saas` entera** — multi-tenant, planes y límites, cobro recurrente,
  trial, onboarding, equipo del cliente, medición de uso, feature flags, salida
  del cliente y panel de administración. *Razón: «estilo saas real» sin ninguna
  de estas piezas es una web bonita que no se puede vender por internet.*
- **Correo transaccional** (`be.correo`) — *Razón: no había ni uno, y un producto
  de autoservicio que no puede mandar un correo de recuperación no existe.*
- **Tiempo real** (`be.tiempo-real`) — *Razón: cero arquetipos, y la primera vez
  que se necesite se improvisará.*
- **Webhooks salientes** (`be.eventos`) — *Razón: había dos de webhooks que
  entran y ninguno de los que mandamos nosotros.*
- **Llaves de API** (`sec.llaves`) — *Razón: en cuanto alguien de afuera consuma
  la API, esto es lo primero que falta.*

## La regla que protege al mostrador

Ninguna de estas tareas puede aparecer en el plan de una caja registradora.
El generador solo dispara un arquetipo de nube, CDN, tenant o suscripción si el
perfil del proyecto declara el interruptor correspondiente **a propósito**
(`nube`, `multiTenant`, `suscripcion`, `autoservicio`, `equipoCliente`,
`correoSaliente`, `apiPublica`, `traficoAnonimo`, `tiempoReal`). Un perfil que
no lo menciona nunca los recibe. Es el tema `la-caja-no-puede-parar` convertido
en mecanismo en vez de en advertencia.

Medido el día que se escribió esto, sobre los tres perfiles reales:

| proyecto | de los 84 arquetipos de refuerzo, recibe | y NO recibe |
|---|---|---|
| villa-broaster (mostrador + PWA) | 36 (CI, git, caché, escala, rate limit) | nube, correo, llaves, auth de autoservicio |
| placita (mostrador en producción) | 34 | lo mismo, más CDN |
| un SaaS de autoservicio | 79 | — |

## El fallo que se encontró de paso

`orion-arquitecto` dictaba `superficies: web-publica`; los 535 arquetipos del
catálogo filtran por `publico`. **Nunca coincidieron.** Cinco arquetipos —entre
ellos `sec.permisos.la-landing-no-es-puerta-de-administracion`— eran
inalcanzables para todo proyecto con web pública, incluido villa-broaster.
Corregido en `plan.mjs` (normaliza el alias), en `_ESQUEMA.md` (vocabulario
cerrado y documentado) y en el propio agente (que ahora conoce los trece
interruptores del perfil).

## El resultado, medido el día que se hizo

El catálogo pasó de **535 arquetipos en 9 categorías** a **725 en 11**. Sobre
perfiles reales, corriendo `plan.mjs generar --dry`:

| proyecto | tareas antes | tareas después | de categoría `saas` |
|---|---|---|---|
| SaaS de autoservicio | 558 | **763** | 57 |
| villa-broaster (mostrador + PWA) | 428 | **565** | **0** |
| placita (mostrador en producción) | — | 1.279 | **0** |

Las 190 tareas nuevas se repartieron así: `arquitectura` 52 · `saas` 54 ·
`operacion` 25 (CI 9, git 8, nube 8) · `backend` 21 (correo 7, tiempo real 5,
API 5, webhooks salientes 4) · `rendimiento` 20 (caché 9, borde 6, escala 5) ·
`seguridad` 18 (abuso 8, llaves 5, sesión y auth 5).

Los 142 checks de aceptación de los refuerzos se auditaron uno por uno: **todos
tienen comando ejecutable y ninguno usa un adjetivo** como criterio.
