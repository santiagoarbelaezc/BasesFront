# Sistema de Exámenes en Línea (School Bases)

## Resumen del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web destinada a facilitar a los docentes de una institución educativa la creación y gestión de exámenes o quizes en línea para los estudiantes.

La plataforma permite:

- Crear exámenes organizados por temas, incorporando preguntas de distintos tipos.
- Construir bancos de preguntas que podrán ser utilizadas de manera automática o manual en la elaboración de exámenes.
- Determinar si las preguntas serán públicas (visibles a otros docentes) o privadas.
- Configurar parámetros del examen como el tiempo disponible, cantidad de preguntas y fechas de disponibilidad.
- Calificar automáticamente a los estudiantes tras la presentación del examen y proporcionar retroalimentación.
- Generar estadísticas detalladas por examen, tema, grupo y estudiante (porcentaje de respuestas correctas/incorrectas, promedio de notas, notas máximas y mínimas, entre otros).
- Administrar la matrícula de estudiantes en cursos, ver planes de estudio, horarios de clases, y programación de evaluaciones.
- Ofrecer a los docentes la posibilidad de revisar y mejorar las preguntas de baja tasa de respuesta correcta.
- Registro de usuarios (estudiantes y docentes).
- Visualización de horarios de clases y fechas de exámenes.
- Reportes exportables sobre el desempeño de los estudiantes y grupos.
- Nuevos reportes personalizados según las necesidades de la institución.

---

## Componentes Relacionados con Exámenes

### ExamListComponent
- Muestra la lista de exámenes disponibles.
- Permite buscar y filtrar exámenes por tema y categoría.

### ExamDetailComponent
- Presenta los detalles de un examen, incluyendo descripción, número de preguntas y tiempo límite.
- Permite al profesor editar el examen.

### ExamFormComponent
- Formulario para crear o editar un examen.
- Permite elegir preguntas desde el banco de preguntas o añadir nuevas.

### ExamPresentationComponent
- Se usa cuando el estudiante presenta un examen.
- Genera las preguntas de forma aleatoria (si aplica) y gestiona el temporizador.

### ExamResultComponent
- Muestra los resultados de un examen después de su presentación.
- Proporciona retroalimentación al estudiante.

---

## Componentes de Preguntas

### QuestionBankComponent
- Lista todas las preguntas disponibles en el sistema.
- Permite filtrar por tema y nivel de dificultad.

### QuestionFormComponent
- Formulario para crear o editar preguntas con múltiples opciones.
- Permite configurar el porcentaje de peso en la calificación.

### QuestionPreviewComponent
- Vista previa de una pregunta para que el profesor verifique su correcta creación.

---

## Componentes de Usuario

### LoginComponent
- Maneja la autenticación de usuarios.
- Redirige al usuario según su rol (Profesor/Estudiante).

### ProfileComponent
- Muestra información del usuario (nombre, rol, estadísticas de desempeño).

### RegisterComponent
- Permite a nuevos usuarios registrarse en el sistema.
- Guarda la información de los estudiantes en grupos y asigna cursos.

---

## Componentes de Estadísticas y Reportes

### StatisticsComponent
- Presenta gráficos sobre el desempeño de los exámenes por grupo, tema y estudiante.

### ReportComponent
- Permite generar y descargar reportes con estadísticas detalladas.

---

## Otros Componentes Útiles

### TimerComponent
- Controla el tiempo restante en la presentación de un examen.

### NotificationComponent
- Muestra notificaciones en tiempo real sobre cambios, resultados y recordatorios.

### ScheduleComponent
- Muestra el calendario de horarios y fechas de exámenes para estudiantes y profesores.

---

## Extras

- **Servicios (Services):** Se utilizan servicios como `ExamService`, `QuestionService`, y `AuthService` para manejar la comunicación con la API.
- **Guardias (Guards):** Se implementa `AuthGuard` para restringir el acceso a ciertas rutas según el tipo de usuario (Profesor o Estudiante).

