# Fuentes

## Leídas el 2026-11-03

| Fuente | Qué dio | Calidad |
|---|---|---|
| `delta-ingenieria.net/2020habc/index.php/es/tutoriales/40-video-tutoriales-modulo-inventario` | Los 26 tutoriales del módulo de Inventario con su duración: «24 Reporte existencia de productos» (2:10), «25 Reporte productos no inventariados» (2:08), «26 Reporte comparativo inventario fisico» (2:11), «27 Como realizar un inventario físico» (6:18), «18 Ajuste de valores por lista de precios» (1:52), «17 Configuración de balanzas electronicas» (0:55), «1 Crear Producto» (0:47). Leído por HTTP: el sitio rechaza HTTPS | primaria |
| `delta-ingenieria.net/2020habc/index.php/es/tutoriales/6-tutoriales-contabilidad-delta-evolution` | Los 38 de Contabilidad: «23 Funcionalidades menú reportes» (1:16), «24 Visualización de reportes» (2:28), **«25 Tipo de formatos para guardar reportes» (3:28)**, «2 Importación de plan de cuentas» (2:46), «34 Copias de respaldo backups» (2:44) | primaria |
| `youtube.com/watch?v=3vUq930j9T4` | Confirma por el título de la página que ese video **es** «25 Tipo de formatos para guardar reportes» y que dura 207,7 s. **No se pudo ver el contenido**: son grabaciones de pantalla sin voz, sin transcripción, y el panel del navegador no pudo tomar captura en esta sesión | primaria, parcial |
| API de Open Food Facts (`world.openfoodfacts.org/api/v2/product/<ean>.json`) | Consulta de los 15 EAN reales del catálogo de La Villa. 4 con nombre y marca utilizables, 2 encontrados pero vacíos, 9 inexistentes | primaria · medición propia |

## De casa

| Fuente | Qué dio |
|---|---|
| `prommter/la-villa-repo/docs/sistema-actual.md` | Las columnas reales del POS (`Código · Descripción · Cantidad · Unidades · Precio Inc. IVA · Descuento · % IVA · Valor Total`), el pie de línea con `U.P.C` y `U.F.C`, los códigos mezclados (EAN de 13 y códigos cortos `H1`, `96`, `200`), las existencias en −20, −133 y −474, y la Costeñita a dos precios en la factura 16277 |
| [Salida de datos de Delta](../2026-11-02-salida-de-datos-delta/INFORME.md) | Que el XML del documento equivalente POS trae ítems y **precio unitario** (anexo técnico DIAN, pág. 120), que `ProviderID` dice quién transmite (pág. 31), y que la DIAN **no** entrega los XML en lote |
| [Delta en el Cauca](../2026-11-02-delta-cauca/INFORME.md) | Las ocho grietas, y que la ruta es el piso de arriba de Delta, no reemplazarlo |

## Lo que se buscó y no está

- El contenido del tutorial «Tipo de formatos para guardar reportes». Son videos
  de clic sin audio; no hay transcripción que leer.
- Cualquier mención pública del motor de base de datos de Delta, o de un
  exportador de catálogo documentado.
