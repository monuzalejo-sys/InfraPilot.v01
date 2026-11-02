---
slug: ayuda-dentro-del-sistema
titulo: La ayuda de un sistema vive DENTRO del sistema — novedades por versión y una guía por perfil, vigiladas por una prueba
alias: [ayuda, /ayuda, seccion de ayuda, seccion ayuda, ayuda en la app, ayuda dentro de la app, ayuda integrada, ayuda del sistema, ayuda por perfil, manual dentro del sistema, manual vivo, manual al dia, manual desactualizado, manual viejo, el manual quedo viejo, manual de agosto, documentacion viva, documentacion desactualizada, novedades, novedades por version, que hay de nuevo, que cambio, notas de version, changelog, version de la ayuda, guia por perfil, guias por perfil, perfil de dueno, perfil de apoyo, apoyo y bodega, pocos accesos, que cualquiera se adapte, adaptarse rapido, aprender el sistema, aprender solo, contenido.ts, ayuda.test.ts, AGENTS.md, regla en AGENTS.md, mismo commit, toda pantalla tiene su tema, SECCIONES, tutorial dentro de la app, onboarding dentro de la app]
preguntas: ["¿cómo hago para que cualquiera se adapte rápido al sistema del cliente?", "¿dónde va el manual de uso, en un archivo o dentro de la app?", "¿cómo evito que el manual quede desactualizado?", "¿qué lleva la sección de ayuda de un sistema nuevo?", "¿tengo que actualizar la ayuda cada vez que cambio una pantalla?", "¿cómo aprende el sistema alguien que entra nuevo sin que yo le explique?"]
proyectos: [placita]
confianza: media
actualizado: 2026-11-02
---

# La ayuda de un sistema vive DENTRO del sistema

## Respuesta corta

**Todo sistema que le entregas a un cliente lleva una sección `/ayuda` dentro de
la propia app, no un manual en un archivo.** Dos mitades: **Novedades** (una
entrada por cambio, la más nueva arriba; su fecha es la versión de la ayuda) y
**una guía por perfil** (en placita: apoyo y bodega, cajero, dueño) donde cada
tema dice qué pantalla explica, a quién le sirve y los pasos con el nombre exacto
del botón. Escríbela como **datos tipados** (`lib/ayuda/contenido.ts`), no como
HTML, para que una **prueba** falle si una pantalla (`Seccion` de `lib/auth.ts`)
no tiene tema. Y pon en `AGENTS.md` la regla: **todo cambio visible actualiza la
ayuda en el mismo commit** — la prueba atrapa pantallas *nuevas*, no *cambiadas*.

## Por qué (qué lo pagó)

**El manual de agosto murió en diez semanas.** Placita tuvo un manual Markdown
completo (`MANUAL-DE-USO.md` + `manual/01..18`, 18 secciones y 54 páginas, ~557.000
tokens de dos builders opus; `placita/metrics.json`
`session-2026-08-21-manual-pantalla-completa`), escrito el 2026-08-21
(commit `6258131`) y declarado entonces *"la única fuente oficial de verdad
operativa del dueño"* (`placita/KN-037`). La última vez que alguien tocó `manual/` fue el
2026-10-01 (`3385ea3`). En el mes siguiente cambió lo que el manual explicaba:

| El manual dice | Dónde | Qué pasó después |
|---|---|---|
| "Con 3 facturas sin imprimir la caja se traba" | `MANUAL-DE-USO.md:116`, `manual/05-vender.md:149` | el tope desapareció: el papel es a pedido (`d1d4cb3`, 2026-10-28) |
| El PIN del dueño arranca en `0000` | `MANUAL-DE-USO.md:48`, `manual/03-entrar-con-su-pin.md:9` | PIN de 6 dígitos del dueño y PIN del local (`placita/DEC-036`, 2026-10-18) |
| La caja vive en `caja.dropshoping.com.co` | `manual/01-arranque.md:35` | dominio `mercaplaza.prommter.pro` desde el 18-oct (`instalar-vps.sh:79`, memoria v59 `caa63ec`) |

