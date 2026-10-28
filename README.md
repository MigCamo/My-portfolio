# Miguel Camo · Portafolio

Portafolio personal en español centrado en ingeniería de software, desarrollo full stack, arquitectura y calidad. HTML, CSS y JavaScript nativos; no requiere instalación ni compilación.

La identidad visual se inspira en un entorno de trabajo GNU/Linux: explorador lateral, pestañas de archivos, monograma ASCII, paleta woodland, tipografía monoespaciada y barra de estado. Los proyectos se presentan como un directorio documentado, con capturas y decisiones técnicas.

## Shell del portafolio

La terminal navega por el contenido del sitio. Soporta `help`, `whoami`, `ls`, `pwd`, `cd proyectos`, `cd experiencia`, `cd stack`, `cd contacto`, `cat stack.conf`, `cat sobre_mí.md`, `cv`, `theme` y `clear`.

- `/` enfoca el campo desde fuera de un control editable; `Escape` libera el foco.
- `Tab` completa una coincidencia única y vuelve a su navegación habitual cuando el texto ya coincide.
- `↑` y `↓` recorren el historial local de la sesión.
- Las acciones se resuelven contra una lista cerrada de comandos y destinos. No hay ejecución de shell, `eval`, peticiones de red ni HTML generado a partir del texto introducido.
- La salida conserva como máximo 12 entradas y el historial 30 comandos. No se persisten los comandos.
- Los enlaces y la navegación convencional siguen disponibles. Sin JavaScript se ocultan los controles interactivos y se muestran las secciones completas.

## Vista local

Desde la raíz del repositorio:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173`. El archivo de entrada es `index.html`, con minúscula, para que funcione en servidores sensibles a mayúsculas y en GitHub Pages.

## Organización

- `index.html`: contenido semántico, experiencia, proyectos y fuentes públicas.
- `css/main.css`: tokens de diseño y estilos compartidos.
- `css/index.css`: composición y puntos de adaptación de las secciones.
- `theme.js`: selección temprana del tema, con almacenamiento opcional.
- `main.js`: intérprete del portafolio, menú, filtros, seguimiento de navegación y copia del correo.
- `assets/images/`: imágenes WebP utilizadas por el sitio. Los originales se conservan en `assets/`.
- `assets/documents/miguel-camo-cv.pdf`: CV actualizado descargable.
- `scripts/build_cv.py`: fuente del CV; requiere Python y `reportlab`. Ejecutar `python scripts/build_cv.py` para regenerarlo. No es necesario para servir la web.

## Decisiones y trade-offs

| Decisión                              | Beneficio                                                                       | Coste o límite                                             |
| ------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Mantener HTML/CSS/JS nativos (KISS)   | Contenido renderizado sin hidratar una aplicación; despliegue estático sencillo | Las secciones se editan en HTML; no hay CMS                |
| Tokens compartidos en CSS (DRY)       | Colores y temas consistentes desde una sola definición                          | La disciplina de componentes depende de las clases CSS     |
| Responsabilidades separadas           | Contenido, presentación e interacción evolucionan de forma independiente        | Conviene componentizar si aparecen rutas y estado complejo |
| Elementos `details` para arquitectura | Accesibles con teclado y funcionales sin JavaScript                             | Interacción deliberadamente sencilla                       |
| Recursos propios y CSP restrictiva    | Sin scripts, fuentes ni solicitudes a CDN de terceros                           | Las integraciones futuras requieren revisar la política    |
| Contacto mediante correo              | Acción real sin guardar datos de visitantes ni mantener backend                 | Requiere un cliente de correo; se ofrece copia del email   |

Este rediseño conserva la tecnología del repositorio. Angular 20 con componentes standalone, Signals y `@defer` sería una alternativa si el portafolio evoluciona a una aplicación con rutas, datos remotos y estado compartido. Para el alcance actual añadiría herramientas y runtime sin una necesidad funcional equivalente. Referencia: [carga diferida en Angular](https://angular.dev/guide/templates/defer). Principios de separación de responsabilidades: Robert C. Martin, _Clean Architecture_.

## Rendimiento y seguridad

- Se retiraron GSAP, Swiper, Odometer, highlight.js y las dependencias de iconos de CDN.
- Las seis imágenes utilizadas pasan de aproximadamente 3.17 MB en sus originales a 0.29 MB en WebP, una reducción cercana al 91%. Se especifican dimensiones y se usa carga diferida en las capturas y el retrato de la sección de perfil. La portada se compone con texto y CSS.
- Tipografía del sistema, iconos SVG locales y un observador de intersección en lugar de listeners de scroll.
- No se insertan cadenas mediante `innerHTML`, no hay secretos ni formularios simulados. Los enlaces externos usan `noopener noreferrer`.
- Se respetan preferencias de movimiento reducido y se incluyen foco visible, salto al contenido, estados de los controles y mensajes accesibles.
- La política CSP se entrega en HTML. En producción, el hosting puede reforzarla con cabeceras HTTP, incluyendo `frame-ancestors`, que no se admite en una política meta.
- La reducción de recursos favorece la carga inicial; no se atribuyen puntuaciones de Lighthouse ni valores de Core Web Vitals sin medir el despliegue real.

## Procedencia del contenido

La experiencia y la formación proceden del CV facilitado por Miguel. La descripción de ARIES incorpora su instrucción directa sobre desarrollo frontend, estimación de mejoras, migración y nueva arquitectura. No se asume liderazgo de equipo ni se inventan métricas de impacto.

Información pública consultada el 28 de octubre de 2026:

- [Perfil de GitHub](https://github.com/MigCamo): perfil profesional, ubicación y repositorios.
- [TeamsHub API Gateway](https://github.com/MigCamo/TeamsHubAPIGateway): C#, ASP.NET y Ocelot.
- [TeamsHub Web Client](https://github.com/MigCamo/TeamsHubWebClient): cliente web de gestión académica.
- [Monopoly Client](https://github.com/MigCamo/MonopolyClient) y [Monopoly Server](https://github.com/MigCamo/MonopolyServer): WPF, WCF y separación cliente-servidor.
- [Notas laudatorias UV, agosto 2024–enero 2025](https://www.uv.mx/fei/files/2025/04/Lista-ISOF.pdf): 9.71 en ese periodo.
- [Notas laudatorias UV, febrero–julio 2024](https://www.uv.mx/fei/files/2024/09/Lista-ISOF-v2-2.pdf): 9.38 en ese periodo.

Los promedios por periodo se distinguen del promedio global de carrera (9.0, según el CV). Los otros proyectos y sus capturas ya estaban en el portafolio original. LinkedIn se conserva como enlace de contacto; no se añadió información no verificada desde ese perfil. El PDF original de Downloads se conserva intacto.

## Verificación

Comprobaciones de sintaxis con `node --check main.js` y `node --check theme.js`; integridad de rutas y anclas locales; revisión de escritorio y de anchos móviles/tablet; pruebas manuales de filtros, tema, menú y detalles. Se verifican ayuda, perfil, navegación, historial, autocompletado, limpieza del shell y representación literal de texto con etiquetas. El CV existente se conserva.

No se ha configurado un hosting nuevo ni se han enviado cambios al remoto. Para publicar, servir los archivos del repositorio conservando `index.html` y los directorios `css/` y `assets/`.
