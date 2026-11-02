---
slug: publicar-al-servidor
titulo: «Publicado» es lo que el servidor sirve — la rama que clona y el esquema que se aplica antes del build
alias: [publicar, publicado, ya quedo publicado, quedo publicado, no esta publicado, quiero que quede publicado, publicar.sh, publicar al vps, publicar en el vps, publicar al servidor, despliegue, desplegar, deploy, redeploy, redespliegue, actualizar el servidor, subir al servidor, produccion, no se ve el cambio, no cambio nada, el script no hizo nada, corri el script y no paso nada, sigue viendo lo viejo, codigo viejo en el servidor, servidor viejo, pr fusionado, fusione el pr, fusionar, merge, merge a main, rama, ramas, rama del servidor, rama por defecto, default branch, main, master, origin/main, origin/master, main o master, git pull, ff-only, avance rapido, fast forward, instalar-vps.sh, RAMA_SISTEMA, clonar el repo, already up to date, migraciones pendientes, migraciones_aplicadas, esquema antes del codigo, base antes de compilar, publicar aplica la base, esquema desincronizado, cola de sincronizacion trabada, cola trabada]
preguntas: ["¿ya quedó publicado lo que fusioné?", "corrí el script de publicar y no cambió nada, ¿por qué?", "¿el servidor publica main o master?", "se fusionó el PR pero el cliente sigue viendo lo viejo", "¿al publicar, la base se actualiza antes o después de compilar?", "¿cómo sé que producción tiene el esquema al día?"]
proyectos: [placita]
confianza: media
actualizado: 2026-11-02
---

# «Publicado» es lo que el servidor sirve

## Respuesta corta

**Fusionado no es publicado.** Antes de decir «publicado» comprueba qué rama tiene
clonada el servidor (en placita: `master`, fijada en `despliegue/instalar-vps.sh:64`)
y que esa rama **contiene tu commit**: `git fetch origin && git rev-list --left-right
--count origin/master...origin/main` debe dar `0 0`. Si `main` va adelante, llévalo
con `git push origin origin/main:master` (solo avance rápido, nunca `--force`). Tras
correr `publicar.sh`, compara el `en master @ <sha>` que imprime con el commit de tu
merge. El SQL nuevo de la base se aplica **dentro** de publicar, después del `git
pull` y **antes** de `npm run build`: un código que llega antes que su SQL no
avisa, traba la cola de la caja.

## Por qué (qué lo pagó)

