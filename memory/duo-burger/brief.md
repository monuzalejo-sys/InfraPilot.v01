# Duo Burguer — Brief de Proyecto — 2026-09-12

## Qué es hoy
Cortometraje de **45,2 segundos a 1376×768 píxeles** entregado en Remotion 4.0.523, construido sobre once ilustraciones del dueño con kit común de efectos (luz, lluvia, confeti, grano, parpadeo, iris). Máster en `out/duo-burguer-nativo.mp4` (18 Mbps); salidas adicionales: vertical enmarcada para Historia (1080×1920) e Feed (1080×1350 StageOverride), cinco cortes T1-T5 para reels, once láminas 4:5 para redes. Plan de contenido 01 íntegro en `docs/plan-de-contenido-01.md` (457 líneas, 50 fuentes). **Primera versión de 18 s rechazada el 2026-09-09: infantil.** La marca se escribe **Duo Burguer**.

## Producto
- **CARTA NEGRA:** precios en `src/carta/datos.ts` (sencilla 13 k, cheddar 15 k, especial 15 k, pollo 17 k, doble 20 k, combos, promociones). Dibujada en `out/redes/carta/`.
- **LANDING:** `landing/dist/index.html` generada con `node landing/build.mjs`. Móvil primero, botón Pedir por WhatsApp visible sin desplazarse, enlace a ubicación, horario como hueco.
- **DATOS REALES** (KN-017): Calle 56 con Carrera 10, Villa del Viento, Popayán. WhatsApp 300 195 5160, Nequi 312 648 4714, empaque 1.000, horario TBD.

## División de trabajo
**PC:** sistema (¿reusa Villa Broaster o código aparte? PEND-002). **Esta Mac:** landing + redes (DEC-008).

## Decisiones activas
DEC-001 (dominio provisional prommter.online), DEC-002 (Remotion motor + hyperframes beats), DEC-005 (cortometraje sobre ilustración, sin redibujo), DEC-006 (firma Prommter gag bombillas), DEC-007 (plan orgánico 3 redes), DEC-008 (landing + WhatsApp).

## Pendientes bloqueantes
PEND-002 (¿reusa o aparte?), PEND-004 (música licencia swing ~150 bpm), PEND-006 (escena 01 letrero), PEND-007 (cliente: fecha, horario, fotos, músca, promo, mascotas, cinco dudas carta).

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
Repo privado: `kalelfelpem-glitch/duo-burguer-video`. VPS: puertos 3210 (sistema), 3211 (vitrina) en Hostinger 2.25.89.240 junto Villa Broaster (3200/3201); datos aislados (CON-001).
