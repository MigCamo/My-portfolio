"""Genera el CV que se descarga desde el portafolio (requiere reportlab)."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/documents/miguel-camo-cv.pdf"
# Arial está disponible en Windows; Helvetica mantiene el generador portable.
FONT_DIR = Path("C:/Windows/Fonts")
if (FONT_DIR / "arial.ttf").exists():
    pdfmetrics.registerFont(TTFont("CV", str(FONT_DIR / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("CV-Bold", str(FONT_DIR / "arialbd.ttf")))
    pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
    FONT = "CV"
else:
    FONT = "Helvetica"

INK = colors.HexColor("#20202b")
MUTED = colors.HexColor("#51515e")

def style(name, size, leading, **options):
    return ParagraphStyle(name, fontName=FONT, fontSize=size, leading=leading,
                          textColor=INK, alignment=TA_LEFT, **options)

BODY = style("body", 9, 12.5, spaceAfter=5)
BULLET = style("bullet", 8.8, 12, leftIndent=10, firstLineIndent=-8, spaceAfter=3)
SECTION = style("section", 9, 13, spaceBefore=12, spaceAfter=7,
                textTransform="uppercase", keepWithNext=True)
ROLE = style("role", 10, 13, spaceBefore=6, spaceAfter=2, keepWithNext=True)
META = style("meta", 8, 11, spaceAfter=6)
META.textColor = MUTED

flow = []
def paragraph(text, paragraph_style=BODY):
    flow.append(Paragraph(text, paragraph_style))

def section(title):
    paragraph(f'<font color="#5f46ad"><b>{title}</b></font>', SECTION)

def role(title, period):
    paragraph(f"<b>{title}</b>", ROLE)
    paragraph(f'<font color="#51515e">Universidad Veracruzana | {period}</font>', META)

def bullet(text):
    paragraph(f"&#8226; {text}", BULLET)

paragraph("<b>Miguel Ángel Camo Rincón</b>", style("name", 24, 29, spaceAfter=7))
paragraph('<font color="#5f46ad"><b>INGENIERO EN SOFTWARE | FULL STACK DEVELOPER</b></font>', style("headline", 10, 14, spaceAfter=8))
paragraph('Xalapa, Veracruz, México | <link href="mailto:miguel_camo@outlook.com">miguel_camo@outlook.com</link> | +52 273 101 0078', META)
paragraph('<link href="https://github.com/MigCamo">github.com/MigCamo</link> | <link href="https://www.linkedin.com/in/miguel-%C3%A1ngel-camo-rinc%C3%B3n-722b492a1/">LinkedIn: Miguel Camo</link>', META)

section("Perfil profesional")
paragraph("Ingeniero en software con experiencia en desarrollo frontend y backend de aplicaciones web y de escritorio, integración de APIs y Web Services, bases de datos y control de acceso. Enfoque en arquitectura de software, migración de frontend, mantenibilidad y calidad mediante buenas prácticas, patrones de diseño y pruebas automatizadas.")

section("Experiencia")
role("Desarrollador Frontend y QA - Equipo ARIES", "Febrero 2026 - Actualidad")
bullet("Desarrollo e implementación de funcionalidades frontend para el sistema ARIES.")
bullet("Análisis y estimación de puntos de mejora para planificar la evolución técnica del proyecto.")
bullet("Participación en la migración del frontend y en la definición de una nueva arquitectura, aplicando buenas prácticas y patrones de diseño y de arquitectura de software.")
bullet("Desarrollo de pruebas automatizadas con Cypress, identificación y documentación de errores, seguimiento de correcciones y colaboración con el equipo para mejorar la experiencia de usuario.")

role("Junior Developer - Sistema de Exámenes por Competencias", "Agosto 2025 - Diciembre 2025")
bullet("Desarrollo de funcionalidades backend para la gestión y reserva de exámenes; implementación de servicios y controladores en C# y .NET con buenas prácticas de arquitectura.")
bullet("Diseño y optimización de consultas y modelos de datos en MySQL para mejorar el rendimiento y la integridad.")
bullet("Colaboración en la integración con frontend y en la definición de requisitos técnicos.")

role("Junior Backend Developer - Gestión de Proyectos Académicos", "Febrero 2024 - Junio 2024")
bullet("Implementación y optimización de la lógica backend, autenticación y control de acceso con .NET Framework y SQL Server.")
bullet("Optimización de consultas para el almacenamiento y la recuperación de datos.")

section("Competencias técnicas")
paragraph("<b>Frontend:</b> Angular, React, Vue.js, JavaScript, TypeScript, HTML y CSS.<br/><b>Backend:</b> C#, .NET, Java, Spring Boot, PHP, Laravel y Node.js.<br/><b>Datos:</b> MySQL, SQL Server y PostgreSQL.<br/><b>Herramientas y proceso:</b> Git, Docker, Podman, Postman, Cypress, UML, Scrum e ICONIX.")

section("Educación y reconocimiento")
paragraph("<b>Ingeniería en Software - Universidad Veracruzana</b><br/>Agosto 2021 - Enero 2026 | Promedio global: 9.0/10.")
paragraph('Notas laudatorias UV: 9.71 (agosto 2024 - enero 2025) y 9.38 (febrero - julio 2024). <link href="https://www.uv.mx/fei/files/2025/04/Lista-ISOF.pdf" color="#5f46ad">Consultar fuente institucional</link>.', META)
paragraph("<b>Bachilleres Francisco J. Mugica</b> | Agosto 2018 - Junio 2021 | Certificado en informática.", META)

section("Proyectos seleccionados")
paragraph('<b>TeamsHub:</b> gestión de proyectos académicos con clientes web y de escritorio. API Gateway con C#, ASP.NET y Ocelot. <link href="https://github.com/MigCamo/TeamsHubAPIGateway" color="#5f46ad">Ver código</link>.', BODY)
paragraph('<b>Monopoly: Magical Worlds:</b> juego multijugador de escritorio con WPF y comunicación WCF; lógica de partidas y persistencia en el servidor. <link href="https://github.com/MigCamo/MonopolyClient" color="#5f46ad">Ver código</link>.', BODY)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=38, rightMargin=38,
                        topMargin=32, bottomMargin=30,
                        title="Miguel Camo - Ingeniero en Software",
                        author="Miguel Ángel Camo Rincón")
doc.build(flow)
print(OUTPUT)
