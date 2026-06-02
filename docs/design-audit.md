# Especificación visual de implementación: Party Minigames

Fecha de refinamiento: 2026-06-02

## Alcance y fuentes

Este documento convierte la entrega de Stitch en la especificación visual para
la app real ubicada en `app/`. La entrega de Stitch es referencia de diseño y
storyboard de interacción. No es código de producción.

Fuentes revisadas:

- `stitch_party_minigames_app_design/electric_social/DESIGN.md`
- Los 13 pares `code.html` y `screen.png` de Stitch
- La arquitectura Expo actual en `app/`
- Los componentes existentes en `app/src/components/ui/`
- Los stores existentes en `app/src/store/`
- La navegación existente en `app/src/app/`

Jerarquía de decisión:

1. Este documento refinado.
2. `electric_social/DESIGN.md`.
3. Las capturas de referencia principal.
4. Las capturas de referencia secundaria.
5. Los HTML únicamente como evidencia de estructura o microinteracciones.

Cuando una captura contradiga la guía Electric Social, prevalece la guía. Esto
ocurre en varias capturas con fondos claros generados por CSS web defectuoso.

## Estado de la app real

La app ya tiene una base que debe preservarse:

- Expo SDK 54, React Native, TypeScript estricto y NativeWind.
- React Navigation con un stack tipado.
- Zustand separado en `session.store.ts` y `settings.store.ts`.
- Pantallas raíz en `app/src/screens/`.
- Componentes UI compartidos en `app/src/components/ui/`.
- Tokens actuales en `app/src/theme/tokens.ts`.

La adaptación debe evolucionar esa arquitectura. No se debe crear un segundo
sistema de componentes, un segundo store de sesión ni estilos aislados por
pantalla.

## Inventario Stitch

La entrega contiene 13 prototipos HTML, 13 capturas PNG y una guía visual.

| Carpeta | Pantalla | Captura | Clasificación |
| --- | --- | ---: | --- |
| `home_party_minigames` | Inicio y sesión activa | `706x1600` | Principal |
| `lobby_jugadores` | Gestión de jugadores | `571x1600` | Secundaria |
| `cat_logo_de_juegos` | Catálogo de juegos | `463x1600` | Secundaria |
| `ajustes_de_juego` | Ajustes de partida | `423x1600` | Secundaria |
| `pantalla_base_de_juego` | Shell genérico de reto | `706x1600` | Principal |
| `juego_ruleta_por_nivel` | Ruleta por intensidad | `706x1600` | Principal |
| `juego_qu_prefieres` | Dilema de dos opciones | `706x1600` | Principal |
| `juego_categor_a_rel_mpago` | Categoría contra reloj | `706x1600` | Secundaria |
| `juego_dedo_m_s_lento` | Interacción multitáctil | `706x1600` | Secundaria específica |
| `juego_impostor` | Flujo secreto y votación | `706x1600` | Principal |
| `juego_rimas` | Palabra y timer circular | `706x1600` | Principal |
| `juego_secuencia` | Memoria de símbolos | `706x1600` | Secundaria |
| `juego_qui_n_es_m_s_probable` | Votación social | `509x1600` | Secundaria |

Las capturas no conforman una matriz fiable de dispositivos: sus anchos varían
entre `423` y `706` píxeles. La implementación debe ser fluida y validarse en
dispositivos reales.

## 1. Identidad visual definitiva

La identidad definitiva de Party Minigames será **Electric Social**.

Electric Social se implementará como una interfaz social nocturna con
glassmorphism moderado:

- Base carbón con matiz violeta.
- Superficies oscuras apiladas para dar profundidad.
- Morado eléctrico como color de marca y acción principal.
- Cian neón para información, foco, selección y progreso.
- Rosa intenso para tensión, intensidad y estados calientes.
- Verde para éxito.
- Naranja solar para advertencias y penalizaciones.
- Tarjetas amplias, redondeadas y legibles a distancia.
- Botones tipo píldora con targets táctiles generosos.
- Brillos difusos reservados para jerarquía o estado activo.

La paleta azul marino, las franjas superiores y los puntos decorativos presentes
actualmente en algunos componentes de `app/src/components/ui/` no forman parte
de la identidad final. Pueden retirarse gradualmente durante el refactor visual.

### Principios de uso

