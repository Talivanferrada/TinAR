# STATE: TinAR WebAR MVP

## Current Position

**Phase:** 02-ar-core COMPLETE → Ready for Phase 3
**Status:** Phase 2 Complete - AR Core Implemented
**Last Updated:** 2026-04-28

---

## Decisions

### Locked Decisions (User Confirmed)

| Decisión | Valor | Fuente |
|----------|-------|--------|
| Framework AR | MindAR + AFRAME | User choice |
| Tipo de Tracking | Image Tracking | User choice |
| Modelo 3D | Tina.glb (optimizar de 87MB) | User asset |
| Idiomas | ES, EN, PT | User confirmed |
| Duración por zona | 30 segundos | User confirmed |
| Contenido educativo | Técnica ADA (45°, círculos) | User approved |
| Animaciones Tina | Simuladas en código + overlays 2D | User confirmed |
| Indicadores visuales | Sí, overlays educativos | User confirmed |
| Hosting | GitHub Pages | User confirmed |

### Deferred Ideas

| Idea | Razón |
|------|-------|
| Estadísticas de uso | Post-MVP |
| Múltiples personajes | Post-MVP |
| Gamificación avanzada | Post-MVP |
| Offline-first | Post-MVP |
| Uso de hilo dental | Simplificar para niños 3-8 años |

### Claude's Discretion

| Área | Decisión |
|------|---------|
| Compresión modelo | Usar gltf-transform + Draco |
| Animaciones específicas | wave, breathing, pointing, jumping, celebration |
| Overlays específicos | Flechas 45°, círculos, partículas |
| Estructura archivos | Seguir plan definido |

---

## Current Phase: 01-foundation

### Status: READY

**Blockers:** None

**Todos:**
- [x] Ejecutar Fase 1: Optimización modelo y estructura ✅
- [x] Ejecutar Fase 2: AR Core ✅
- [ ] Ejecutar Fase 3: Estados
- [ ] Ejecutar Fase 4: Audio
- [ ] Ejecutar Fase 5: Animaciones
- [ ] Ejecutar Fase 6: UI
- [ ] Ejecutar Fase 7: Integración
- [ ] Ejecutar Fase 8: Deploy

---

## Assets Status

| Asset | Ubicación | Estado |
|-------|-----------|--------|
| Tina.glb (original) | /Modelo3D/Tina.glb | 87MB - Original |
| Tina_optimized.glb | assets/models/Tina_optimized.glb | 2.1MB - Optimizado ✅ |
| Marcador AR (mind) | assets/targets/marker.mind | 256KB - Compilado ✅ |
| Marcador AR (png) | assets/images/marker.png | Listo ✅ |
| Logo Dentina | /Logo/logo-dentina.jpeg | 74KB - OK |
| Overlays SVG | Pendiente crear | Fase 6 |

---

## Context Summary

### Problema
Los niños de 3-8 años no cepillan correctamente sus dientes, lo que lleva a problemas dentales. La ansiedad dental es común en esta edad.

### Solución
WebAR educativo donde Tina la dinosauria guía al niño en una sesión de cepillado con:
- Técnica correcta (ADA guidelines)
- Feedback positivo constante
- Sin instalación necesaria

### Usuario Objetivo
Niños de 3-8 años que visitan al odontopediatra y continúan el cuidado en casa.

### Métrica de Éxito
Niño completa las 4 zonas de cepillado (2 minutos) con técnica correcta.
