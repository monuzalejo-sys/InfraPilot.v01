# ¿Qué tiene Delta y por qué lo eligen tanto en Popayán?

- Fecha: 2026-11-02
- Para: Prommter — entender al que ya está antes de construirle encima
- Sigue a: [Delta en el Cauca](../2026-11-02-delta-cauca/INFORME.md) y
  [Salida de datos de Delta](../2026-11-02-salida-de-datos-delta/INFORME.md)
- Anexos: [`inventario.md`](inventario.md) (todo lo que trae, módulo por módulo) ·
  [`alternativas.md`](alternativas.md) (12 competidores con precio) · [`fuentes.md`](fuentes.md)
- Estado: terminada, con huecos declarados al final

## Respuesta corta

1. **Lo que tiene es mucho y es serio.** Cuatro módulos: contabilidad completa (PUC
   comercial, cooperativo y oficial; medios magnéticos; NIIF; certificados de
   retención), cartera con mora y multas, inventario con un punto de venta que le
   sirve de verdad a una tienda (seis listas de precio por producto, balanza, código
   de barras, productos compuestos, obsequios, cuadre de caja, conteo físico con
   comparativo) y una auditoría que guarda todas las versiones de cada documento. 65
   videotutoriales. Detalle en [`inventario.md`](inventario.md).
2. **Por qué lo eligen — lo que tiene evidencia:**
   - **Se paga una vez.** «Se paga por la licencia una única vez» (tesis de Popayán,
     2021). En 2013 eran **$1.500.000 por un computador**, con empresas ilimitadas.
     Sus competidores en la nube cobran **cada mes**, y juntar punto de venta con
     contabilidad en la nube cuesta entre **$150.000 y $280.000 al mes**.
   - **Funciona sin internet**, instalado en el computador del local. De los 12
     competidores revisados, **solo tres** dicen vender sin conexión.
   - **Es el programa del contador, y el contador es quien decide.** Cien empresas
     por instalación (hoy) o ilimitadas (2013): un contador lleva a todos sus
     clientes en una sola licencia. Y el mercado laboral lo pide: **ACOPI Cauca
     publicó el 5 de octubre de 2026 un aviso** que exige «Manejo comprobable del
     sistema contable Delta».
   - **Nació aquí.** Empresa caucana de los años 90; en 2013 se compraba escribiendo
     a un correo de la **Universidad del Cauca**, y una tesis de contaduría del Cauca
     lo recomendaba. Capacita al personal cuando se compra.
3. **Y por qué lo dejan — también con evidencia.** Una constructora de Popayán lo usó
   **más de ocho años** y en 2021 la tesis que la estudió recomendó cambiarlo por
   Siigo Nube: «no arroja la información contable necesaria», atrasos constantes, no
   se puede trabajar a distancia, «ya se encuentra obsoleto». **Quien crece y quiere
   ver su negocio desde fuera de la oficina, se va a la nube.**
4. **Lo que esto le dice a Prommter:** el piso de arriba ataca exactamente la razón
   documentada por la que se van —ver el negocio a distancia— **sin quitarles** las
   tres razones por las que se quedan: pago único, sin internet y el contador que ya
   lo sabe. Y la puerta de entrada no es el tendero: **es el contador** (§4).
5. **«Tanto» sigue sin cifra.** La evidencia pública es poca y vieja: una tesis, un
   aviso de empleo, dos clientes en su propio sitio. Que Delta sea dominante en
   Popayán lo dice el dueño de Prommter; **la web no lo confirma ni lo desmiente.**

---

## 1. Lo que tiene

Resumen; el inventario completo con sus citas está en [`inventario.md`](inventario.md).

