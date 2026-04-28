---
phase: 02-ar-core
plan: 02
type: execute
wave: 2
depends_on: [02-ar-core-01]
files_modified: [src/app.js]
autonomous: true
requirements: [AR-03, AR-04]
user_setup: []
---

<objective>
Integrar el modelo 3D de Tina en la escena AR, configurar posición y escala correctas, y verificar que el tracking funciona correctamente.

Purpose: Tina debe aparecer sobre el marcador cuando el usuario lo escanea.

Output: Tina visible en AR con tracking estable.
</objective>

<execution_context>
@/home/vm-labs/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-ar-core/02-ar-core-01-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Agregar modelo Tina a la escena AR</name>
  <files>src/app.js</files>
  <action>
Actualizar src/app.js para cargar e integrar el modelo Tina:

Agregar método para crear el modelo de Tina:

```javascript
// Add this method to TinARApp class

async loadTinaModel() {
  const container = document.getElementById('tina-container');
  
  // Create entity for Tina
  const tinaEntity = document.createElement('a-entity');
  tinaEntity.setAttribute('id', 'tina');
  tinaEntity.setAttribute('gltf-model', '#tina-model');
  
  // Position and scale (adjust based on model)
  tinaEntity.setAttribute('position', '0 0 0.1');
  tinaEntity.setAttribute('scale', '0.3 0.3 0.3');
  tinaEntity.setAttribute('rotation', '0 0 0');
  
  // Add idle breathing animation (simulated)
  tinaEntity.setAttribute('animation', {
    property: 'scale',
    to: '0.31 0.31 0.31',
    dur: 2000,
    easing: 'easeInOutQuad',
    loop: true,
    dir: 'alternate'
  });
  
  container.appendChild(tinaEntity);
  this.tinaModel = tinaEntity;
  
  console.log('🦕 Tina model loaded!');
  return tinaEntity;
}

// Update onTargetFound method
onTargetFound() {
  if (!this.tinaModel) {
    this.loadTinaModel();
  }
}
```

Asegurar que el método init llame a loadTinaModel cuando el target sea encontrado.
  </action>
  <verify>
    <automated>grep -q "gltf-model" src/app.js && grep -q "loadTinaModel" src/app.js && grep -q "Tina" src/app.js && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>Tina model integrado en escena AR</done>
</task>

<task type="auto">
  <name>Task 2: Crear CSS styles</name>
  <files>css/styles.css</files>
  <action>
Crear archivo css/styles.css con estilos base:

```css
/* TinAR - Base Styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  overflow: hidden;
  background: #000;
}

/* Loading Overlay */
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

#loading-text {
  color: white;
  font-size: 24px;
  margin-top: 20px;
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid #FFB74D;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* UI Overlay */
#ui-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

/* Language Selector */
#language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  pointer-events: auto;
}

.lang-btn {
  padding: 10px 16px;
  border: 2px solid white;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn:hover, .lang-btn.active {
  background: white;
  color: #333;
}

/* Message Display */
#message-display {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 16px;
  max-width: 80%;
  text-align: center;
}

/* Progress Bar */
#progress-container {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 300px;
}

#progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

#progress-fill {
  height: 100%;
  background: #FFB74D;
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* Timer */
#timer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 72px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Zone Indicator */
#zone-indicator {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Hidden utility */
.hidden {
  display: none !important;
}
```

Estos estilos soportarán la UI completa.
  </action>
  <verify>
    <automated>ls -la css/styles.css && grep -q "loading-overlay" css/styles.css && grep -q "ui-overlay" css/styles.css && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>css/styles.css creado con estilos base</done>
</task>

<task type="auto">
  <name>Task 3: Agregar link a CSS en index.html</name>
  <files>index.html</files>
  <action>
Agregar link al CSS en el head de index.html:

Agregar después de los scripts:
```html
<link rel="stylesheet" href="css/styles.css">
```

Esto asegura que los estilos se carguen correctamente.
  </action>
  <verify>
    <automated>grep -q "styles.css" index.html && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>index.html actualizado con link a CSS</done>
</task>

</tasks>

<verification>
- [ ] Tina model carga en la escena AR
- [ ] CSS styles creados
- [ ] index.html linkea CSS
</verification>

<success_criteria>
Tina visible en AR sobre el marcador con tracking funcional.
</success_criteria>

<output>
After completion, create `.planning/phases/02-ar-core/02-ar-core-02-SUMMARY.md`
</output>