| Principio | Regla |
| --- | --- |
| Oscuridad consistente | Toda pantalla usa fondo carbón. No hay modo claro. |
| Glow con intención | El brillo marca CTA, timer, foco o turno. No decora todas las tarjetas. |
| Alto contraste | Instrucciones y decisiones deben leerse con el teléfono sobre una mesa. |
| Superficies táctiles | Acciones normales miden mínimo `48px`; CTA principales `56px`. |
| Juego enfocado | Durante una partida no se muestra navegación inferior. |
| Sistema compartido | Los juegos reutilizan primitivas globales y conservan composición propia. |
| Accesibilidad | Color, icono y texto comunican juntos cada estado. |

## 2. Tokens visuales extraídos del diseño Stitch

`app/src/theme/tokens.ts` debe convertirse en la fuente única de estos valores.
NativeWind puede exponer aliases convenientes, pero no debe duplicar la lógica
semántica.

### 2.1 Superficies y texto

| Token propuesto | Token Stitch | Valor | Uso |
| --- | --- | --- | --- |
| `background` | `background` | `#16111A` | Fondo general |
| `surface` | `surface` | `#16111A` | Barra superior y superficie base |
| `surfaceDim` | `surface-dim` | `#16111A` | Variante oscura equivalente |
| `surfaceLowest` | `surface-container-lowest` | `#110C15` | Profundidad máxima |
| `surfaceLow` | `surface-container-low` | `#1F1A22` | Tarjetas discretas |
| `surfaceContainer` | `surface-container` | `#231E26` | Tarjetas e inputs |
| `surfaceHigh` | `surface-container-high` | `#2E2831` | Controles elevados |
| `surfaceHighest` | `surface-container-highest` | `#39333C` | Selección y modal |
| `surfaceBright` | `surface-bright` | `#3D3740` | Estado elevado |
| `surfaceVariant` | `surface-variant` | `#39333C` | Variante equivalente |
| `text` | `on-surface` | `#EADFEC` | Texto principal |
| `textMuted` | `on-surface-variant` | `#D0C2D5` | Texto secundario |
| `outline` | `outline` | `#998D9E` | Borde visible |
| `outlineVariant` | `outline-variant` | `#4D4353` | Borde discreto |

### 2.2 Marca y estados

| Token propuesto | Token Stitch | Valor | Uso |
| --- | --- | --- | --- |
| `primary` | `primary` | `#E0B6FF` | Marca y texto morado claro |
| `primaryContainer` | `primary-container` | `#9D4EDD` | CTA y turno activo |
| `primaryInverse` | `inverse-primary` | `#8433C4` | Profundidad de gradiente |
| `onPrimary` | `on-primary` | `#4C007D` | Texto sobre morado claro |
| `onPrimaryContainer` | `on-primary-container` | `#FFFDFF` | Texto sobre CTA |
| `cyan` | `secondary-container` | `#00F4FE` | Foco y acento informativo |
| `cyanDim` | `secondary-fixed-dim` | `#00DCE5` | Timer, borde y tab activo |
| `cyanSoft` | `secondary-fixed` | `#63F7FF` | Brillo y detalle |
| `onCyan` | `on-secondary-fixed` | `#002021` | Texto sobre cian |
| `pink` | `tertiary-container` | `#E5006D` | Intensidad y gradiente CTA |
| `pinkSoft` | `tertiary` | `#FFB1C3` | Acento secundario |
| `pinkFixed` | `tertiary-fixed` | `#FFD9E0` | Texto sobre estado intenso |
| `error` | `error` | `#FFB4AB` | Texto de error |
| `errorContainer` | `error-container` | `#93000A` | Fondo de error |
| `onErrorContainer` | `on-error-container` | `#FFDAD6` | Texto sobre error |

### 2.3 Extensiones semánticas necesarias

La guía Stitch describe éxito verde y advertencia naranja, pero no los incluye
en el bloque principal de tokens. Estos valores se fijan como extensión de app:

| Token propuesto | Valor | Origen | Uso |
| --- | --- | --- | --- |
| `success` | `#10B981` | HTML de Categoría relámpago | Acción correcta |
| `successStrong` | `#059669` | HTML de Categoría relámpago | Fin de gradiente de éxito |
| `warning` | `#FB923C` | Normalización de naranja solar | Advertencia y penalización |
| `warningSoft` | `#FDBA74` | Extensión semántica | Texto de advertencia |
| `scrim` | `rgba(0, 0, 0, 0.60)` | Modales Stitch | Backdrop |
| `glassFill` | `rgba(35, 30, 38, 0.40)` | HTML Stitch | Tarjeta translúcida |
| `glassFillStrong` | `rgba(22, 17, 26, 0.70)` | HTML de Impostor | Modal y tarjeta privada |
| `innerBorder` | `rgba(255, 255, 255, 0.10)` | HTML Stitch | Borde interno |