| Módulo | Lo fuerte | Lo viejo |
|---|---|---|
| Inventario + POS | Cajón, tiquetera, código de barras, balanza; 6 precios por artículo; compuestos; 4 métodos de costeo; facturación que descarga el kárdex; cotizaciones, pedidos, devoluciones; cuadre de caja; conteo físico con comparativo; alertas | Anuncia ajustes por inflación por artículo |
| Contabilidad | **100 empresas por instalación**; PUC comercial, cooperativo y oficial; exógena y medios magnéticos; NIIF y homologación; retenciones; cierres que se rehacen; formatos para guardar reportes | Anuncia ajustes integrales por inflación (eliminados en 2007) |
| Cartera | Créditos dados y recibidos, mora, multas, plan de pagos, por zonas | — |
| Auditoría (SAD) | Cada cambio con usuario, terminal y hora; todas las versiones del documento, en base aparte | — |

Dos detalles que importan para la venta:

- **La grieta del precio cambiado a mano es una función**: tiene tutorial propio
  («Modificar el precio de un producto en una factura», 0:34).
- **El conteo físico existe** (tutoriales 26 y 27). Las existencias en −474 de La Villa
  no son una falla del programa: son un conteo que nadie hace. Eso es un **hábito**
  que el piso de arriba puede empujar con alertas, no un software que haya que cambiar.

## 2. Por qué lo eligen

Cada razón con su fuente y su fuerza. «Inferencia» = lectura nuestra de un hecho
citado, no algo que la fuente diga.

### 2.1 Se paga una vez — `citado`

- Tesis de Contaduría, Corporación Universitaria Comfacauca, Popayán, 2021, sobre
  Ingenieros Civiles P&G SAS, en su tabla de comparación (p. 71): «Software de
  instalación local», «Se paga por la licencia una única vez».
- Tesis de Contaduría, Universidad del Valle, sede Norte del Cauca, 2013 (p. 108),
  sobre Delta 1.4 versión 2008: «La inversión para la licencia del Software para un
  equipo es de $1.500.000», con CD, manual, instalación personalizada y «soporte
  gratuito via internet»; un solo equipo y «un número ilimitado de empresas».
  **Precio de hace trece años, no de hoy.**

Contra qué compite ese pago único (precios publicados, vistos el 2026-11-02; detalle
en [`alternativas.md`](alternativas.md)):

| Para tener punto de venta + contabilidad | Cuánto | Cómo se paga |
|---|---|---|
| Siigo Nube Emprendedor | $2.295.920 al año (≈ $191.327/mes) | anual, cada año |
| Alegra POS Pyme + Contabilidad Pyme | $79.900 + $163.900 al mes | mensual, cada mes |
| Loggro POS Avanzado + contabilidad | $96.990 + $68.990 al mes | mensual, cada mes |
| **World Office Escritorio Pyme** (el más parecido a Delta) | **$2.751.280 IVA incluido, una vez**; renovación opcional 15 % al año; factura electrónica $300.000 por NIT | pago único + opcionales |
| Delta | **no publica** | pago único (2021) |

**Inferencia:** en tres años, una suscripción en la nube cuesta entre $5 y $10
millones; un pago único se olvida. Para un tendero que mira la plata del mes, «ya lo
pagué» pesa más que cualquier función.

### 2.2 Funciona sin internet — `citado`

Delta se instala en el computador (tesis 2021, p. 72: funciona «siempre y cuando esté
instalado a un computador»). De los 12 competidores revisados, **solo tres** dicen
vender sin conexión: Alegra POS («Trabaja en línea y sin conexión»), World Office Cloud
POS («POS con ventas offline») y Vendty Escritorio (vende con la red local, sincroniza
cuando vuelve internet). Siigo POS «funciona totalmente en la Nube»; Loggro es «100%
Web»; Treinta «requiere conexión a internet para registrar ventas».

Esto ya lo sabíamos por nuestra cuenta: es el tema del cerebro
[`la-caja-no-puede-parar`](../../cerebro/temas/la-caja-no-puede-parar.md). **La caja
que se cae con el internet pierde la venta, y en el mostrador eso no se perdona.**

### 2.3 Es el programa del contador — `citado + inferencia`

