# ROADMAP: TinAR WebAR MVP

## Milestone: MVP Funcional

**Objetivo:** Experiencia WebAR completa donde Tina guía al niño en cepillado dental correcto.

**Duración estimada:** 1 sesión (~6 horas de ejecución)

---

## Phase 1: Foundation & Optimization

### Goal
Preparar assets optimizados y estructura base del proyecto.

**Requirements:** [OPT-01, OPT-02, STR-01]

**Plans:** 2 plans

### Plan List
- [x] 01-foundation-01-PLAN.md — Optimizar modelo 3D Tina.glb
- [x] 01-foundation-02-PLAN.md — Crear marcador AR y estructura de archivos

**Key Deliverables:**
- Tina_optimized.glb (< 5MB)
- marker.png + marker.mind
- Estructura de carpetas completa
- package.json configurado

---

## Phase 2: AR Core Implementation

### Goal
Implementar escena AR funcional con MindAR + AFRAME donde Tina aparece sobre el marcador.

**Requirements:** [AR-01, AR-02, AR-03, AR-04]

**Plans:** 2 plans

### Plan List
- [x] 02-ar-core-01-PLAN.md — Implementar index.html con MindAR + AFRAME
- [x] 02-ar-core-02-PLAN.md — Integrar modelo Tina y configurar tracking

**Key Deliverables:**
- index.html funcional
- Tina visible en AR
- Tracking estable del marcador

---

## Phase 3: State Management

### Goal
Sistema de estados que controla el flujo: INTRO → ZONAS → CELEBRATION

**Requirements:** [STATE-01, STATE-02, STATE-03]

**Plans:** 1 plan

### Plan List
- [x] 03-states-01-PLAN.md — Implementar state-manager.js con flujo completo

**Key Deliverables:**
- Máquina de estados funcional
- Eventos por cambio de estado
- Timer de 30s por zona

---

## Phase 4: Audio & Multilanguage

### Goal
Sistema TTS que habla en ES/EN/PT con contenido educativo.

**Requirements:** [AUDIO-01, AUDIO-02, AUDIO-03, AUDIO-04]

**Plans:** 1 plan

### Plan List
- [x] 04-audio-01-PLAN.md — Implementar audio-manager.js con TTS y diccionarios

**Key Deliverables:**
- Web Speech API integrado
- 3 idiomas funcionando
- Detección automática de idioma
- Selector manual

---

## Phase 5: Animation System

### Goal
Animaciones simuladas para Tina (modelo estático).

**Requirements:** [ANIM-01, ANIM-02, ANIM-03]

**Plans:** 1 plan

### Plan List
- [x] 05-animation-01-PLAN.md — Implementar animation-manager.js con todas las animaciones

**Key Deliverables:**
- Animaciones: wave, breathing, pointing, dancing, jumping, celebration
- Sincronización con estados
- Fluidez 60fps

---

## Phase 6: UI & Overlays

### Goal
Interfaz completa con indicadores educativos y feedback visual.

**Requirements:** [UI-01, UI-02, UI-03, UI-04, UI-05] ✅

**Plans:** 2 plans

### Plan List
- [x] 06-ui-01-PLAN.md — Implementar UI base: loading, timer, mensajes ✅
- [x] 06-ui-02-PLAN.md — Crear overlays educativos: flechas, círculos, partículas ✅

**Key Deliverables:**
- Overlay de carga ✅
- Timer visual por zona ✅
- Flechas 45°, círculos movimiento ✅
- Confetti y estrellas celebración ✅
- Selector de idioma ES/EN/PT ✅

---

## Phase 7: Integration & Polish

### Goal
Integrar todos los módulos y optimizar performance.

**Requirements:** [INT-01, INT-02, PERF-01]

**Plans:** 1 plan

### Plan List
- [x] 07-integration-01-PLAN.md — Integrar app.js y optimizar performance ✅

**Key Deliverables:**
- app.js integrando todos los módulos
- Peso total < 10MB
- Performance > 60fps

---

## Phase 8: Deploy & Documentation

### Goal
Deploy en GitHub Pages con QR funcional y documentación completa.

**Requirements:** [DEPLOY-01, DEPLOY-02, DOC-01]

**Plans:** 1 plan

### Plan List
- [x] 08-deploy-01-PLAN.md — Configurar GitHub Pages y crear README ✅

**Key Deliverables:**
- GitHub Pages configurado ✅
- QR generado ✅
- README.md completo ✅
- MVP accesible públicamente ✅

---

## Requirements Index

### Optimization (OPT)
- **OPT-01:** Modelo Tina optimizado a < 5MB con Draco
- **OPT-02:** Marcador AR compilado (.mind)

### Structure (STR)
- **STR-01:** Estructura de carpetas completa

### AR Core (AR)
- **AR-01:** MindAR + AFRAME integrados
- **AR-02:** Escena AR configurada
- **AR-03:** Tina visible en AR
- **AR-04:** Tracking estable

### State Management (STATE)
- **STATE-01:** ✅ Máquina de estados (7 estados)
- **STATE-02:** ✅ Timer 30s por zona
- **STATE-03:** ✅ Eventos de transición

### Audio (AUDIO)
- **AUDIO-01:** ✅ Web Speech API TTS
- **AUDIO-02:** ✅ 3 idiomas (ES/EN/PT)
- **AUDIO-03:** ✅ Detección automática idioma
- **AUDIO-04:** ✅ Contenido educativo técnico

### Animation (ANIM)
- **ANIM-01:** ✅ Animaciones simuladas (wave, breathing, etc.)
- **ANIM-02:** ✅ Sincronización con estados
- **ANIM-03:** ✅ 60fps fluidos

### UI (UI)
- **UI-01:** ✅ Overlay carga
- **UI-02:** ✅ Timer visual
- **UI-03:** ✅ Mensajes de texto
- **UI-04:** ✅ Overlays educativos (flechas, círculos)
- **UI-05:** ✅ Partículas celebración

### Integration (INT)
- **INT-01:** ✅ app.js integrador
- **INT-02:** ✅ Todos los módulos conectados

### Performance (PERF)
- **PERF-01:** ✅ Peso total < 10MB (3.5MB), carga < 5s

### Deploy (DEPLOY)
- **DEPLOY-01:** ✅ GitHub Pages configurado
- **DEPLOY-02:** ✅ QR generado y funcional

### Documentation (DOC)
- **DOC-01:** ✅ README.md completo