### 2.4 Gradientes definitivos

| Token propuesto | Colores | Uso |
| --- | --- | --- |
| `gradients.primary` | `#9D4EDD -> #E5006D` | CTA principal |
| `gradients.primaryDepth` | `#9D4EDD -> #8433C4` | Revelar rol y acciones moradas |
| `gradients.avatar` | `#9D4EDD -> #00F4FE` | Avatar destacado |
| `gradients.success` | `#10B981 -> #059669` | Acción correcta |
| `gradients.ambient` | Morado y cian con opacidad baja | Fondo decorativo |

Usar `expo-linear-gradient` para gradientes visibles. No simular gradientes
principales con un único color.

### 2.5 Radios y espaciado

| Token | Valor RN | Uso |
| --- | ---: | --- |
| `radius.sm` | `8` | Badges |
| `radius.default` | `16` | Inputs |
| `radius.md` | `24` | Tarjetas estándar |
| `radius.lg` | `32` | Modales |
| `radius.xl` | `48` | Tarjetas protagonistas puntuales |
| `radius.pill` | `999` | Botones, chips y segmented controls |
| `space.xs` | `4` | Microespaciado |
| `space.sm` | `8` | Separación corta |
| `space.md` | `16` | Gutter y separación base |
| `space.lg` | `24` | Padding de tarjeta |
| `space.xl` | `32` | Separación de bloques |
| `space.safeMargin` | `20` | Margen adicional junto a safe area |

### 2.6 Sombras, blur y elevación

| Token propuesto | Definición aproximada | Uso |
| --- | --- | --- |
| `glow.primary` | Morado `15-40%`, blur amplio | CTA y turno activo |
| `glow.cyan` | Cian `20-40%`, blur medio | Timer, foco y selección |
| `glow.pink` | Rosa `30-40%`, blur medio | Intensidad y rol impostor |
| `glow.success` | Verde `20-30%`, blur medio | Acción correcta |
| `blur.panel` | `20px` web | Solo aproximación visual |
| `blur.modal` | `12-20px` web | Solo aproximación visual |

Regla nativa:

- Primera implementación: superficies translúcidas con fallback opaco.
- Segunda pasada opcional: `expo-blur` solo en tab bar y modales.
- No bloquear la migración por blur.
- Probar Android físico antes de generalizar blur o elevación.

## 3. Fuentes propuestas y uso

Las fuentes definitivas serán **Rubik** y **Be Vietnam Pro**.

### 3.1 Archivos necesarios

| Familia | Pesos estáticos |
| --- | --- |
| Rubik | `600`, `700`, `800` |
| Be Vietnam Pro | `400`, `600`, `700` |

React Native no debe depender de fuentes web ni de fuentes variables. Incorporar
archivos estáticos `.ttf` u `.otf` dentro de `app/assets/fonts/`.

### 3.2 Escala tipográfica

| Rol | Familia | Tamaño | Peso | Line height | Uso |
| --- | --- | ---: | ---: | ---: | --- |
| `displayLg` | Rubik | `48` | `800` | `52` | Palabra, reto o número protagonista |
| `headlineLg` | Rubik | `32` | `700` | `40` | Título grande |
| `headlineMd` | Rubik | `24` | `600` | `32` | Header y título de tarjeta |
| `headlineSm` | Rubik | `20` | `600` | `28` | Nombre de jugador y subtítulo |
| `headlineMobile` | Rubik | `28` | `700` | `36` | Títulos móviles largos |
| `bodyLg` | Be Vietnam Pro | `18` | `400` | `28` | Instrucciones visibles a distancia |
| `bodyMd` | Be Vietnam Pro | `16` | `400` | `24` | Texto operativo |
| `labelLg` | Be Vietnam Pro | `14` | `700` | `20` | Botón y badge |
| `labelSm` | Be Vietnam Pro | `12` | `600` | `16` | Metadata |

### 3.3 Reglas de aplicación