- **Cien empresas por instalación** (sitio de Delta, hoy); **ilimitadas** (tesis 2013).
  Un contador de Popayán compra una licencia y lleva a todos sus clientes en ella.
- **El mercado laboral lo exige:** ACOPI Cauca —el gremio de las mipymes del Cauca—,
  aviso del 5-oct-2026 en elempleo.com, «Secretaria auxiliar contable», Popayán,
  $1,5 a $2 millones: «Manejo comprobable del sistema contable Delta.» Es el único
  aviso de auxiliar contable en Popayán que lo pide en ese portal; no apareció en
  Computrabajo, Magneto, LinkedIn ni la agencia del SENA.
- **Se enseña:** hay un curso «Paquete Contable Delta» de System Plus de Colombia,
  localizado en el Cauca, en un portal de cursos. `secundaria, sin fecha`

**Inferencia — el mecanismo:** el contador lo recomienda porque lleva a todos sus
clientes en él → los auxiliares de Popayán lo aprenden → los negocios contratan a
quien ya lo sabe → nadie quiere cambiar. **Es un círculo que se alimenta solo**, y por
eso «lo eligen tanto»: no lo elige el tendero, **lo hereda del contador**.

### 2.4 Nació aquí — `citado`

- «DELTA Ingeniería es una empresa Caucana, que surge en los años 90» (su sitio).
- En 2013 se conseguía escribiendo a un correo `@atenea.ucauca.edu.co` —el dominio de
  la **Universidad del Cauca**— (tesis 2013, p. 109). **Inferencia:** un origen ligado a
  la universidad pública de la ciudad, que es también la que forma contadores.
- Cuando se compra, «el proveedor realiza una capacitación al personal describiendo
  todas las funcionalidades» (tesis 2021, p. 46).

### 2.5 Ya está ahí — `citado + inferencia`

P&G llevaba «más de 8 años trabajando con el software Delta Evolution» (tesis 2021,
p. 73). Ocho años de datos, de costumbre y de personal entrenado. **Inferencia:** el
costo de cambiar no es la licencia nueva; es migrar, reentrenar y arriesgar el cierre.

## 3. Por qué lo dejan

La única evidencia pública de un cliente que se va. Tesis 2021 sobre Ingenieros Civiles
P&G SAS, constructora de Popayán con «más de 20 años» e ingresos de $4.694 millones en
2020:

- p. 8: Delta «no le permite trabajar de manera rápida y no arroja la información
  contable necesaria».
- p. 73: «la empresa ha crecido» y «el software utilizado ya se encuentra obsoleto»;
  ser de instalación local «representaba una limitación física».
- p. 88: «atrasos constantes de la información contable», «la inexistencia del centro
  de costos establecido» y que «no es posible encontrar la información que se requiere
  a tiempo».
- La recomendación: **Siigo Nube**, por poder usarse «en cualquier computador, tableta o
  teléfono celular» y trabajar a distancia (p. 70–71).
- p. 42: P&G usaba **Facturatech** para la factura electrónica, aparte de Delta.

Dos lecturas honestas:

- **Varias quejas son de uso, no del programa.** Delta sí maneja centros de costo (su
  propia ficha los lista en «Información base»); que P&G no lo tuviera «establecido» es
  parametrización. La misma tesis habla de capacitación insuficiente.
- **La queja que sí es del programa es una sola: no se puede ver desde fuera del
  computador.** Es exactamente lo que el piso de arriba resuelve.

Y un caso dudoso: en la sección de «mejores prácticas» (p. 79) la tesis cuenta que una
constructora hizo «el cambio del software contable inicial llamado DELTA a un nuevo
Software contable SIIGO NUBE». El texto no deja claro si es P&G u otra empresa del
estudio. `no se cuenta como segundo caso`

## 4. Qué cambia para Prommter

1. **Vender al contador, no solo al tendero.** El que decide qué software lleva un
   negocio en Popayán es, con mucha probabilidad, su contador (§2.3). Un contador con
   veinte clientes en Delta es veinte ventas posibles del piso de arriba **sin pelear
   con Delta**: al contador no le quitamos nada, le damos un tablero para mostrarle a
   cada cliente.
