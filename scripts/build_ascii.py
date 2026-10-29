"""Convierte el retrato propio a texto ASCII y actualiza su bloque en HTML.

Requiere Pillow únicamente para regenerar el recurso; la web sirve texto estático.
"""
from pathlib import Path
import html
import re
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
WIDTH = 58
CHARACTER_ASPECT = 0.56
RAMP = " .,:;irsXA253hMHGS#9B&@"

source = Image.open(ROOT / "assets/me.png").convert("RGBA")
# Encuadre de cabeza y hombros: el detalle de la cara tiene más peso que la camisa.
source = source.crop((0, 0, source.width, min(320, source.height)))
height = round(source.height / source.width * WIDTH * CHARACTER_ASPECT)
small = source.resize((WIDTH, height), Image.Resampling.LANCZOS)
luminance = ImageEnhance.Contrast(small.convert("L")).enhance(1.3)
luminance = luminance.filter(ImageFilter.UnsharpMask(radius=1, percent=130, threshold=2))
alpha = small.getchannel("A")
rows = []
for y in range(height):
    row = []
    for x in range(WIDTH):
        if alpha.getpixel((x, y)) < 145:
            row.append(" ")
        else:
            darkness = (255 - luminance.getpixel((x, y))) / 255
            row.append(RAMP[round(darkness * (len(RAMP) - 1))])
    rows.append("".join(row).rstrip())
portrait = "\n".join(rows).strip("\n")
(ROOT / "assets/portrait-ascii.txt").write_text(portrait + "\n", encoding="utf-8")
page = ROOT / "index.html"
source_html = page.read_text(encoding="utf-8")
source_html, count = re.subn(
    r'(<pre\b[^>]*id="ascii-portrait"[^>]*>).*?(</pre\s*>)',
    lambda match: match[1] + html.escape(portrait) + match[2],
    source_html, flags=re.S,
)
if count != 1:
    raise RuntimeError("El bloque ascii-portrait debe aparecer una sola vez en index.html.")
page.write_text(source_html, encoding="utf-8")
print(f"Retrato ASCII: {WIDTH} columnas, {height} filas.")