- Rubik se usa en marca, títulos, preguntas, palabras, timers y nombres.
- Be Vietnam Pro se usa en instrucciones, botones, labels, badges e inputs.
- Labels breves pueden ir en mayúsculas con tracking.
- No usar mayúsculas sostenidas en párrafos.
- Validar escalado de texto y saltos de línea en pantallas pequeñas.
- Cargar fuentes mediante una estrategia Expo compatible antes de aplicar
  `fontFamily` globalmente.

## 4. Componentes globales obligatorios

La implementación debe refactorizar componentes existentes antes de migrar
pantallas.

| Componente final | Base actual | Responsabilidad |
| --- | --- | --- |
| `ScreenSurface` | `Screen.tsx` | Safe area, fondo Electric Social, scroll opcional y glows ambientales |
| `AppHeader` | `Header.tsx` | Variantes `root` y `game`, título centrado, acción izquierda y reglas |
| `GlassCard` | `Card.tsx` | Variantes `base`, `active`, `modal` y `flat` |
| `PrimaryGradientButton` | `Button.tsx` | CTA de `56px`, gradiente morado-rosa y disabled |
| `SecondaryOutlineButton` | `Button.tsx` | Acción secundaria con borde cian |
| `DangerButton` | `Button.tsx` | Fallo, reset o salida destructiva |
| `IconButton` | `Button.tsx` | Menú, back, cerrar, ayuda y reglas con label accesible |
| `PromptCard` | `PromptCard.tsx` | Pregunta, reto o instrucción protagonista |
| `ActiveTurnCard` | `TurnCard.tsx` | Jugador actual con pulso y variante compacta |
| `PlayerAvatar` | Nuevo | Inicial, color y estado activo |
| `GameBadge` | Nuevo | Tipo de juego, nivel o estado |
| `TimerRing` | Nuevo | Timer circular normal, warning y expired |
| `TimerBar` | Nuevo | Timer lineal para Secuencia |
| `SegmentedControl` | Extraer de `SettingsScreen.tsx` | Dificultad, intensidad y unidad |
| `NumberStepper` | Nuevo | Tope y segundos con límites |
| `ToggleRow` | Nuevo | Alcohol, vibración y sonido |
| `GameActionDock` | Nuevo | Barra inferior fija con acciones de juego |
| `ResultModal` | Nuevo | Resultado, penalización o desafío |
| `RulesModal` | Nuevo | Reglas breves por juego |
| `AppTabBar` | Nuevo | Tabs raíz con icono, label y punto cian activo |

### Contratos globales

- Todo botón de icono requiere `accessibilityLabel`.
- Toda superficie usa tokens; no hexadecimales locales sin justificación.
- `PlayerAvatar` es la única implementación de avatar.
- `SegmentedControl` es la única implementación de selector segmentado.
- Timers comparten lógica temporal aunque tengan distinta presentación.
- `GameActionDock` debe respetar safe area inferior.
- Blur es opcional; la legibilidad no puede depender de él.

## 5. Componentes específicos por minijuego

Cada juego conserva composición propia y reutiliza las primitivas globales.

| Juego | Componentes específicos | Estado local mínimo |
| --- | --- | --- |
| Ruleta por nivel | `RouletteWheel`, `DifficultySelector`, `ChallengeResultModal` | Nivel, giro, desafío y resultado |
| ¿Qué prefieres? | `DilemmaLevelBadge`, `ChoiceCard`, `ChoiceTimerFooter` | Pregunta, selección y expiración |
| Categoría relámpago | `RapidCategoryPrompt`, `RapidCategoryActionDock` | Categoría, turno, timer y evaluación |
| Dedo más lento | `MultiTouchHoldArea`, `ReleaseSignalOverlay`, `SlowFingerResult` | Dedos activos, señal, liberaciones y perdedor |
| Impostor | `PassPhoneCard`, `SecretRoleReveal`, `DiscussionTimer`, `ImpostorVoteGrid`, `ImpostorResultCard` | Fase, rol, palabra, votos y resultado |
| Rimas | `BaseWordDisplay`, `RhymesActionDock` | Palabra, turno, timer y evaluación |
| Secuencia | `SequencePreview`, `SequenceInputPad`, `SequenceFeedbackOverlay` | Patrón, input, nivel y resultado |
| ¿Quién es más probable? | `MostLikelyPrompt`, `PlayerVoteGrid`, `PlayerVoteCard` | Pregunta, voto y confirmación |

No crear un `GameScreen` monolítico con condicionales extensos. Debe actuar como
router tipado o delegar a un registro de juegos.

