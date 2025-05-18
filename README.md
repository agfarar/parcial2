## Documentación Completa de la API - Parcial Práctico No.2

---

## 1. Estudiantes

### 1.1 Crear Estudiante

* **Método:** `POST`
* **Ruta:** `/estudiantes`
* **Descripción:** Registra un nuevo estudiante.
* **Headers:**

  * `Content-Type: application/json`
* **Body:**

  ```json
  {
    "cedula": 123456780,
    "nombre": "Angel Farfan",
    "correo": "a.farfana@uniandes.edu.co",
    "programa": "Ingeniería",
    "semestre": 5
  }
  ```
* **Respuestas:**

  * **201 Created**

    ```json
    {
      "id": 1,
      "cedula": 123456780,
      "nombre": "Angel Farfan",
      "correo": "a.farfana@uniandes.edu.co",
      "programa": "Ingeniería",
      "semestre": 5
    }
    ```
  * **400 Bad Request**: Datos inválidos (correo sin `@`, semestre fuera de 1–10).

---

### 1.2 Obtener Estudiante por ID

* **Método:** `GET`
* **Ruta:** `/estudiantes/{id}`
* **Descripción:** Recupera la información de un estudiante y sus actividades inscritas.
* **Parámetros de ruta:**

  * `id` (number) - Identificador del estudiante.
* **Respuestas:**

  * **200 OK**

    ```json
    {
      "id": 1,
      "cedula": 123456780,
      "nombre": "Angel Farfan",
      "correo": "a.farfana@uniandes.edu.co",
      "programa": "Ingeniería",
      "semestre": 5,
      "actividades": []
    }
    ```
  * **404 Not Found**: Estudiante no encontrado.

---

### 1.3 Inscribir Estudiante en Actividad

* **Método:** `POST`
* **Ruta:** `/estudiantes/{id}/inscribir/{actId}`
* **Descripción:** Inscribe a un estudiante existente en una actividad abierta.
* **Parámetros de ruta:**

  * `id` (number) - ID del estudiante.
  * `actId` (number) - ID de la actividad.
* **Respuestas:**

  * **200 OK**: Devuelve la entidad de la actividad con el estudiante agregado.
  * **404 Not Found**: Estudiante o actividad no encontrados.
  * **400 Bad Request**: Actividad cerrada, estudiante ya inscrito o cupo agotado.

---

## 2. Actividades

### 2.1 Crear Actividad

* **Método:** `POST`
* **Ruta:** `/actividades`
* **Descripción:** Registra una nueva actividad.
* **Headers:**

  * `Content-Type: application/json`
* **Body:**

  ```json
  {
    "titulo": "Taller de Programacion Avanzada",
    "fecha": "2025-06-01T10:00:00.000Z",
    "cupoMaximo": 1,
    "estado": 0
  }
  ```
* **Validaciones de negocio:**

  * `titulo` debe tener al menos 15 caracteres y solo letras, números y espacios.
* **Respuestas:**

  * **201 Created**

    ```json
    {
      "id": 3,
      "titulo": "Actividad Practica de Base de Datos",
      "fecha": "2025-05-20T10:00:00.000Z",
      "cupoMaximo": 30,
      "estado": 0
    }
    ```
  * **400 Bad Request**: Título inválido.

---

### 2.2 Cambiar Estado de Actividad

* **Método:** `PATCH`
* **Ruta:** `/actividades/{id}/estado/{estado}`
* **Descripción:** Cambia el estado de una actividad:

  * `1` → Cerrar (solo si ≥80% de cupo ocupado).
  * `2` → Finalizar (solo si cupo lleno).
* **Parámetros de ruta:**

  * `id` (number) - ID de la actividad.
  * `estado` (0|1|2) - Nuevo estado.
* **Respuestas:**

  * **200 OK**: Actividad con estado actualizado.
  * **400 Bad Request**: No cumple reglas de porcentaje/cupo o estado inválido.
  * **404 Not Found**: Actividad no encontrada.

**Ejemplo de error:**

```json
HTTP 400 Bad Request
{
  "message": "No cumple 80% del cupo para cerrar",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 2.3 Listar Actividades por Fecha

* **Método:** `GET`
* **Ruta:** `/actividades`
* **Descripción:** Devuelve todas las actividades programadas para la fecha indicada.
* **Query Params:**

  * `fecha` (ISO 8601 string) - Fecha exacta de la actividad.
* **Respuestas:**

  * **200 OK**

    ```json
    [
      {
        "id": 9,
        "titulo": "Taller de Programacion Avanzada",
        "fecha": "2025-06-01T10:00:00.000Z",
        "cupoMaximo": 1,
        "estado": 0,
        "estudiantes": []
      }
    ]
    ```
  * **200 OK** (array vacío) si no hay actividades en esa fecha.

**Ejemplo de petición:**

```bash
curl --location 'http://localhost:3000/actividades?fecha=2025-06-01T10%3A00%3A00.000Z'
```

---

## 3. Reseñas

### 3.1 Crear Reseña

* **Método:** `POST`
* **Ruta:** `/resenas`
* **Descripción:** Adiciona una reseña a una actividad finalizada por un estudiante inscrito.
* **Headers:**

  * `Content-Type: application/json`
* **Body:**

  ```json
  {
    "comentario": "¡Excelente taller, aprendí mucho sobre NestJS!",
    "calificacion": 5,
    "fecha": "2025-05-01T10:00:00.000Z",
    "estudianteId": 1,
    "actividadId": 1
  }
  ```
* **Reglas de negocio:**

  1. La actividad debe existir y `estado === 2`.
  2. El estudiante debe estar inscrito en esa actividad.
* **Respuestas:**

  * **200 OK**: Reseña creada.
  * **404 Not Found**: Estudiante o actividad no encontrados.
  * **400 Bad Request**: Actividad no finalizada o estudiante no inscrito.

---

### 3.2 Obtener Reseña por ID

* **Método:** `GET`
* **Ruta:** `/resenas/{id}`
* **Descripción:** Recupera una reseña con sus relaciones (`estudiante`, `actividad`).
* **Parámetros de ruta:**

  * `id` (number) - Identificador de la reseña.
* **Respuestas:**

  * **200 OK**

    ```json
    {
      "id": 1,
      "comentario": "¡Excelente taller, aprendí mucho sobre NestJS!",
      "calificacion": 5,
      "fecha": "2025-05-01T10:00:00.000Z",
      "estudiante": { /* datos del estudiante */ },
      "actividad": { /* datos de la actividad */ }
    }
    ```
  * **404 Not Found**: Reseña no encontrada.

---

*Fin de la documentación.*