Nada falló en ninguna prueba: un archivo `.md` no se rompe, solo miente. El
2026-11-02 el commit `3dcfbcf` tuvo que pegarle un letrero arriba
(`MANUAL-DE-USO.md:3-16`) listando lo que ya no era cierto.

**El dueño lo pidió como regla, no como favor.** Petición literal (2-nov-2026,
copiada en `lib/ayuda/contenido.ts:5-9`): *"quiero que tengamos una sección donde
explique cómo hacer todo, siempre, con cada actualización, todo bien detallado,
tanto para el perfil de pocos accesos como el de cajero, y para el perfil de dueño
… hacemos que cualquiera se pueda adaptar rápido"*. Y pidió que valga para los
demás proyectos (dicho en la sesión; no quedó en archivo).

## Cómo se aplica

1. **Una ruta `/ayuda` visible para todos los roles**, alcanzable desde la barra y
   desde la portada (`MANUAL-DE-USO.md:3-10`: «el "?" de la barra de arriba, o
   "Ayuda" en la portada»).
2. **Contenido como datos tipados, la pantalla solo lo pinta.** `TemaAyuda`
   `{id, titulo, pantalla: Seccion | "entrada" | "general", perfiles, resumen, pasos[],
   avisos?[{dice, significa}], atajos?}` y `NovedadAyuda` `{fecha, titulo, perfiles,
   queCambia, comoSeUsa}` (`lib/ayuda/contenido.ts:72-95`); `VERSION_AYUDA =
   NOVEDADES[0].fecha` (`:239`). Que sean datos es lo que permite probarlos.
3. **Los perfiles son guías, no permisos.** Quién ve qué pantalla lo sigue
   decidiendo `puedeVer` (`lib/auth.ts`); la prueba comprueba que un tema para
   cajero o apoyo no explique una pantalla que su rol no puede abrir
   (`lib/ayuda/ayuda.test.ts:141-152`).
4. **Cuatro pruebas hacen de guardia** (`lib/ayuda/ayuda.test.ts`, 20 en total,
   todas en verde el 2026-11-02): (a) cada `Seccion` tiene al menos un tema
   (`:30`); (b) cada perfil tiene ≥6 temas (`:55`); (c) `NOVEDADES` va de la más
   nueva a la más vieja (`:75`); (d) ningún tema sin pasos ni resumen (`:108`).
   El mensaje de fallo dice qué agregar: *"La pantalla «x» no tiene ningún tema…
   Agrega su tema y una entrada en NOVEDADES"* (`:34-37`).
5. **La regla va escrita en `AGENTS.md`** (`AGENTS.md:11-36`), que es lo que lee el
   agente que programa: tema que cambió + entrada nueva arriba de `NOVEDADES`, en
   el mismo commit; pantalla nueva se suma a `SECCIONES` y al agrupador de la
   página de Ayuda (`GRUPO_DE_PANTALLA`, `app/(app)/ayuda/page.tsx:61`).
6. **Español de mostrador**: tú, frases cortas, un paso por renglón, el botón tal
   como se ve entre «comillas», y los avisos de pantalla en parejas
   *dice / significa* — la misma regla de [[TEMA-documentos-para-personas]].
7. **Si el proyecto ya tiene un manual en archivo, no lo borres: ponle un letrero**
   arriba que diga desde cuándo no se actualiza y a dónde ir, y dilo también en
   `AGENTS.md:34-36` para que ningún agente lo "arregle" por costumbre.

## Cuándo NO aplica

- **Un documento de una sola vez sigue siendo un archivo.** Instalación inicial,
  plan de equipo, instrucciones de setup: no cambian cada semana y se imprimen o se
  mandan por PDF ([[TEMA-documentos-para-personas]]). La ayuda interna es para el
  sistema que *sigue cambiando* con el cliente usándolo.
