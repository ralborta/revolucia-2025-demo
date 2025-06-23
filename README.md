# 🧠 Demo Backend Interactivo para Agentes IA de Empliados (Revolucia 2025)

## 🎯 Descripción del Proyecto

Esta aplicación web simula el funcionamiento de 4 agentes de inteligencia artificial orientados a procesos de back office corporativo. El sistema está diseñado para ser utilizado durante una presentación en el evento Revolucia (26 de junio).

**Características principales:**
- ✅ **Sin dependencias externas**: Utiliza datos históricos simulados almacenados en archivos JSON
- ✅ **Interfaz moderna**: Diseño limpio y profesional con TailwindCSS y shadcn/ui
- ✅ **Funcionalidad interactiva**: Demo de consulta de SKU integrado en la sección de pricing
- ✅ **Despliegue automático**: Configurado para Vercel desde GitHub

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- Resumen visual de métricas de todas las áreas
- Cards informativas con estadísticas en tiempo real
- Navegación intuitiva a todas las secciones

### 🚛 Agente de Logística
- Control de unidades de transporte
- Simulación de recepción de papeletas escaneadas
- Chat simulado con choferes vía WhatsApp
- Recomendaciones IA para optimización de rutas

### 💰 Agente de Pricing
- Análisis de precios de competencia
- Sugerencias inteligentes de precios
- Gráficos de tendencias de ventas
- Integración con análisis de costos
- **🧪 Demo Interactivo Integrado**: Consulta de productos por SKU con análisis en tiempo real

### 🧾 Agente de Conciliación
- Comparación entre registros contables y bancarios
- Validación fiscal automatizada
- Generación de planillas de rendición
- Alertas de inconsistencias

### 📉 Agente de Costos
- Evaluación de costos actuales y proyectados
- Análisis de impacto en pricing
- Recomendaciones de optimización
- Colaboración con otros agentes

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.3.4 (App Router)
- **UI**: TailwindCSS v4 + shadcn/ui
- **Lenguaje**: TypeScript
- **Iconos**: Lucide React
- **Despliegue**: Vercel
- **Datos**: Archivos JSON estáticos

## 📦 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🎮 Cómo Usar el Demo

1. **Dashboard**: Visita la página principal para ver el resumen general
2. **Navegación**: Usa el sidebar para explorar cada agente
3. **Demo Interactivo**: Ve a la sección "Pricing" y haz clic en "Probar Demo"
4. **Exploración**: Cada sección muestra diferentes capacidades de los agentes

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── page.tsx           # Dashboard principal
│   ├── logistica/         # Agente de logística
│   ├── pricing/           # Agente de pricing (con demo integrado)
│   ├── conciliacion/      # Agente de conciliación
│   └── costos/            # Agente de costos
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui
│   ├── Header.tsx        # Header de páginas
│   ├── Sidebar.tsx       # Navegación lateral
│   └── PricingDemo.tsx   # Componente del demo interactivo
├── lib/                  # Utilidades
└── data/                 # Datos simulados
    ├── logistica.json
    ├── pricing.json
    ├── conciliacion.json
    └── costos.json
mock/
└── sku1025.json         # Datos del demo interactivo
```

## 🎨 Características del Demo Interactivo

### Ubicación
- **Integrado en**: Sección "Pricing" del dashboard
- **Acceso**: Botón "Probar Demo" en la página de pricing
- **Navegación**: Botón "Volver al Análisis" para regresar

### Flujo de Usuario
1. **Navegar a Pricing**: Desde el sidebar del dashboard
2. **Activar Demo**: Hacer clic en "Probar Demo"
3. **Input**: Ingresa un SKU (ej: "SKU1025")
4. **Análisis**: Observa las animaciones paso a paso:
   - 🔍 Consultando datos del producto
   - 🧠 Analizando precios de competidores
   - 📈 Evaluando tendencias de mercado
   - 🤖 Agente determinando recomendación
5. **Resultado**: Visualiza el análisis completo con:
   - Comparación de precios
   - Recomendación del agente IA
   - Métricas de mercado
   - Impacto esperado

### Datos Simulados
- **SKU1025**: Producto de ejemplo con análisis completo
- **Análisis detallado**: Incluye tendencias, competidores, stock
- **Historial de precios**: Datos históricos para análisis
- **Métricas de impacto**: Proyecciones de ventas y márgenes

## 🌐 Despliegue

El proyecto está configurado para despliegue automático en Vercel:

1. **Push a GitHub**: Los cambios se despliegan automáticamente
2. **Vercel**: Detecta cambios y construye la aplicación
3. **URL de producción**: Disponible automáticamente

## 📝 Notas Importantes

- **Datos simulados**: Toda la información proviene de archivos JSON
- **Sin APIs reales**: No se conecta a servicios externos
- **Demo educativo**: Diseñado para demostración en presentaciones
- **Responsive**: Funciona en dispositivos móviles y desktop
- **Integración fluida**: El demo está perfectamente integrado en la experiencia de usuario

## 🤝 Contribución

Este proyecto está diseñado específicamente para la presentación en Revolucia 2025. Para contribuciones o mejoras, contacta al equipo de desarrollo.

---

**Desarrollado para Revolucia 2025 - Demo de Agentes IA de Empliados**