## 6. Pantallas de referencia principal

| Referencia | Decisión que gobierna |
| --- | --- |
| `electric_social/DESIGN.md` | Paleta, tipografía, radios, espaciado y profundidad |
| `home_party_minigames` | Jerarquía del inicio, sesión activa, CTA y tab bar |
| `pantalla_base_de_juego` | Anatomía del shell genérico |
| `juego_ruleta_por_nivel` | Selector segmentado, foco inmersivo y modal |
| `juego_qu_prefieres` | Dos superficies grandes y decisión rápida |
| `juego_rimas` | Timer circular protagonista y dock de evaluación |
| `juego_impostor` | Flujo privado multietapa y votación |

Estas pantallas definen el lenguaje final. Sus layouts deben reinterpretarse con
flexbox y safe areas, no replicarse por coordenadas.

## 7. Pantallas de referencia secundaria

| Referencia | Conservar | No tomar literalmente |
| --- | --- | --- |
| `lobby_jugadores` | Alta, lista, turno y reset | Fondo claro, altura y contraste |
| `cat_logo_de_juegos` | Catálogo, badges y rejilla | Fondo claro y emoji como iconografía final |
| `ajustes_de_juego` | Secciones, segmented controls y preferencias | Fondo claro y valores hardcodeados |
| `juego_categor_a_rel_mpago` | Timer, prompt y dock | Fondo claro y final incompleto |
| `juego_secuencia` | Timer lineal, patrón y teclado | Fondo claro y ausencia de lógica |
| `juego_qui_n_es_m_s_probable` | Rejilla de avatares y confirmar | Votos simulados |
| `juego_dedo_m_s_lento` | Área circular y pantalla enfocada | Simulación fija del perdedor |

Los fondos claros son artefactos del HTML. No son una variante visual válida.

## 8. Reglas de navegación

La navegación final debe tener dos niveles:

```text
RootStack
├── MainTabs
│   ├── Home
│   ├── Lobby
│   ├── Games
│   └── Settings
└── Game
```

### Reglas obligatorias

| Contexto | Navegación visible | Header |
| --- | --- | --- |
| `Home` | Tabs visibles | Marca y reglas opcionales |
| `Lobby` | Tabs visibles | Título y reglas opcionales |
| `Games` | Tabs visibles | Título y reglas opcionales |
| `Settings` | Tabs visibles | Título e información |
| Partida activa | Tabs ocultos | Cerrar o back, título y reglas |
| Modal de resultado | Tabs ocultos | No añade navegación propia |

### Decisiones

- Usar tabs estables de React Navigation para los cuatro destinos raíz.
- Mantener `Game` como pantalla hermana de `MainTabs` dentro del stack raíz.
- Al abrir una partida, los tabs quedan cubiertos naturalmente.
- No dibujar una tab bar independiente dentro de cada pantalla.
- Usar `GameId` tipado para seleccionar el juego.
- El botón izquierdo del header raíz solo se muestra si tiene acción real.
- Durante una partida, el botón izquierdo cierra o vuelve al catálogo.
- El botón de reglas abre `RulesModal`; no alternar entre `Rules`, `Reglas`,
  `help` y `menu_book`.
- Mantener estado de jugadores y ajustes al navegar entre tabs.
- Mantener estado efímero de partida dentro de su módulo salvo necesidad real
  de persistencia transversal.

## 9. Qué NO se debe copiar del HTML

No portar directamente:

- Tailwind CDN ni configuración Tailwind inline.
- `<link>` de Google Fonts.
- Material Symbols web ni imports duplicados.
- CSS con `theme('colors...')`.
- `backdrop-filter` como requisito funcional.
- Pseudo-elementos CSS.
- Estados `hover` como interacción primaria.
- `fixed`, `100vh`, anchos rígidos y coordenadas tomadas de PNG.
- `<a href="#">`.
- Listeners DOM, `querySelector`, `classList` y estilos mutados manualmente.
- `setInterval` sin limpieza y sin manejo del lifecycle de la app.
- SVG inline copiado literalmente sin convertirlo a una solución nativa.
- Jugadores, votos, palabras, categorías, retos y resultados hardcodeados.
- Valores de timers del prototipo.
- Botones de debug `Show Normal` y `Show Impostor`.
- Simulación fija de Dedo más lento.
- Emoji como iconografía definitiva sin validar iOS, Android y web.
- Navegación inferior repetida dentro de cada pantalla.

