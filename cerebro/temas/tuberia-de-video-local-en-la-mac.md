---
slug: tuberia-de-video-local-en-la-mac
titulo: Tubería de video local en la Mac Intel (whisper, yt-dlp, ffmpeg, cortes y subtítulos)
alias: [whisper, whisper-cli, whisper.cpp, large-v3-turbo, -ng, texto basura, transcripcion en varios idiomas, alucina, subtitulos palabra por palabra, subtitulos karaoke, subtitulos automaticos de youtube, json3, es-orig, tStartMs, yt-dlp, ytdlp, yt dlp, descargar video de youtube, descargar de youtube, bajar video, the page needs to be reloaded, SABR, js-runtimes, doblaje automatico, audio original, ffmpeg, certificate verify failed, ca_file, cert.pem, tls_verify, hwaccel, videotoolbox, se cuelga ffmpeg, drawtext, subtitles filter, ass, texto sobre video, png transparente, download-sections, force-keyframes-at-cuts, cortar clip, clips verticales, clips cortos, fabrica de clips, 6 estrellas, mentes-kit, flyers en video, pyinstaller, yt-dlp_macos, tarda en arrancar, brew install yt-dlp compila python, venv, claude -p, credit balance is too low, nice, load alto, captura vacia, mac intel, macos 13, cpu]
preguntas: ["¿por que whisper me devuelve texto en coreano y aleman si el audio esta en español?", "¿como saco los subtitulos palabra por palabra de un video de youtube?", "¿como descargo un video de youtube en esta Mac?", "¿por que yt-dlp se demora un minuto en arrancar?", "¿por que ffmpeg dice certificate verify failed?", "¿como corto un clip exacto de un video de youtube?", "¿por que ffmpeg se queda colgado con videotoolbox?", "¿como pongo texto sobre un video si ffmpeg no tiene drawtext?", "¿puedo llamar a claude desde un script?", "¿por que la captura de Edge salio vacia de noche?"]
proyectos: [prommter]
confianza: media
actualizado: 2026-11-18
---

# Tubería de video local en la Mac Intel (whisper, yt-dlp, ffmpeg, cortes y subtítulos)

## Respuesta corta

- **whisper-cli siempre con `-ng`** (solo CPU) en esta Mac: sin él escupe basura multilingüe sobre audio claro. Cuenta ~45 s por cada 8 s de voz.
- **Video de YouTube: no uses whisper.** Baja los subtítulos automáticos `es-orig` en `json3` (tiempo por palabra, ~1 s).
- **yt-dlp en un venv con el Python 3.14 de Homebrew**, no el binario único ni `brew install`. Para YouTube añade `--js-runtimes node` y fuerza el audio original.
- **ffmpeg con https: `-ca_file /etc/ssl/cert.pem`.** Nunca `-hwaccel videotoolbox` ni `-tls_verify 0`. Texto sobre video = PNG transparente + overlay (no hay drawtext).
- **`claude -p` no sirve desde scripts** (sin crédito): lo que pide criterio lo hace la sesión de Claude Code.

## Por qué (qué lo pagó)

Medido el 2026-11-18 (sesión 03519549, fábrica de clips de 6 Estrellas). Sin `-ng`, whisper devolvió «insbesondere escola daw… 시간ところ…» sobre español claro: 33 min de CPU perdidos. El binario `yt-dlp_macos` tardó 84 s en arrancar (2 s de CPU: macOS lo revisa entero en cada arranque) y `brew install yt-dlp` se puso a compilar Python 3.14 (macOS 13). El pip del Python 3.9 del sistema solo da yt-dlp 2025.10.14, que YouTube rechaza («The page needs to be reloaded», SABR). El ffmpeg de /usr/local no halla las CA del sistema. `-hwaccel videotoolbox` se colgó 5 min a 0 % CPU. Con subtítulos json3 el desfase de lo renderizado fue ≤ 0,04 s.

## Cómo se aplica

1. Transcribir audio propio: `whisper-cli -ng -t 4 …` (modelo large-v3-turbo; ver `contenido/estudio/subtitulos.mjs`, usa `-ng --dtw`). Calcula el tiempo antes: 45 s por 8 s de voz.
2. Subtítulos de un video de YouTube: `yt-dlp --skip-download --write-auto-subs --sub-langs "es-orig" --sub-format json3`; el tiempo de cada palabra = `tStartMs + tOffsetMs`.
3. Instalar yt-dlp: `python3.14 -m venv ~/.local/share/yt-dlp-venv && pip install "yt-dlp[default]"`, enlace en `~/.local/bin`. Arranque 1,6 s.
4. Descargar de YouTube: `--js-runtimes node` y formato `ba[language=es-US][format_note*=original]` si YouTube puso doblaje automático.
5. ffmpeg con URL https: `-ca_file /etc/ssl/cert.pem`. Con `yt-dlp --download-sections`: `--downloader-args "ffmpeg_i:-ca_file /etc/ssl/cert.pem"` o el envoltorio `prommter/contenido/6-estrellas/fabrica/ytbin/ffmpeg`.
6. Corte exacto: `--download-sections "*A-B" --force-keyframes-at-cuts` (desfase −0,04 s) pero recodifica: ~2,5 min por 30 s de 1080p. Presupuéstalo.
7. Texto/subtítulos sobre video: PNG transparente renderizado con Edge por CDP + `overlay`. Comprueba el alfa del PNG y repite si sale vacío (`render-clip.mjs` ya lo hace).
8. De noche corre el armado del canal (whisper + Chrome, load 65–85): lanza todo lo pesado con `nice`.

## Cuándo NO aplica

- Otra máquina (el PC Windows) o una Mac con Apple Silicon: Metal allí puede ir bien; mide antes de copiar `-ng`.
- Si el video no es de YouTube (voz propia, otra plataforma) los subtítulos json3 no existen: whisper sigue siendo la vía.
- Si ya hay crédito en la API, `claude -p` puede volver a funcionar: pruébalo con una llamada corta antes de dar por muerta la vía.
- Versiones: todo medido con whisper-cli 1.9.5, yt-dlp reciente y macOS 13; si cambian, reverifica.

## Evidencia

- `prommter/contenido/estudio/subtitulos.mjs:7` y `:44` (whisper.cpp compilado a mano; `-ng` porque Metal va más lento que la CPU en esta Mac Intel).
- `prommter/contenido/6-estrellas/fabrica/README.md` sección «Uso»; `fabrica/ytbin/ffmpeg` (envoltorio con CA); `fabrica/render-clip.mjs` (comprobación de alfa).
- Mediciones del 2026-11-18, sesión 03519549 (tiempos citados arriba), reportadas por el orquestador; no hay objeto de memoria con ID todavía.

## Enlaces

[[entorno-de-la-maquina]] (whisper-cpp, load, hilos), [[motion-graphics-narrado-en-hyperframes]] (subtítulos por oración), [[montar-video-con-material-real-del-celular]] (ffmpeg sin filtros), [[modelos-y-costos]]
