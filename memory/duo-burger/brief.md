# Duo Burguer: Cortometraje + Plan de Contenido — 2026-09-11

## Qué es (hoy)

Cortometraje de 45,2 s sobre once ilustraciones del cliente (1376x768 apaisado). Entregado: máster 18 Mbps en `out/duo-burguer-vertical.mp4`; versiones ligera (7 Mbps), cuadrado, ancho. Salidas adicionales: enmarcado vertical para Historia (1080x1920), feed (1080x1350), cinco cortes recortados T1-T5, once láminas 4:5 para redes. Plan de contenido 01 completo en `docs/plan-de-contenido-01.md` (457 líneas, 50 fuentes numeradas): calendario de 7 días, voz de mascotas, palanca de colaboración, métricas, hoja para el cliente. **Primera versión (18 s con vectores planos) rechazada el 2026-09-09: infantil y feo.** La marca se escribe **Duo Burguer**.

## Decisiones activas

**DEC-001:** Dominio provisional `duoburger.prommter.online` (sin dominio propio aún).  
**DEC-002:** Motor Remotion 4.0.523 + React 19; Hyperframes v0.8.33 como herramienta auxiliar.  
**DEC-005:** Cortometraje sobre ilustración: ocho tiempos del cliente, cámara animada, sin redibujo.  
**DEC-006:** Firma de Prommter como gag final (letrero de bombillas que cae y se enciende, 96 fotogramas).  
**DEC-007:** Plan de contenido 01 orgánico, tres redes, corto vertical enmarcado + láminas + días aprobados.

## Pendientes (sin PEND-001/003/005 consolidados en PEND-007)

**PEND-002:** ¿Reusa Villa Broaster o código separado? (modelo de tandas vs por pedido).  
**PEND-004:** Música: swing ~150 bpm, librería con licencia (hyperframes beats para cuadrar).  
**PEND-006:** Regenerar escena 01 si cliente rechaza letrero caligrafia; resolución extra si pide.  
**PEND-007:** Cliente responde hoja (fecha reapertura, dirección, horario, carta, WhatsApp, fotos, promo, mascotas).

## Riesgos

**RSK-001:** Remotion requiere licencia pagada si empresa > 3 personas. Fallback: Hyperframes (Apache-2.0).  
**RSK-002:** Música: lista del cliente son grabaciones famosas. Fallback: librería de swing con licencia.

## Hallazgos KN-015 (tres hechos que cambian lanzamiento en redes, Colombia 2026)

1. Reels se publican NATIVOS en Facebook, no compartidos: +72 % alcance, no silencia música licenciada.
2. Sorteos al azar necesitan Coljuegos/lotería departamental (multas ~90 M COP); votación NO.
3. TikTok: 88 % visualización CON sonido; desde 2025-09-01, comercial requiere interruptor; 37,7 M adultos > Instagram 21,6 M.

## Trampas de la máquina (en este Mac)

**KN-003/009 (fusionadas):** Remotion no codifica en macOS 13 (dyld error). Soluciones: `--sequence` + ffmpeg del sistema, O Swift AVAssetWriter (60 líneas, sin instalar).  
**KN-004:** Mac lenta (i5, 4 hilos). Regla: ruido a 1/3 resolución, estirar por CSS.  
**KN-008:** Carga > 8 sobre 4 hilos rompe olas (DNS). Antes de lanzar: mirar `uptime`.  
**KN-010:** Código 0 no es prueba. Siempre: verificar artefactos, no exit codes.

---
Repo: `prommter/duo-burguer-video` (privado). VPS: puertos 3210 (sistema), 3211 (vitrina).