### Regla de adaptación React Native

- NativeWind: layout estable, padding, flex, tipografía y utilidades simples.
- `style`: tokens dinámicos, sombras, gradientes, animaciones y valores
  calculados.
- Zustand: estado transversal real.
- Estado local: fases internas de cada juego.
- React Navigation: tabs raíz y stack de partidas.
- `Pressable`: interacción táctil y pressed state.
- Reanimated o `Animated`: pulso, giro, aparición y overlays.

## 10. Riesgos técnicos detectados

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Mezclar identidad azul actual con Electric Social | UI incoherente | Sustituir tokens y primitivas antes de pantallas |
| Blur costoso o inconsistente en Android | Rendimiento y diferencias visuales | Fallback opaco; añadir blur solo tras prueba física |
| Gradientes implementados como color plano | Pérdida de identidad | Usar `expo-linear-gradient` en CTA visibles |
| Fuentes no cargadas o pesos inexistentes | Saltos visuales y fallback incorrecto | Incluir pesos estáticos y validar arranque |
| Tabs absolutos sin padding inferior | Contenido tapado | Centralizar safe area y altura de tabs |
| Timers duplicados por juego | Deriva funcional | Hook temporal compartido y store como fuente única |
| Intervalos activos al pausar la app | Timer incorrecto | Limpiar intervalos y contemplar `AppState` |
| SVG o animación pesada | Caídas de frames | Probar `TimerRing`, ruleta y secuencia en Android físico |
| Dedo más lento multitáctil | Mecánica incorrecta | Prototipo técnico aislado y pruebas físicas tempranas |
| Impostor con flujo complejo | Estados imposibles o filtración de rol | Modelar fases explícitas y probar transiciones |
| Capturas Stitch con tamaños variables | Layout frágil | Flexbox, límites de ancho y matriz de dispositivos |
| Emoji variables | Inconsistencia visual | Elegir iconos nativos consistentes |
| Copy adulto sin revisión | Riesgo de producto | Curar mazos, consentimiento y modo sin alcohol |
| Cambios locales existentes en el repo | Conflictos y pérdida de trabajo | Crear checkpoint antes de implementar |

### Timers que requieren normalización

| Juego | Stitch ajustes | Stitch pantalla | Store actual | Decisión |
| --- | ---: | ---: | ---: | --- |
| Categoría relámpago | `10` | `10` | `8` | Store configurable |
| Rimas | `5` | `8` | `8` | Store configurable |
| Secuencia | `5` | `8` | `10` | Store configurable |
| Impostor revelado/Q&A | `30` | Variable | `15` | Token separado |
| Impostor discusión | No definido | `45` | No definido | Token separado |
| ¿Qué prefieres? | No definido | `15` | No definido | Añadir token |

No tomar ninguno de estos números como regla fija de producto. El store será la
fuente única y cada juego tendrá un valor inicial explícito.

## 11. Orden exacto de migración visual

La secuencia siguiente reduce riesgo y evita duplicación. Cada paso debe quedar
estable antes de iniciar el siguiente.

### Fase 0: baseline

1. Crear un checkpoint del árbol de trabajo existente.
2. Instalar dependencias actuales y ejecutar TypeScript.
3. Levantar la app sin cambios visuales adicionales.
4. Registrar capturas baseline en teléfono pequeño, teléfono alto y Android
   físico.
5. Confirmar que Electric Social sustituye la decoración azul actual.

### Fase 1: tokens y dependencias visuales

1. Normalizar `app/src/theme/tokens.ts` con las tablas de este documento.
2. Mapear aliases útiles en `app/tailwind.config.js`.
3. Añadir `expo-linear-gradient`.
4. Añadir los pesos estáticos de Rubik y Be Vietnam Pro.
5. Configurar carga de fuentes compatible con Expo.
6. Elegir iconos nativos consistentes.
7. Añadir `react-native-svg` cuando se implemente el primer timer circular.
8. Posponer `expo-blur` hasta una segunda pasada validada.

### Fase 2: primitivas globales

Refactorizar en este orden:

1. `Screen.tsx` a `ScreenSurface`.
2. `Card.tsx` a `GlassCard`.
3. `Button.tsx` con CTA gradiente, secundario outline, peligro e icono.
4. `Header.tsx` a `AppHeader`.
5. Extraer `PlayerAvatar`.
6. Adaptar `TurnCard.tsx` a `ActiveTurnCard`.
7. Adaptar `PromptCard.tsx`.
8. Crear `GameBadge`.
9. Extraer `SegmentedControl`.
10. Crear `NumberStepper`.
11. Crear `ToggleRow`.

