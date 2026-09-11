# Duo Burguer: cortometraje de 45 segundos — Estado 2026-09-11

## Qué es

Cliente de Prommter: hamburguesería que reabre. Cortometraje anunciativo de 45,2 s sobre once ilustraciones (1376x768) generadas por el dueño, con cámara, luz y efectos animados encima (no se redibuja nada). Publicado privado en `github.com/kalelfelpem-glitch/duo-burguer-video`. Salidas en `out/`: máster 18 Mbps (96 MB), ligero 7 Mbps, móvil 4,5 Mbps (25 MB), preview 2,2 Mbps (12 MB), todos a 1376x768 APAISADO. Va mudo. La marca se escribe «Duo Burguer» (así la escribe el dueño y así va en el corto).

## Estado actual

- **Versión entregada (2026-09-10):** 45,2 s = 42 s de la estructura del dueño en ocho tiempos + 3,2 s de firma de Prommter (letrero que cae). Verificada por olas de agentes mirando y midiendo fotogramas (3 vueltas) y por el director sobre hoja de contactos. La primera versión (18 s, vectores planos) fue RECHAZADA por el dueño: «infantil y feo».
- **Código:** Remotion 4.0.523 + React 19 + Hyperframes v0.8.33 (alternativa Apache-2.0)
- **Repo:** `prommter/duo-burguer-video` (privado)

## Decisiones vigentes

- **DEC-001:** Dominio provisional `duoburguer.prommter.online` si algún día hay vitrina web (no dominio propio aún)
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

1. **KN-003:** Remotion no codifica en macOS 13.7 (dyld error). Salida: `--sequence` + `scripts/encoder.swift` (AVAssetWriter); ffmpeg ya está instalado pero no hace falta
2. **KN-004:** Mac lenta (i5-7360U, 4 hilos). Regla: ruido a 1/3 de resolución, estirar por CSS
3. **KN-008:** Carga > 8 sobre 4 hilos rompe olas de agentes (DNS). Antes de lanzar: mirar `uptime`
4. **KN-009:** macOS codifica video solo (AVAssetWriter, 60 líneas Swift). Alternativa cuando ffmpeg no está
5. **KN-010:** Código 0 no es prueba. Siempre: verificar artefactos, no exit codes

## Límite de infraestructura

El VPS compartido (Hostinger, 4 GB, 1 vCPU) cabe ~3-4 negocios. Duo Burger: puertos 3210 (sistema), 3211 (vitrina). Datos NUNCA comparten carpeta con Villa Broaster (3200/3201).
