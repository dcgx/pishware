## 2) Manual Técnico

### Objetivo
Entregar a los equipos técnicos la información necesaria para instalar, configurar y mantener Pishware en distintos entornos (desarrollo, pruebas, producción), asegurando reproducibilidad y escalabilidad.

### Descripción
Documento técnico orientado a Devs y DevOps. Detallará dependencias, configuraciones, despliegue y buenas prácticas de seguridad.

### Índice propuesto
1. Visión general de la arquitectura
   - Diagramas lógicos y de despliegue
2. Requisitos previos y dependencias
   - Node.js, NestJS, Vue 3, Supabase, SMTP
   - Docker y Docker Compose
3. Configuración de entornos
   - Variables de entorno (`.env`)
   - Conexiones a base de datos y servicios externos
4. Instalación y ejecución local
   - Clonado del repositorio y ejecución de contenedores
5. Configuración de servicios principales
   - Backend (NestJS)
   - Frontend (Vue 3)
   - Supabase y PostgreSQL
   - SMTP y perfiles de envío
6. Despliegue en producción
   - Construcción de imágenes, tagging y registro
   - Orquestación (Kubernetes recomendado)
7. Seguridad y cumplimiento
   - Gestión de secretos, rotación de claves
   - Políticas de mínimos privilegios
8. Operación y soporte
   - Logs, métricas y monitoreo
   - Manejo de errores y reintentos
9. Mantenimiento y actualizaciones
   - Estrategia de versiones y changelog
10. Troubleshooting y FAQ técnico

### Criterios de aceptación
- Tiempo de instalación en entorno limpio ≤ 30 minutos.
- 100% de servicios funcionando en primera ejecución con Docker Compose.

### Métricas de éxito
- Éxito ≥ 90% en pruebas de CI/CD.
- Documentación validada en despliegue piloto.

---

## 3) Cronograma de elaboración
- Semana 1: Borrador de índices y recopilación de capturas/diagramas.
- Semana 2: Redacción del Manual de Usuario.
- Semanas 3–4: Redacción del Manual Técnico y validaciones.
- Semana 5: QA documental, ajustes y publicación final en PDF.

---