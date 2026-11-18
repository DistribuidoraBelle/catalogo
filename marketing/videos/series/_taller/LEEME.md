# Taller de series (respaldo del scratchpad, 2026-11-18)
Todo lo necesario para seguir los videos si se pierde la sesión:
- `fotos/`: botellas (b*/f*/h*.png), logos. En el render se usa como `fotos/` (symlink) + `fotos/obj` → `../../../notas-recortes`.
- `cdnF1..4/`: Club de Nuit estilo F, partes 1-4 (scene genérica + cfg.js por parte, data.js, timing estimado).
- `guiones.py`: textos de voz (frase emocional → nombre → notas → frase → inspirado) y config visual de las 4 partes. `texto(n)` = texto a mandar a ElevenLabs (voz Dante DzZyY3xqjLUXGaT9wykC, eleven_v4, 1 take).
- `build_part.py n real`: con `cdnF<n>/mix/voz.wav` alinea (cdn/align.py) y regenera timing.js. Luego música (musica_cdn*.py DUR OUT V), mezcla (voz -17 LUFS + música ~-28.6 dB, sidechain, alimiter level=disabled) y `rendfull.sh DIR AUDIO DUR OUT`.
- `hawas/`: 5 opciones de estilo Hawas (base + scene_o1..5.js). Ger está pensando cambios.
- PENDIENTE: voces de CDN 1-4 (ElevenLabs caído el 18/11) → render final de las 4 partes.
