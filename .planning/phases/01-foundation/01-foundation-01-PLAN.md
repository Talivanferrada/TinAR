---
phase: 01-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [Modelo3D/Tina.glb, assets/models/Tina_optimized.glb, package.json]
autonomous: true
requirements: [OPT-01]
user_setup: []

must_haves:
  truths:
    - "Modelo Tina optimizado pesa menos de 5MB"
    - "Modelo mantiene calidad visual aceptable"
    - "Modelo es compatible con AFRAME/GLTFLoader"
  artifacts:
    - path: "assets/models/Tina_optimized.glb"
      provides: "Modelo 3D optimizado para WebAR"
      max_size_mb: 5
    - path: "package.json"
      provides: "Dependencias de optimización"
  key_links:
    - from: "Modelo3D/Tina.glb"
      to: "assets/models/Tina_optimized.glb"
      via: "gltf-transform draco"
      pattern: "gltf-transform"
---

<objective>
Optimizar el modelo 3D Tina.glb de 87MB a menos de 5MB manteniendo calidad visual aceptable para la experiencia AR.

Purpose: El modelo actual es demasiado pesado para carga móvil. WebAR requiere assets ligeros para evitar tiempos de carga excesivos.

Output: Tina_optimized.glb (<5MB) listo para usar en AFRAME.
</objective>

<execution_context>
@/home/vm-labs/.config/opencode/get-shit-done/workflows/execute-plan.md
@/home/vm-labs/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Instalar herramientas de optimización GLTF</name>
  <files>package.json</files>
  <action>
Instalar gltf-transform y dependencias de optimización:

1. Crear package.json inicial:
```json
{
  "name": "tinar-webar",
  "version": "0.1.0",
  "description": "TinAR WebAR Dental Educativo",
  "scripts": {
    "optimize": "gltf-transform draco Modelo3D/Tina.glb assets/models/Tina_optimized.glb"
  },
  "devDependencies": {
    "@gltf-transform/cli": "^4.0.0"
  }
}
```

2. Ejecutar npm install para instalar gltf-transform CLI

No usar otras herramientas de optimización - gltf-transform es open source y funciona con Node.js.
  </action>
  <verify>
    <automated>npm list @gltf-transform/cli 2>/dev/null | grep -q "@gltf-transform/cli" && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>gltf-transform CLI instalado y disponible en node_modules</done>
</task>

<task type="auto">
  <name>Task 2: Optimizar modelo Tina.glb con compresión Draco</name>
  <files>assets/models/Tina_optimized.glb</files>
  <action>
Optimizar el modelo usando gltf-transform con múltiples técnicas:

1. Crear directorio de assets si no existe:
```bash
mkdir -p assets/models
```

2. Ejecutar optimización completa:
```bash
npx gltf-transform draco Modelo3D/Tina.glb assets/models/Tina_temp.glb

npx gltf-transform resize assets/models/Tina_temp.glb assets/models/Tina_optimized.glb --textures 1024x1024

rm assets/models/Tina_temp.glb
```

Si el peso aún supera 5MB, aplicar simplificación de geometría:
```bash
npx gltf-transform simplify Modelo3D/Tina.glb assets/models/Tina_optimized.glb --ratio 0.5 --error 0.01
```

La prioridad es Draco primero (reduce ~70-80%), luego resize texturas (reduce adicional ~50%).
  </action>
  <verify>
    <automated>ls -la assets/models/Tina_optimized.glb && du -b assets/models/Tina_optimized.glb | awk '{if($1<5242880) print "OK: <5MB"; else print "FAIL: >5MB"}'</automated>
  </verify>
  <done>Archivo Tina_optimized.glb existe y pesa menos de 5MB</done>
</task>

<task type="auto">
  <name>Task 3: Verificar integridad del modelo optimizado</name>
  <files>assets/models/Tina_optimized.glb</files>
  <action>
Validar que el modelo optimizado es un GLB válido y contiene geometría:

1. Verificar formato de archivo:
```bash
file assets/models/Tina_optimized.glb
```

Debe mostrar: "glTF binary model, version 2"

2. Verificar que contiene mallas (usando gltf-transform inspect):
```bash
npx gltf-transform inspect assets/models/Tina_optimized.glb
```

Debe mostrar información de meshes, materials y textures sin errores.

No abrir en software de modelado 3D - solo verificación técnica vía CLI.
  </action>
  <verify>
    <automated>file assets/models/Tina_optimized.glb | grep -q "glTF binary" && npx gltf-transform inspect assets/models/Tina_optimized.glb 2>&1 | grep -i "mesh" | head -1</automated>
  </verify>
  <done>Modelo es GLB válido y contiene geometría/materiales</done>
</task>

</tasks>

<verification>
- [ ] gltf-transform instalado
- [ ] Tina_optimized.glb existe
- [ ] Tina_optimized.glb < 5MB
- [ ] Archivo es GLB válido
- [ ] Contiene meshes y materiales
</verification>

<success_criteria>
Modelo Tina_optimized.glb generado, pesando menos de 5MB, manteniendo integridad GLB y compatible con AFRAME.
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-01-SUMMARY.md`
</output>
