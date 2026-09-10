# Duo Burger: Cortometraje de 45 segundos — Estado 2026-09-10

## Qué es

Cortometraje de 45 s sobre once ilustraciones (1376x768) generadas por el cliente. Personajes articulados, cámara dinámica, efectos de luz y partículas. Publicado privado en `github.com/kalelfelpem-glitch/duo-burguer-video` (cuatro formatos: vertical 1080x1920, cuadrado, ancho, ligero para redes). Proyecto de la agencia Prommter.

## Estado actual

- **Versión entregada:** 18 segundos de corto + firma de agencia (96 fotogramas)
- **Código:** Remotion 4.0.523 + React 19 + Hyperframes v0.8.33 (alternativa Apache-2.0)
- **Repo:** `prommter/duo-burguer-video` (privado)

## Decisiones vigentes

- **DEC-001:** Dominio provisional `duoburger.prommter.online` (no dominio propio aún)
- **DEC-002:** Motor Remotion (desensamble React); Hyperframes como herramienta auxiliar
- **DEC-005:** Cortometraje sobre ilustración: once pinturas, ocho tiempos del cliente, cámara animada sobre arte
- **DEC-006:** Firma de Prommter como gag final (letrero de bombillas que cae y se enciende)

## Pendientes abiertos

- **PEND-001:** Que el cliente defina qué ES Duo Burger (sedes, estado firma, qué necesita: caja/vitrina/ambas)
- **PEND-003:** Ortografía oficial de la marca + carta real con precios
- **PEND-004:** Música del teaser (swing ~150 bpm, librería con licencia; hyperframes beats para cuadrar)
- **PEND-005:** Fecha de reapertura + logo original en vectores o PNG transparente
- **PEND-006:** Regenerar escena 01 si cliente rechaza letrero viejo; pedir más resolución si quiere nitidez en cerrados

## Riesgos

- **RSK-001 (Remotion):** Licencia pagada si empresa > 3 personas. Solución: reescribir en Hyperframes (Apache-2.0)
- **RSK-002 (Música):** Lista del cliente son grabaciones famosas (Benny Goodman, etc.). Solución: librería con licencia

## Trampas de la máquina (KN-003/004/008/009/010)

1. **KN-003:** Remotion no codifica en macOS 13.7 (dyld error). Salida: `--sequence` + ffmpeg del sistema
2. **KN-004:** Mac lenta (i5-7360U, 4 hilos). Regla: ruido a 1/3 de resolución, estirar por CSS
3. **KN-008:** Carga > 8 sobre 4 hilos rompe olas de agentes (DNS). Antes de lanzar: mirar `uptime`
4. **KN-009:** macOS codifica video solo (AVAssetWriter, 60 líneas Swift). Alternativa cuando ffmpeg no está
5. **KN-010:** Código 0 no es prueba. Siempre: verificar artefactos, no exit codes

## Límite de infraestructura

El VPS compartido (Hostinger, 4 GB, 1 vCPU) cabe ~3-4 negocios. Duo Burger: puertos 3210 (sistema), 3211 (vitrina). Datos NUNCA comparten carpeta con Villa Broaster (3200/3201).
