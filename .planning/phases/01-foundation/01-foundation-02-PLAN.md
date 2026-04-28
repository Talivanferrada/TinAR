---
phase: 01-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified: [assets/images/marker.png, assets/targets/marker.mind, .gitignore]
autonomous: false
requirements: [OPT-02, STR-01]
user_setup: []
---

<objective>
Crear la estructura completa del proyecto y generar el marcador AR para tracking de MindAR.

Purpose: El proyecto necesita una estructura organizada y un marcador AR que los niños escanearán con sus dispositivos.

Output: Estructura de carpetas + marker.png + marker.mind.
</objective>

<execution_context>
@/home/vm-labs/.config/opencode/get-shit-done/workflows/execute-plan.md
@/home/vm-labs/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-foundation-01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Crear estructura de carpetas del proyecto</name>
  <files>assets/, src/, css/</files>
  <action>
Crear la estructura de carpetas completa para el proyecto:

```bash
mkdir -p assets/images/overlays
mkdir -p assets/targets
mkdir -p src
mkdir -p css
```

Estructura final debe ser:
```
TinAR/
├── assets/
│   ├── images/
│   │   └── overlays/
│   ├── models/
│   └── targets/
├── src/
├── css/
├── Logo/
├── Modelo3D/
└── index.html (se creará en fase 2)
```

No crear archivos todavía - solo estructura de carpetas.
  </action>
  <verify>
    <automated>ls -d assets assets/images assets/images/overlays assets/targets src css 2>/dev/null | wc -l | xargs -I{} sh -c 'if [ "{}" = "7" ]; then echo "OK"; else echo "MISSING"; fi'</automated>
  </verify>
  <done>7 carpetas creadas: assets, images, overlays, targets, src, css</done>
</task>

<task type="auto">
  <name>Task 2: Preparar imagen del marcador desde logo</name>
  <files>assets/images/marker.png</files>
  <action>
Crear imagen de marcador AR basada en el logo de Doctora Dentina:

1. Verificar que ImageMagick está disponible (comúnmente pre-instalado):
```bash
which convert || echo "ImageMagick not found"
```

2. Si ImageMagick está disponible, crear marcador con bordes para mejor tracking:
```bash
convert Logo/logo-dentina.jpeg -resize 1000x1000 -background white -gravity center -extent 1200x1200 -bordercolor black -border 50 assets/images/marker.png
```

3. Si ImageMagick NO está disponible, usar Python PIL o copiar directamente:
```bash
cp Logo/logo-dentina.jpeg assets/images/marker.png
```

El marcador necesita:
- Alto contraste (bordes negros/blancos)
- Dimensiones mínimo 1000x1000px
- Características visuales distintivas para tracking

No usar Photoshop o herramientas propietarias - solo open source.
  </action>
  <verify>
    <automated>ls -la assets/images/marker.png && file assets/images/marker.png | grep -q "image" && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>marker.png creado en assets/images/ con dimensiones adecuadas</done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <what-built>Imagen del marcador preparada en assets/images/marker.png</what-built>
  <how-to-verify>
El marcador necesita ser compilado a formato .mind para MindAR. Esto requiere usar una herramienta web:

1. Abre en tu navegador: https://hiukim.github.io/mind-ar-js-doc/tools/compile

2. Sube la imagen: assets/images/marker.png

3. Descarga el archivo .mind generado

4. Guárdalo como: assets/targets/marker.mind

5. Verifica que el archivo existe con:
```bash
ls -la assets/targets/marker.mind
```
  </how-to-verify>
  <resume-signal>Escribe "marker.mind creado" o describe si hubo algún problema</resume-signal>
</task>

<task type="auto">
  <name>Task 4: Crear archivo .gitignore</name>
  <files>.gitignore</files>
  <action>
Crear .gitignore para excluir archivos innecesarios:

```
# Dependencies
node_modules/

# Build outputs
dist/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

# Environment
.env
.env.local

# Original unoptimized model (keep as backup)
# Modelo3D/Tina.glb

# Temporary files
*.tmp
*.temp
```

Esto mantiene el repo limpio y evita subir el modelo original de 87MB a GitHub.
  </action>
  <verify>
    <automated>cat .gitignore | grep -q "node_modules" && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>.gitignore creado con exclusiones estándar</done>
</task>

</tasks>

<verification>
- [ ] Estructura de carpetas completa
- [ ] marker.png creado
- [ ] marker.mind compilado (checkpoint)
- [ ] .gitignore creado
</verification>

<success_criteria>
Estructura del proyecto lista para desarrollo. Marcador AR compilado y listo para tracking con MindAR.
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-02-SUMMARY.md`
</output>