2. **El rival del piso de arriba no es Delta: es la migración a Siigo Nube.** Cuando un
   negocio de Delta quiere ver su negocio desde el celular, hoy la salida documentada
   es **irse**. Nosotros ofrecemos **quedarse y ver**: sin migrar, sin reentrenar, sin
   tocar el cierre.
3. **No pelear con el pago único.** Una mensualidad de Prommter al lado de un Delta
   «ya pagado» se compara con cero. El precio del piso de arriba tiene que poder
   explicarse en plata que aparece (la plata parada, el precio cambiado a mano, la
   compra que subió), no en funciones. `HUECO: no sabemos cuánto pagó La Villa`
4. **Nunca depender de internet para cobrar.** Sigue siendo la regla: Delta cobra, el
   piso de arriba lee.
5. **Respetar al software.** Lo que vimos mal en La Villa (precios a mano, existencias
   en negativo) son funciones y hábitos, no fallas de Delta. Decirle a un cliente «su
   Delta está mal» es falso y además ofende a su contador.

## 5. Lo que no apareció

| Búsqueda | Resultado |
|---|---|
| Precio actual de Delta | Nada. Solo el de 2013 ($1.500.000, versión 1.4) |
| Cuántos negocios lo usan | Ninguna cifra. Clientes con nombre: P&G (tesis), Asadero Kikos (2015) y Giramos S.A. (2018) en su sitio |
| Otras tesis de Popayán que lo citen | Ninguna más en Unicauca, UNAD, SENA Cauca ni Colegio Mayor; los PDF de Unividafup dan 404 |
| Contratos públicos | Ninguno en SECOP con el NIT candidato ni con entidades del Cauca |
| Cooperativas o sector financiero que lo usen | Ninguna, aunque su sitio dice haber nacido para ese sector |
| Facebook y canal de YouTube | Muro cerrado; YouTube no da fechas ni suscriptores sin navegador. Según el agente que buscó, los videos que pudo ver se subieron el 21-mar-2019 con entre 924 y 11.805 vistas `no verificado por el orquestador` |
| Curso de Comfacauca «Siigo y Delta» | El buscador lo mostraba; la página da 404. **No se cuenta** |
| Razón social y NIT | Candidata: «DELTA INGENIERIA EDS SAS», NIT 901566389, Popayán, constituida en 2022 — con dirección distinta a la del sitio. **No confirmada**; confirmar en el RUES antes de usarla |

## Lo que no se pudo confirmar

1. **Cuánto cuesta Delta hoy** — se pregunta en La Villa ([pedido](../2026-11-02-salida-de-datos-delta/PEDIDO-LA-VILLA.md), punto 6).
2. **Cuántos negocios de Popayán lo usan.** Método en [salida de datos §5](../2026-11-02-salida-de-datos-delta/INFORME.md): La Villa, dos o tres contadores, un censo de mostrador.
3. **Que el contador sea quien decide** (§2.3) es una inferencia fuerte, no un dato.
   **Se rompe si** los tenderos eligen solos: entonces vender al contador es perder el
   tiempo. Se comprueba preguntándole a La Villa quién le recomendó Delta.
4. **Si la licencia sigue siendo de pago único** o ya cobra soporte o factura
   electrónica por año. La tesis de 2013 habla además de un «periodo de licenciamiento
   de tres meses» que no se entiende bien.
5. **Si «Delta 1.4» (2013) es el mismo Delta Evolution.** Coinciden los cuatro menús
   (Información base, Documentos, Informes, Utilidades) y la ciudad; no hay una fuente
   que lo diga con todas las letras.
6. **Si Facturatech es el proveedor de factura electrónica de otros clientes de Delta.**
   Era el de P&G en 2021; no aparece con ese nombre en el listado DIAN de 2026 (puede
   figurar con otra razón social). No se puede generalizar.