**El PR #2 se fusionó y nunca salió.** El recibo nuevo de 58 mm entró a `main` el
2026-10-28 14:53 (merge `1083611`, PR #2 `arreglo/recibo-58mm`), pero el servidor
tenía clonado `master`: el dueño corría el script y la caja seguía con el recibo
viejo (*"quiero que quede publicado, no está"*, dicho en la sesión del 2-nov; no
quedó en archivo). Nada falló: `git pull --ff-only` sobre una rama sin commits
nuevos termina bien y compila lo mismo de ayer. El 2-nov quedó escrito en la guía
(`DESPLIEGUE-VPS.md:298-301`, `placita/KN-075`) y se llevó `main` a `master`: tras el
PR #3 las dos quedaron en el mismo commit, `867549b` (`rev-list --left-right
--count` → `0 0`).

**Es la misma trampa, por el lado contrario.** El 2026-09-14 la rama por defecto
de GitHub era `main` pero el trabajo se commiteaba en `master`, con 6 commits que
`main` no tenía; un `git clone` a secas habría servido código viejo, y se arregló
fijando `RAMA_SISTEMA="master"` (`instalar-vps.sh:56-64`). En octubre el trabajo ya se
fusionaba en `main` (merges `29081a8` del 15-oct, `cc6214d` del 18-oct y `1083611` del
28-oct) y ese mismo candado se volvió la trampa.
La rama no es una constante: es **una pareja** —dónde se fusiona ↔ qué clona el
servidor— y se desajusta cuando cambia cómo llega el trabajo, no cuando alguien
toca el script.

**El código por delante del esquema es silencioso.** El 2026-10-18 se descubrió que
producción no tenía aplicadas dos migraciones (`2026-09-29-fk-documentadas-y-control-
migraciones` y `2026-09-30-ventas-monotonas`) aunque el código que las suponía
llevaba desplegado desde el 2026-10-01: **17 días** sin que nada fallara a la vista
(`placita/KN-072`). Y una fila que la base rechaza no deja pasar a las de atrás en
la cola de sincronización (`placita/KN-074`: un solo basurero con `producto_id ""`
trababa la cola entera). Pegar el SQL a mano dependía de que alguien se acordara,
y el propio script lo cuenta: un código que llegara antes que su SQL *trababa la
caja* (`publicar.sh:90-93`).

## Cómo se aplica

1. **Antes de decir «publicado»:**
   - Las dos ramas iguales: `git ls-remote origin refs/heads/main
     refs/heads/master` da el mismo SHA en las dos líneas (se hace desde la Mac,
     sin servidor).
   - Si no: `git push origin origin/main:master`. Sin `--force`: si `master` tiene
     algo que `main` no, el push se rechaza, y eso es lo que quieres enterarte.
   - Corre `publicar.sh` y lee su última línea: `en <rama> @ <sha>`
     (`publicar.sh:132-136`, escrita precisamente porque *"un servidor clonado en
     la rama equivocada sirve código viejo sin fallar ni avisar"*). Si la rama es
     otra o el SHA no es el de tu merge, **no está publicado**.
   - Mira el cambio desde fuera, en la URL real (ver [[TEMA-un-vps-varios-negocios]],
     paso 7).
2. **Al instalar un servidor, elige la rama donde se fusiona el trabajo HOY** y
   escribe al lado el motivo y la fecha (`instalar-vps.sh:56-64`); vuelve a mirarla
   cada vez que cambie el flujo (commits directos → PR, o al revés).
3. **La secuencia del publicar es** apagar → `git pull --ff-only` → SQL pendiente →
   `npm ci` → `npm run build` → encender (`DESPLIEGUE-VPS.md:303-312`). Los
   archivos de `supabase/migraciones/` que no estén en
   `public.migraciones_aplicadas` se corren solos; si uno falla, no se
   compila y el servicio vuelve con el código anterior (`publicar.sh:88-128`).
4. **Cada archivo SQL tiene que ser corrible por el script**: su propio
   `begin/commit` e idempotente (`publicar.sh:96-97`). Una que no cumpla eso no se
   deja al automático.
5. **Consulta la tabla antes de dar nada por aplicado** (`placita/KN-072`): mira
   `migraciones_aplicadas`, respalda (`base-vps.sh respaldo`), aplica, y vuelve a
   mirar.

## Cuándo NO aplica

- **Si el servidor sigue la rama por defecto no hay pareja que sincronizar.** En
  `placita-tienda` la por defecto sí es `master` y la tienda no tuvo el problema
  (`instalar-vps.sh:62-63`). La comprobación sobra cuando clonaste sin `-b` y
  trabajas en esa misma rama.
- **Correr el SQL desde `publicar.sh` presupone acceso a la base.** En
  placita sí: PostgreSQL local del VPS, `sudo -u postgres psql`
  (`publicar.sh:101-102`). Donde el cliente pega el SQL a mano (Supabase SQL Editor,
  infrapilot) sigue valiendo el patrón anterior —código por delante, error con
  código propio y banner— de [[TEMA-dominio-migraciones-y-copias]].
- **HUECO DECLARADO — el SQL automático no se ha visto correr.** Está
  escrito (`119f5a4`, 2026-11-02) pero `placita/PEND-033` sigue `Ready`: lo corre
  solo el dueño en el VPS (desde la Mac no hay SSH) y el pulido de noviembre aún no
  está publicado. Lo medido es la rama, no el `aplicar_migraciones`. La confianza
  es `media` hasta la primera publicación real.
- **Sigue sin resolver: nada en el script detecta que `main` va adelante.** Un
  `grep` de `origin/main` en `publicar.sh` da cero; el aviso depende de que alguien
  lea el `@ <sha>`. Y los comentarios de `publicar.sh:135-136` e
  `instalar-vps.sh:56-64` aún cuentan el flujo de septiembre (el trabajo va en
  `master`), que ya no es el actual.

## Evidencia

- `placita-repo/DESPLIEGUE-VPS.md:298-312` — "El servidor publica la rama `master`"
  y la secuencia con el SQL pendiente; menciona el caso del 28-oct.
- `placita-repo/despliegue/instalar-vps.sh:56-64` — la rama fijada y el incidente del
  2026-09-14 (`master` con 6 commits que `main` no tenía).
- `placita-repo/despliegue/publicar.sh:88-128` (SQL solo) y `:132-136` (rama
  y commit al final).
- Commit `1083611` (2026-10-28 14:53) — merge del PR #2 a `main`. Commit `119f5a4`
  (2026-11-02) — publicar corre el SQL pendiente y la guía dice `master`.
- `git rev-list --left-right --count origin/master...origin/main` → `0 0` (medido
  2026-11-02 en `placita-repo`; `867549b` tras el PR #3).
- `placita/KN-072` — producción sin 2 migraciones, 17 días, silencioso. `placita/KN-074`
  — la fila rechazada que traba la cola. `placita/KN-075` — el VPS publica `master`
  y el flujo PR a `main` + `git push origin origin/main:master`. `placita/PEND-033`
  — publicar el pulido, pendiente del dueño.

## Enlaces

- [[TEMA-un-vps-varios-negocios]] — la receta de instalar; el paso 3 (clonar) es donde
  se elige la rama.
- [[TEMA-dominio-migraciones-y-copias]] — el patrón cuando el SQL se pega a mano y la
  evidencia de que ese camino deja el esquema atrás en silencio.
- [[TEMA-que-es-estar-verificado]] — «hecho» se comprueba en el lugar donde vive el
  resultado; aquí ese lugar es lo que sirve el servidor, no el merge.
- [[TEMA-la-caja-no-puede-parar]] — por qué una cola trabada importa: la venta se
  guarda en el local y sube cuando puede.