Criterio de salida: una pantalla de prueba o una pantalla raíz puede componer el
lenguaje Electric Social sin estilos locales importantes.

### Fase 3: navegación raíz

1. Añadir tabs para `Home`, `Lobby`, `Games` y `Settings`.
2. Mantener `Game` fuera de tabs.
3. Implementar `AppTabBar` con fondo oscuro translúcido y punto cian activo.
4. Ocultar tabs al entrar a una partida.
5. Eliminar headers nativos redundantes donde se use `AppHeader`.
6. Verificar back de Android, safe areas y teclado en Lobby.

### Fase 4: pantallas raíz

Migrar exactamente en este orden:

1. `HomeScreen`: valida marca, fondo, sesión y CTA.
2. `LobbyScreen`: valida Zustand de sesión, inputs, lista y turno.
3. `GamesScreen`: valida catálogo, badges e iconos.
4. `SettingsScreen`: valida controles reutilizables y Zustand de ajustes.

Criterio de salida: navegación raíz completa, consistente y funcional sin
depender de HTML Stitch.

### Fase 5: shell compartido de juego

1. Crear `GameShell`.
2. Crear `RulesModal`.
3. Crear `GameActionDock`.
4. Crear `ResultModal`.
5. Crear hook de countdown reutilizable.
6. Crear `TimerRing`.
7. Crear `TimerBar`.
8. Convertir `GameScreen` en router tipado hacia módulos de juego.

Criterio de salida: un juego de prueba puede mostrar header, turno, prompt,
timer, reglas, acciones y salida sin tabs visibles.

### Fase 6: juegos simples

Migrar exactamente en este orden:

1. Categoría relámpago.
2. Rimas.
3. ¿Quién es más probable?
4. ¿Qué prefieres?

Estos juegos validan prompt, timers, evaluación, votos y decisiones binarias.

### Fase 7: juegos medios

Migrar exactamente en este orden:

1. Ruleta por nivel.
2. Secuencia.

Estos juegos añaden giro, modal, patrón, input y feedback visual.

### Fase 8: juegos complejos

Migrar exactamente en este orden:

1. Impostor.
2. Dedo más lento.

Impostor exige fases explícitas y privacidad. Dedo más lento exige multitouch
real y pruebas físicas dedicadas.

### Fase 9: segunda pasada visual y calidad

1. Evaluar `expo-blur` solo en tab bar y modales.
2. Medir rendimiento de glows, SVG y animaciones en Android físico.
3. Revisar iOS, Android, web y tablet.
4. Revisar accesibilidad y escalado tipográfico.
5. Unificar copy en español con acentos correctos.
6. Validar timers al pausar y reanudar la app.
7. Revisar modo sin alcohol, consentimiento y contenido responsable.
8. Crear capturas finales con viewports consistentes.

## Mapa de archivos previsto

La implementación futura puede organizarse así:

```text
app/assets/fonts/
app/src/app/MainTabsNavigator.tsx
app/src/components/navigation/AppTabBar.tsx
app/src/components/ui/PlayerAvatar.tsx
app/src/components/ui/GameBadge.tsx
app/src/components/ui/SegmentedControl.tsx
app/src/components/ui/NumberStepper.tsx
app/src/components/ui/ToggleRow.tsx
app/src/components/ui/TimerRing.tsx
app/src/components/ui/TimerBar.tsx
app/src/components/ui/GameActionDock.tsx
app/src/components/ui/ResultModal.tsx
app/src/components/ui/RulesModal.tsx
app/src/components/game/GameShell.tsx
app/src/hooks/useCountdown.ts
app/src/features/games/game.registry.ts
app/src/features/games/rapid-category/
app/src/features/games/rhymes/
app/src/features/games/most-likely/
app/src/features/games/would-you-rather/
app/src/features/games/roulette/
app/src/features/games/sequence/
app/src/features/games/impostor/
app/src/features/games/slow-finger/
```

## Criterio final

La implementación correcta no copia HTML. Absorbe Electric Social dentro de la
arquitectura Expo existente mediante tokens centralizados, componentes nativos
reutilizables, navegación tipada y Zustand como fuente de estado transversal.
