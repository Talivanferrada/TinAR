---
phase: 02-ar-core
plan: 01
type: execute
wave: 1
depends_on: [01-foundation]
files_modified: [index.html, src/app.js]
autonomous: true
requirements: [AR-01, AR-02]
user_setup: []
---

<objective>
Implementar la escena AR base con MindAR y AFRAME, configurando el tracking de imagen y la estructura HTML principal.

Purpose: Establecer la fundación técnica AR que permite mostrar contenido sobre el marcador escaneado.

Output: index.html funcional con MindAR + AFRAME configurado y escena AR lista.
</objective>

<execution_context>
@/home/vm-labs/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-foundation-01-SUMMARY.md
@.planning/phases/01-foundation/01-foundation-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Crear index.html con estructura base</name>
  <files>index.html</files>
  <action>
Crear el archivo index.html principal con la estructura para MindAR + AFRAME:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Tina AR - Doctora Dentina</title>
  
  <!-- AFRAME -->
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <!-- MindAR -->
  <script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>
  
  <style>
    body { margin: 0; overflow: hidden; }
    #loading-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: #4FC3F7;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: 'Segoe UI', sans-serif;
    }
    #loading-text {
      color: white;
      font-size: 24px;
      margin-top: 20px;
    }
    .spinner {
      width: 60px; height: 60px;
      border: 6px solid #fff;
      border-top: 6px solid #FFB74D;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <!-- Loading Overlay -->
  <div id="loading-overlay">
    <div class="spinner"></div>
    <div id="loading-text">Cargando Tina...</div>
  </div>
  
  <!-- UI Overlay (placeholder) -->
  <div id="ui-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;"></div>
  
  <!-- AR Scene -->
  <a-scene
    mindar-image="imageTargetSrc: assets/targets/marker.mind; autoStart: true; showStats: false;"
    color-space="sRGB"
    renderer="colorManagement: true, physicallyCorrectLights"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    embedded
  >
    <a-assets>
      <a-asset-item id="tina-model" src="assets/models/Tina_optimized.glb"></a-asset-item>
    </a-assets>
    
    <!-- Camera -->
    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
    
    <!-- Target -->
    <a-entity mindar-image-target="targetIndex: 0" id="target">
      <!-- Tina will be added here -->
      <a-entity id="tina-container"></a-entity>
    </a-entity>
  </a-scene>
  
  <script src="src/app.js" type="module"></script>
</body>
</html>
```

Esto crea:
- Meta tags para mobile-first
- Scripts MindAR + AFRAME via CDN
- Loading overlay con spinner
- Escena AR configurada
- Target para el marcador
  </action>
  <verify>
    <automated>ls -la index.html && grep -q "mindar-image" index.html && grep -q "a-scene" index.html && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>index.html creado con MindAR + AFRAME configurado</done>
</task>

<task type="auto">
  <name>Task 2: Crear app.js base</name>
  <files>src/app.js</files>
  <action>
Crear el archivo src/app.js con inicialización básica:

```javascript
// TinAR - Main Application
// WebAR Educativo para Salud Dental Infantil

class TinARApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.tinaModel = null;
    this.isLoaded = false;
    this.isTracking = false;
    
    this.init();
  }
  
  async init() {
    console.log('🦕 TinAR initializing...');
    
    // Wait for AFRAME to load
    if (document.readyState === 'complete') {
      this.onSceneReady();
    } else {
      window.addEventListener('load', () => this.onSceneReady());
    }
  }
  
  onSceneReady() {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
      this.setupScene();
    } else {
      scene.addEventListener('loaded', () => this.setupScene());
    }
    
    // Handle AR events
    scene.addEventListener('arReady', () => {
      console.log('AR Ready');
      this.hideLoading();
    });
    
    // Handle target found
    const target = document.getElementById('target');
    target.addEventListener('targetFound', () => {
      console.log('🎯 Target found!');
      this.isTracking = true;
      this.onTargetFound();
    });
    
    target.addEventListener('targetLost', () => {
      console.log('Target lost');
      this.isTracking = false;
    });
  }
  
  setupScene() {
    console.log('Setting up scene...');
    this.scene = document.querySelector('a-scene');
  }
  
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }
    this.isLoaded = true;
  }
  
  onTargetFound() {
    // Will be expanded in next tasks
    console.log('Target detected - ready for content');
  }
}

// Initialize app
const app = new TinARApp();
export default app;
```

El módulo exporta la app y maneja eventos de AR.
  </action>
  <verify>
    <automated>ls -la src/app.js && grep -q "TinARApp" src/app.js && grep -q "mindar" src/app.js || grep -q "targetFound" src/app.js && echo "OK" || echo "MISSING"</automated>
  </verify>
  <done>src/app.js creado con inicialización AR</done>
</task>

</tasks>

<verification>
- [ ] index.html existe y contiene a-scene + mindar-image
- [ ] src/app.js existe y exporta TinARApp
- [ ] Scripts MindAR + AFRAME cargan via CDN
</verification>

<success_criteria>
Página HTML base configurada con MindAR + AFRAME, lista para integrar modelo Tina.
</success_criteria>

<output>
After completion, create `.planning/phases/02-ar-core/02-ar-core-01-SUMMARY.md`
</output>
