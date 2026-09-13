# Duo Burguer — Brief de Proyecto — 2026-09-12

## Qué es hoy
Cortometraje de **45,2 segundos a 1376×768 píxeles** entregado en Remotion 4.0.523, construido sobre once ilustraciones del dueño con kit común de efectos (luz, lluvia, confeti, grano, parpadeo, iris). Máster en `out/duo-burguer-nativo.mp4` (18 Mbps); salidas adicionales: vertical enmarcada para Historia (1080×1920) e Feed (1080×1350 StageOverride), cinco cortes T1-T5 para reels, once láminas 4:5 para redes. Plan de contenido 01 íntegro en `docs/plan-de-contenido-01.md` (457 líneas, 50 fuentes). **Primera versión de 18 s rechazada el 2026-09-09: infantil.** La marca se escribe **Duo Burguer**.

## Producto
- **CARTA NEGRA:** precios en `src/carta/datos.ts` (sencilla 13 k, cheddar 15 k, especial 15 k, pollo 17 k, doble 20 k, combos, promociones). Dibujada en `out/redes/carta/`.
- **LANDING (DEC-009):** sin WhatsApp. `landing/` del video es vista previa: carta real, aviso «Los pedidos en línea abren muy pronto», botón «Ver la carta», carrito dormido. Íconos por ingredientes en cada hamburguesa (KN-019). La que venderá es `duo-vitrina/` en el repo compartido `kalelfelpem-glitch/duo-burguer`, contra su `docs/CONTRATO-API.md` (KN-018). Traspaso: PR #1 y `docs/VITRINA-MAC.md`.
- **DATOS REALES** (KN-017): Calle 56 con Carrera 10, Villa del Viento, Popayán. Contacto y Nequi 300 326 0448, empaque 1.000, horario todos los días 7 a.m. a 10 p.m..

## División de trabajo
**Repo compartido `duo-burguer` (canónico, memoria en su `memory/duo-burger`):** el PC escribe `duo-sistema/` (Next 16 + node:sqlite, :3500), `contrato/`, `HUECOS.md` y su memoria. **Esta Mac:** `duo-vitrina/` (:3501) en ramas `mac/*` con PR, más video, marca y redes aquí. Código aparte, no reusa Villa Broaster. Siguiente: PEND-008 (construir duo-vitrina).

## Decisiones activas
DEC-001 (dominio provisional prommter.online), DEC-002 (Remotion motor + hyperframes beats), DEC-005 (cortometraje sobre ilustración, sin redibujo), DEC-006 (firma Prommter gag bombillas), DEC-007 (plan orgánico 3 redes), DEC-009 (sin WhatsApp; vitrina en repo compartido).

## Pendientes bloqueantes
PEND-004 (música licencia swing ~150 bpm), PEND-006 (escena 01 letrero), PEND-007 (cliente: fecha, horario, fotos, música, promo, mascotas, dudas carta), PEND-008 (construir duo-vitrina en rama mac/*).

## Riesgos
RSK-001 (Remotion licencia empresa >3 personas; fallback Hyperframes Apache-2.0). RSK-002 (música cliente grabada; fallback librería swing licencia).

## Hallazgos KN-015 (tres hechos redes Colombia 2026)
(1) Reels nativos Facebook +72 % alcance vs compartidos desde Instagram. (2) Sorteos azar necesitan Coljuegos (~90 M COP multa); votación permitida. (3) TikTok 88 % con sonido; vídeo mudo no va; 37,7 M adultos > Instagram 21,6 M; WhatsApp 73 % consumidores.

## Trampas de la máquina
KN-009: Remotion no codifica en macOS 13 (dyld); usar `--sequence` + encoder.swift 60 líneas (H.264 hardware).
KN-004: Filtros SVG sobrecargan; ruido a 1/3 resolución, estirar CSS.
KN-008: uptime > ~8 sobre 4 hilos rompe olas (DNS); cinco spawns murieron 2026-09-09.
KN-010: Código 0 no prueba nada; verificar artefacto (duración, fotograma extraído).

---
Repos privados: `kalelfelpem-glitch/duo-burguer-video` (video, marca, carta, vista previa) y `kalelfelpem-glitch/duo-burguer` (sistema + vitrina). Puertos vigentes 3500 (sistema) y 3501 (vitrina) según el repo compartido; datos aislados de Villa Broaster (CON-001).
- **PUBLICADA (DEC-010):** carta pública para `duoburguer.prommter.com` en GitHub Pages (repo público `duo-burguer-carta`, `landing/publicar.sh`). QR del local y cartel A5 en `out/redes/qr/`, apuntan al dominio. **Falta el CNAME en Hostinger (PEND-009)**. prommter.online es de Villa Broaster: no se usa.
