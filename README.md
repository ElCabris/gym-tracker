<div align="center">

# 💪 GymTracker

### Seguimiento integral de salud y fitness — sin servidor, sin registro, sin complicaciones.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-FF6B35)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Ver demo](#) · [Reportar un bug](https://github.com/lacabrazapa/gym-traker/issues) · [Solicitar feature](https://github.com/lacabrazapa/gym-traker/issues)

</div>

---

## 📋 Tabla de contenidos

1. [Descripción general](#-descripción-general)
2. [Características principales](#-características-principales)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
5. [Requisitos previos](#-requisitos-previos)
6. [Instalación](#-instalación)
7. [Configuración](#-configuración)
8. [Ejecución del proyecto](#-ejecución-del-proyecto)
9. [Uso del sistema](#-uso-del-sistema)
10. [Ejemplos](#-ejemplos)
11. [Estructura del proyecto](#-estructura-del-proyecto)
12. [Scripts disponibles](#-scripts-disponibles)
13. [Testing](#-testing)
14. [Roadmap](#-roadmap)
15. [Contribución](#-contribución)
16. [Licencia](#-licencia)
17. [Autor](#-autor)

---

## 📖 Descripción general

**GymTracker** es una aplicación web de seguimiento de salud y fitness completamente **client-side** (sin backend ni base de datos remota). Permite registrar y visualizar de forma unificada los cuatro pilares del rendimiento físico: **entrenamiento, nutrición, sueño y métricas corporales diarias**.

### Problema que resuelve

Muchas apps de fitness fragmentan la información: una app para el gym, otra para macros, otra para el sueño. GymTracker consolida todo en un único panel, almacenado localmente en el navegador del usuario, sin necesidad de crear cuenta, sin suscripciones y sin compartir datos con terceros.

### Alcance y público objetivo

| Perfil | Caso de uso |
|--------|-------------|
| Atleta amateur / gym-goer | Llevar un diario de sesiones y progresión de cargas |
| Persona con metas de composición corporal | Monitorizar peso, macros y progreso hacia objetivos |
| Usuario preocupado por la privacidad | Datos 100 % locales, sin cuentas ni servidores |
| Desarrollador frontend | Referencia de arquitectura React/Next.js/Zustand |

---

## ✨ Características principales

- **📊 Dashboard unificado** — Métricas del día (peso, proteína, agua, sueño), cumplimiento semanal y resumen del último entrenamiento.
- **📝 Registro diario** — Formularios validados para peso corporal, ingesta de agua, nivel de energía, ejercicios, comidas y sueño.
- **🏋️ Seguimiento de entrenamiento** — Progresión de cargas por ejercicio, récords personales y evolución del press de banca con gráfico histórico.
- **🥗 Control nutricional** — Totales de calorías y macronutrientes (proteínas, carbohidratos, grasas) con gráfico de distribución en donut.
- **😴 Análisis del sueño** — Media semanal, racha de noches de calidad, gráfico de barra 14 días con código de colores.
- **📅 Historial completo** — Tabs separados para evolución del peso corporal, fuerza y diario personal.
- **🔔 Notificaciones toast** — Feedback visual inmediato tras cada acción.
- **📱 Diseño responsive** — Navbar superior en escritorio y navbar inferior fija en móvil.
- **💾 Persistencia local** — Todos los datos guardados en `localStorage` mediante Zustand persist; sin necesidad de login.

---

## 🛠️ Tecnologías utilizadas

| Categoría | Herramienta | Versión | Rol |
|-----------|-------------|---------|-----|
| Framework | [Next.js](https://nextjs.org/) | 14.2 | SSG, enrutamiento y build |
| UI Library | [React](https://react.dev/) | 18.3 | Renderizado de componentes |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) | 5.5 | Tipado estático |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS |
| Estado | [Zustand](https://zustand-demo.pmnd.rs/) | 4.5 | Store global con persist |
| Gráficos | [Recharts](https://recharts.org/) | 2.12 | Visualizaciones de datos |
| Formularios | [React Hook Form](https://react-hook-form.com/) | 7.52 | Gestión de formularios |
| Validación | [Zod](https://zod.dev/) | 3.23 | Esquemas y validación runtime |
| Iconos | [Lucide React](https://lucide.dev/) | 0.407 | Iconografía SVG |
| Utilidades CSS | clsx + tailwind-merge | — | Composición de clases |
| Linting | ESLint + Next.js config | 8.57 | Calidad de código |

---

## 🏗️ Arquitectura del proyecto

GymTracker sigue una arquitectura **feature-based** con separación clara entre presentación, lógica de negocio y estado:

```
┌─────────────────────────────────────────────────────────┐
│                     NAVEGADOR (Cliente)                  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │               Next.js App (SSG)                  │   │
│  │                                                   │   │
│  │  ┌──────────┐   ┌──────────────────────────────┐ │   │
│  │  │  AppShell│──▶│  Features (Dashboard, Registro│ │   │
│  │  │  (Router)│   │  Entreno, Nutrición, Sueño,   │ │   │
│  │  │          │   │  Historial)                   │ │   │
│  │  └──────────┘   └──────────────┬───────────────┘ │   │
│  │                                │                  │   │
│  │  ┌─────────────────────────────▼───────────────┐ │   │
│  │  │            Zustand Store (Estado Global)      │ │   │
│  │  │  dailyRecords · exercises · meals · sleep    │ │   │
│  │  └─────────────────────────────┬───────────────┘ │   │
│  │                                │                  │   │
│  │  ┌─────────────────────────────▼───────────────┐ │   │
│  │  │           Services + Utils + Constants        │ │   │
│  │  │  HealthService · NutritionService · etc.      │ │   │
│  │  └─────────────────────────────┬───────────────┘ │   │
│  │                                │                  │   │
│  │  ┌─────────────────────────────▼───────────────┐ │   │
│  │  │              localStorage (Persistencia)      │ │   │
│  │  │           gym-health-tracker-v1               │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Flujo de datos

```
Usuario interactúa → Componente Feature → Zustand Action → Store actualizado
       ↑                                                           │
       └─────────────── Re-render reactivo ──────────────────────┘
                                                    │
                                              localStorage
                                          (Zustand persist)
```

### Decisiones de diseño clave

- **Sin backend**: toda la lógica vive en el cliente; elimina costes de infraestructura y latencia.
- **SSG (Static Site Generation)**: Next.js exporta HTML/JS estático, desplegable en cualquier CDN.
- **Feature modules**: cada sección de la app (dashboard, registro, etc.) es un módulo independiente con su propio directorio.
- **Separación de servicios**: la lógica de cálculo (promedios, records, progreso) está en `lib/services.ts`, desacoplada de los componentes.

---

## ✅ Requisitos previos

Antes de instalar el proyecto, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificación |
|-------------|---------------|--------------|
| [Node.js](https://nodejs.org/) | 18.x o superior | `node --version` |
| [npm](https://www.npmjs.com/) | 9.x o superior | `npm --version` |
| Git | Cualquier versión reciente | `git --version` |

> **Tip**: Se recomienda usar [nvm](https://github.com/nvm-sh/nvm) para gestionar versiones de Node.js.
>
> ```bash
> nvm use 20
> ```

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/lacabrazapa/gym-traker.git
cd gym-traker
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar la instalación

```bash
npm run dev
```

Si el servidor arranca sin errores, la instalación fue exitosa. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### Variables de entorno

GymTracker **no requiere variables de entorno** para funcionar. Al ser una aplicación completamente client-side, todos los datos se persisten en el `localStorage` del navegador bajo la clave:

```
gym-health-tracker-v1
```

### Personalización de objetivos

Los objetivos diarios predeterminados se definen en `src/lib/constants.ts`:

```typescript
export const GOALS = {
  protein: 130,    // gramos
  water: 3000,     // mililitros
  calories: 2700,  // kcal
  sleep: 8,        // horas
  carbs: 300,      // gramos
  fat: 70,         // gramos
  weight: 75,      // kg (objetivo de peso corporal)
};
```

Para modificarlos, edita directamente este archivo antes de hacer el build.

### Personalización del tema

El color primario y la fuente se configuran en `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#4F46E5',  // Indigo — cambiar aquí para adaptar el tema
        600: '#4338CA',
        // ...
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
},
```

---

## 🚀 Ejecución del proyecto

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo con Hot Module Replacement (HMR) en [http://localhost:3000](http://localhost:3000).

### Producción (build estático)

```bash
# 1. Generar los archivos estáticos
npm run build

# 2. Los archivos exportados estarán en el directorio /out
# Puedes servirlos con cualquier servidor HTTP estático, por ejemplo:
npx serve out
```

> **Nota**: El proyecto está configurado con `output: 'export'` en `next.config.mjs`, por lo que `next start` no aplica. El resultado del build es HTML/CSS/JS puro, desplegable directamente en Netlify, Vercel, GitHub Pages o cualquier CDN.

### Despliegue en Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Despliegue en GitHub Pages

```bash
npm run build
# Subir el contenido de /out a la rama gh-pages
```

---

## 📱 Uso del sistema

### Primera vez

Al abrir la aplicación por primera vez, todas las secciones estarán vacías. El flujo recomendado es:

```
1. Ir a "Registro" → Tab "Día"
   └── Registrar peso corporal, agua ingerida y nivel de energía

2. Ir a "Registro" → Tab "Comida"
   └── Añadir cada comida con sus macros

3. Ir a "Registro" → Tab "Ejercicio"
   └── Registrar cada serie del entrenamiento

4. Ir a "Registro" → Tab "Sueño"
   └── Registrar horas y calidad del sueño al despertar

5. Volver al "Dashboard"
   └── Ver el resumen del día y el cumplimiento de objetivos
```

### Navegación

| Sección | Descripción |
|---------|-------------|
| 🏠 **Dashboard** | Vista general: métricas del día, cumplimiento semanal, último entrenamiento |
| 📝 **Registro** | Formularios de entrada de datos: día, ejercicio, comida, sueño |
| 🏋️ **Entreno** | Progresión de ejercicios y gráfico histórico del press de banca |
| 🥗 **Nutrición** | Totales de macros del día y gráfico de distribución |
| 😴 **Sueño** | Métricas de calidad del sueño y gráfico 14 días |
| 📅 **Historial** | Evolución de peso, records personales y diario |

### Gestión de datos

- **Editar un registro diario**: volver al tab "Día" en el mismo día y guardar de nuevo (hace upsert por fecha).
- **Eliminar un ejercicio o comida**: usar el botón de papelera en la lista del día.
- **Limpiar todos los datos**: en las herramientas de desarrollo del navegador, ir a `Application > Local Storage` y borrar la clave `gym-health-tracker-v1`.

---

## 💡 Ejemplos

### Registrar un entrenamiento de pecho

1. Ir a **Registro → Tab Ejercicio**
2. Completar el formulario:

```
Nombre:    Press de Banca
Grupo:     Pecho
Series:    4
Reps:      8
Peso (kg): 80
Descanso:  90
Notas:     Último set al fallo
```

3. Hacer clic en **"Añadir Ejercicio"**
4. El ejercicio aparece en la lista de "Ejercicios de hoy"
5. Ir a **Entreno** para ver la evolución del press de banca en el gráfico histórico

### Registrar una comida

```
Nombre:      Pollo con arroz
Hora:        13:30
Calorías:    520
Proteínas:   45g
Carbos:      50g
Grasas:      8g
```

### Ver el progreso semanal

El **Dashboard** mostrará automáticamente los 7 días de la semana con indicadores de color:

| Color | Estado |
|-------|--------|
| 🟢 Verde | Día con registro completo |
| 🟡 Amarillo | Día con registro parcial |
| 🔴 Rojo | Día sin actividad registrada |
| 🔵 Azul | Hoy |

---

## 📁 Estructura del proyecto

```
gym-traker/
├── src/
│   ├── app/                        # Punto de entrada Next.js App Router
│   │   ├── globals.css             # Estilos globales y directivas Tailwind
│   │   ├── layout.tsx              # Layout raíz (metadata, lang="es")
│   │   └── page.tsx                # Página inicial → renderiza <AppShell />
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Router de páginas + sistema de toasts
│   │   │   └── Navbar.tsx          # Navbar superior (desktop) y bottom (móvil)
│   │   └── ui/                     # Sistema de componentes reutilizables
│   │       ├── Badge.tsx           # Etiqueta con variantes de color
│   │       ├── Button.tsx          # Botón con estado de carga
│   │       ├── Card.tsx            # Contenedor con título opcional
│   │       ├── EmptyState.tsx      # Estado vacío con icono y descripción
│   │       ├── FormField.tsx       # Wrapper de campo (Input, Select, Textarea)
│   │       ├── MetricCard.tsx      # Tarjeta de métrica con icono y subvalor
│   │       └── ProgressBar.tsx     # Barra de progreso hacia un objetivo
│   │
│   ├── features/                   # Módulos de funcionalidad (feature-based)
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx       # Orquestador del dashboard
│   │   │   ├── GoalBars.tsx        # Barras de progreso diario
│   │   │   ├── LastWorkout.tsx     # Resumen del último entrenamiento
│   │   │   └── WeeklyCompliance.tsx# Grid de cumplimiento semanal
│   │   ├── entreno/
│   │   │   └── Entreno.tsx         # Progresión de cargas + gráfico bench press
│   │   ├── historial/
│   │   │   └── Historial.tsx       # Tabs: peso, fuerza, diario personal
│   │   ├── nutricion/
│   │   │   └── Nutricion.tsx       # Macros del día + donut chart
│   │   ├── registro/
│   │   │   ├── Registro.tsx        # Hub con 4 tabs de registro
│   │   │   ├── DayForm.tsx         # Formulario: peso, agua, energía, estado
│   │   │   ├── ExerciseForm.tsx    # Formulario: ejercicio + lista del día
│   │   │   ├── MealForm.tsx        # Formulario: comida + lista del día
│   │   │   └── SleepForm.tsx       # Formulario: horas y calidad de sueño
│   │   └── sueno/
│   │       └── Sueno.tsx           # Métricas de sueño + bar chart 14 días
│   │
│   └── lib/                        # Núcleo de lógica de negocio y utilidades
│       ├── constants.ts            # Objetivos, grupos musculares, colores, rutinas
│       ├── repositories.ts         # (Reservado para futura capa de datos)
│       ├── services.ts             # Servicios: Health, Nutrition, Training, Sleep
│       ├── store.ts                # Zustand store con persist middleware
│       ├── types.ts                # Interfaces y tipos TypeScript
│       └── utils.ts                # Utilidades: fechas, clases CSS, IDs, math
│
├── next.config.mjs                 # Config Next.js (SSG export, trailing slash)
├── tailwind.config.ts              # Tema, colores, animaciones
├── tsconfig.json                   # TypeScript (strict, path alias @/*)
├── postcss.config.js               # PostCSS (tailwindcss, autoprefixer)
├── package.json                    # Dependencias y scripts
└── package-lock.json               # Lock file
```

---

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm run dev` | Servidor local con HMR en `localhost:3000` |
| Build | `npm run build` | Genera el build de producción estático en `/out` |
| Start | `npm run start` | Inicia el servidor Next.js (no aplica con SSG export) |
| Lint | `npm run lint` | Ejecuta ESLint en todo el proyecto |

---

## 🧪 Testing

**No aplica actualmente.**

El proyecto no cuenta con una suite de pruebas automatizadas. Las funcionalidades han sido validadas manualmente durante el desarrollo.

### Testing manual recomendado

Para verificar el correcto funcionamiento antes de hacer build:

```bash
# 1. Iniciar el servidor de desarrollo
npm run dev

# 2. Verificar en el navegador:
#    - Registrar un día completo (peso, comida, ejercicio, sueño)
#    - Confirmar que el Dashboard refleja los datos
#    - Recargar la página y verificar que los datos persisten
#    - Probar en viewport móvil (< 768px) con las devtools

# 3. Correr el linter
npm run lint
```

### Próximas incorporaciones de testing

- Unit tests con **Vitest** para los servicios en `lib/services.ts`
- Tests de componentes con **React Testing Library**
- E2E con **Playwright**

---

## 🗺️ Roadmap

### v1.1 — Mejoras de UX
- [ ] Edición inline de ejercicios y comidas registrados
- [ ] Selección de fecha para registros retrospectivos
- [ ] Modo oscuro (dark mode)
- [ ] Animaciones de transición entre páginas

### v1.2 — Funcionalidades de datos
- [ ] Exportación de datos a CSV / JSON
- [ ] Importación de datos desde archivo de respaldo
- [ ] Múltiples perfiles de usuario en el mismo dispositivo

### v1.3 — Entrenamiento avanzado
- [ ] Plantillas de rutinas personalizables
- [ ] RPE (Rate of Perceived Exertion) por serie
- [ ] Gráficos de progresión para cualquier ejercicio (no solo bench press)

### v2.0 — Backend opcional
- [ ] Sincronización opcional con backend (Supabase / Firebase)
- [ ] Autenticación para acceso multi-dispositivo
- [ ] API REST para integración con apps de terceros (wearables, etc.)

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

### 1. Fork y rama

```bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/TU_USUARIO/gym-traker.git
cd gym-traker
git checkout -b feature/nombre-de-tu-feature
```

### 2. Instalar y desarrollar

```bash
npm install
npm run dev
```

### 3. Convenciones de código

- **TypeScript estricto**: no usar `any` salvo casos excepcionales documentados.
- **Componentes**: funcionales con hooks; no clases.
- **Estilos**: solo Tailwind CSS; no CSS-in-JS ni archivos `.module.css`.
- **Nomenclatura**: PascalCase para componentes, camelCase para funciones y variables, kebab-case para archivos de configuración.
- **Commits**: seguir [Conventional Commits](https://www.conventionalcommits.org/):
  ```
  feat: añadir exportación de datos a CSV
  fix: corregir cálculo de promedio semanal de sueño
  refactor: extraer lógica de gráficos a hook personalizado
  ```

### 4. Proceso de Pull Request

1. Asegurarse de que `npm run lint` pasa sin errores.
2. Probar los cambios manualmente en desktop y móvil.
3. Abrir un Pull Request con descripción clara del cambio y capturas de pantalla si aplica.
4. El PR debe tener como base la rama `master`.

### 5. Reporte de bugs

Usa las [GitHub Issues](https://github.com/lacabrazapa/gym-traker/issues) con la plantilla de bug report. Incluir:
- Pasos para reproducir el problema
- Comportamiento esperado vs. actual
- Navegador y versión de SO

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

```
MIT License — Copyright (c) 2024 Emanuel Cabrera Novoa

Se permite el uso, copia, modificación y distribución del software
sin restricción, sujeto a la inclusión del aviso de copyright.
```

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <b>Emanuel Cabrera Novoa</b><br/>
      <a href="mailto:lacabrazapa@gmail.com">lacabrazapa@gmail.com</a><br/>
      <a href="https://github.com/lacabrazapa">@lacabrazapa</a>
    </td>
  </tr>
</table>

---

<div align="center">

**¿Encontraste útil este proyecto?** Dale una ⭐ en GitHub.

Made with ❤️ and TypeScript

</div>
