# PROJECT: TinAR - WebAR Educativo Dental

## Overview

**Producto:** Experiencia WebAR educativa para enseñar técnica correcta de cepillado dental a niños de 3-8 años.

**Personaje:** Tina la dinosauria - guía interactiva en AR

**Objetivo Clínico:**
- Mejorar adherencia al cepillado dental
- Reducir ansiedad dental infantil
- Educación en técnica correcta según guías ADA

---

## Target Users

| Segmento | Descripción |
|----------|-------------|
| **Primario** | Niños 3-8 años (post-consulta odontopediátrica) |
| **Secundario** | Padres que supervisan el cepillado |
| **Contexto** | Uso en casa, después de visitar al dentista |

---

## Core Features

### MVP Features (Must Have)

1. **WebAR sin instalación** - Acceso vía QR desde navegador móvil
2. **Tracking de imagen** - Escanear tarjeta/marcador con logo Doctora Dentina
3. **Modelo 3D de Tina** - Dinosauria que guía el cepillado
4. **Sistema de estados** - 4 zonas de cepillado + intro + celebración
5. **Audio TTS multilenguaje** - Español, Inglés, Portugués
6. **Contenido educativo** - Técnica correcta según ADA:
   - Ángulo 45° respecto a encías
   - Movimientos circulares
   - Cepillado de todas las superficies
7. **Animaciones de Tina** - Expresiones de alegría, guía, celebración
8. **Overlays educativos** - Flechas, círculos, indicadores de técnica
9. **Timer visual** - 30 segundos por zona (2 min total)
10. **Feedback positivo** - Celebración con confetti al terminar

### Post-MVP (Nice to Have)

- Estadísticas de uso
- Múltiples personajes
- Integración con gamificación
- Offline-first con service worker

---

## Technical Constraints

| Restricción | Valor |
|-------------|-------|
| **100% Open Source** | MindAR, AFRAME, Web Speech API |
| **Sin instalación** | WebAR en navegador |
| **Compatible** | Android Chrome + iOS Safari |
| **Peso total** | < 10MB (modelo < 5MB) |
| **HTTPS obligatorio** | GitHub Pages con SSL |
| **TTS nativo** | Web Speech API (95% compatibilidad) |

---

## Stack Técnico

| Componente | Tecnología | Licencia |
|------------|------------|----------|
| **AR Engine** | MindAR v1.2.5 | MIT |
| **3D Framework** | AFRAME v1.5.0 | MIT |
| **3D Model** | GLB (GLTF 2.0) | Propio |
| **TTS** | Web Speech API | Nativo navegador |
| **Hosting** | GitHub Pages | Gratuito |
| **QR** | Cualquier generador gratuito | - |

---

## Success Metrics

| Métrica | Objetivo |
|---------|----------|
| **Tiempo de carga** | < 5 segundos en 4G |
| **Compatibilidad** | 95% dispositivos móviles |
| **Experiencia completa** | 100% usuarios completan las 4 zonas |
| **Satisfacción** | Feedback positivo (>4/5) |

---

## Risks

| Riesgo | Mitigación |
|--------|------------|
| Modelo GLB muy pesado (87MB) | Optimización con Draco, reducción texturas |
| Modelo sin animaciones | Animaciones simuladas via AFRAME |
| TTS no disponible en algunos navegadores | Fallback con texto en pantalla |
| Tracking AR inestable | Marcador con alto contraste, bordes definidos |

---

## References

- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [AFRAME Documentation](https://aframe.io/docs/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [ADA Brushing Guidelines](https://www.mouthhealthy.org/en/az-topics/b/brushing-your-teeth)