- **La prueba no protege lo editado.** Solo exige que cada pantalla *tenga* tema
  (`ayuda.test.ts:30-39`); un botón renombrado deja el tema falso y todo en verde.
  Ahí manda únicamente la regla de `AGENTS.md` y que quien verifica compare el
  cambio visible contra su tema.
- **No copies el "≥5 novedades" de placita.** `ayuda.test.ts:101-104` exige al menos
  5 entradas con la fecha más nueva. Medido el 2026-11-02 sobre una copia: agregar
  **una** novedad con fecha nueva deja 19 pruebas en verde y 1 en rojo (*"una
  actualización suele traer varias novedades"*). En otro proyecto exige ≥1; en
  placita, el próximo cambio pequeño romperá `npm test` hasta que se ajuste.
- **Si la persona necesita la ayuda para no equivocarse, el arreglo va en la
  pantalla.** La ayuda explica; el aviso en vivo previene
  (`placita/KN-040`, [[TEMA-documentos-para-personas]]).
- **HUECO DECLARADO — nadie del mostrador la ha usado todavía.** Se creó el
  2026-11-02 (`3dcfbcf`: 30 archivos, `contenido.ts` de 1.521 líneas) y no hay
  veredicto de un cajero o un apoyo real; el único aval es el pedido del dueño. La
  confianza es `media` hasta que alguien nuevo la use y diga qué le faltó.

## Evidencia

- `placita/KN-037` — el manual de agosto: 18 secciones, 54 páginas, 12 verificadas
  en vivo y 6 contra código; ~557.000 tokens.
- `placita/DEC-036` — la entrada con PIN del local y PIN de 6 del dueño que dejó el
  manual de agosto falso. `placita/DEC-037` — papel a pedido (reemplaza el tope de
  tres facturas del manual).
- `placita/DEC-046` — la sección Ayuda por perfil, con NOVEDADES; `placita/POL-001`
  (Policy, Active) — la regla de mantenerla al día en el mismo commit. Ojo: es el
  `POL-001` **de placita**, no el `landings/POL-001` de la portada.
- Commit `3dcfbcf` (2026-11-02, placita-repo) — la sección Ayuda: `/ayuda`, tres
  guías, 65 temas con pasos, prueba y regla en `AGENTS.md`.
- `placita-repo/AGENTS.md:11-36` — la regla del dueño, "Ayuda al día".
- `placita-repo/lib/ayuda/contenido.ts:5-9` (petición literal), `:24-30` (la regla
  que lo mantiene vivo), `:72-95` (tipos), `:239` (`VERSION_AYUDA`).
- `placita-repo/lib/ayuda/ayuda.test.ts` — 20 pruebas, 20 en verde (`node --test`,
  2026-11-02); `:101-104` es la aserción frágil, reproducida en una copia (19/20).
- `placita-repo/MANUAL-DE-USO.md:3-16` (letrero), `:48` y `:116`;
  `manual/05-vender.md:149`, `manual/03-entrar-con-su-pin.md:9`,
  `manual/01-arranque.md:35` — lo que quedó falso.
- Commits `6258131` (2026-08-21, manual), `3385ea3` (2026-10-01, última edición de
  `manual/`) y `d1d4cb3` (2026-10-28, papel a pedido).

## Enlaces

- [[TEMA-documentos-para-personas]] — cómo se escribe cada pieza para una persona;
  este tema dice **dónde vive** para que no se pudra.
- [[TEMA-acceso-roles-y-puestos]] — qué ve cada rol; los perfiles de la ayuda son
  su espejo, y `puedeVer` sigue siendo la única autoridad.
- [[TEMA-aprendizajes-de-placita-mercaplaza]] — el resto de lo que pagó este
  proyecto.
- [[TEMA-memoria-y-cierre]] — `AGENTS.md` es el cajón donde una regla le llega al
  agente que programa.
