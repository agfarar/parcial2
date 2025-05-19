## Documentación Completa de la API - Parcial Práctico No.2

Base URL: `{{base_url}}`, por ejemplo `http://localhost:3000`

---

## 1. Estudiantes

### 1.1 Crear Estudiante

* **Método:** `POST`
* **URL:** `{{base_url}}/estudiantes`
* **Headers:**

  * `Content-Type: application/json`
* **Body (raw JSON):**

  ```json
  {
    "cedula": 123456780,
    "nombre": "Angel Farfan",
    "correo": "a.farfana@uniandes.edu.co",
    "programa": "Ingeniería",
    "semestre": 5
  }
  ```

**Ejemplos de respuesta:**

* **201 Created** – Creación exitosa

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

* **400 Bad Request** – Validación falla (Email inválido, semestre fuera de rango)

  ```json
  {
    "message": "Email inválido",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

### 1.2 Obtener Estudiante por ID

* **Método:** `GET`
* **URL:** `{{base_url}}/estudiantes/{id}`
* **Parámetros de ruta:**

  * `id` (number) – ID del estudiante.

**Ejemplos de respuesta:**

* **200 OK** – Estudiante encontrado

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

* **404 Not Found** – Estudiante no existe

  ```json
  {
    "message": "Estudiante no encontrado",
    "error": "Not Found",
    "statusCode": 404
  }
  ```

### 1.3 Inscribir Estudiante en Actividad

* **Método:** `POST`
* **URL:** `{{base_url}}/estudiantes/{id}/inscribir/{actId}`
* **Parámetros de ruta:**

  * `id` – ID del estudiante.
  * `actId` – ID de la actividad.

**Ejemplos de respuesta:**

* **200 OK** – Inscripción exitosa (devuelve objeto de la actividad actualizada)

  ```json
  {
    "id": 2,
    "titulo": "Actividad Practica de Base de Datos",
    "fecha": "2025-05-20T10:00:00.000Z",
    "cupoMaximo": 30,
    "estado": 0,
    "estudiantes": [
      {
        "id": 1,
        "cedula": 123456780,
        "nombre": "Angel Farfan",
        "correo": "a.farfana@uniandes.edu.co",
        "programa": "Ingeniería",
        "semestre": 5
      }
    ]
  }
  ```

* **404 Not Found** – Estudiante o actividad no encontrados (no devuelve body)

  ```http
  HTTP/1.1 404 Not Found
  ```

* **400 Bad Request** – Actividad cerrada, estudiante ya inscrito o sin cupo disponible

  ```json
  {
    "message": "Actividad no está abierta",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

## 2. Actividades

### 2.1 Crear Actividad

* **Método:** `POST`
* **URL:** `{{base_url}}/actividades`
* **Headers:**

  * `Content-Type: application/json`
* **Body (raw JSON):**

  ```json
  {
    "titulo": "Taller de Programacion Avanzada",
    "fecha": "2025-06-01T10:00:00.000Z",
    "cupoMaximo": 1,
    "estado": 0
  }
  ```

**Ejemplos de respuesta:**

* **201 Created** – Creación exitosa

  ```json
  {
    "id": 10,
    "titulo": "Actividad Practica de Base de Datos",
    "fecha": "2025-05-20T10:00:00.000Z",
    "cupoMaximo": 30,
    "estado": 0
  }
  ```

* **400 Bad Request** – Título inválido

  ```json
  {
    "message": "Título inválido: mínimo 15 caracteres y solo letras, números y espacios",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

### 2.2 Cambiar Estado de Actividad

* **Método:** `PATCH`
* **URL:** `{{base_url}}/actividades/{id}/estado/{estado}`
* **Parámetros de ruta:**

  * `id` – ID de la actividad.
  * `estado` – Valor `1` o `2`.

**Ejemplos de respuesta:**

* **200 OK** – Estado cambiado con éxito

  ```json
  {
    "id": 1,
    "titulo": "Taller de Programacion Avanzada",
    "fecha": "2025-06-01T10:00:00.000Z",
    "cupoMaximo": 1,
    "estado": 2
  }
  ```

* **400 Bad Request** – No cumple reglas de porcentaje/cupo

  ```json
  {
    "message": "No cumple 80% del cupo para cerrar",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

* **404 Not Found** – Actividad no existe

  ```json
  {
    "message": "Actividad no encontrada",
    "error": "Not Found",
    "statusCode": 404
  }
  ```

### 2.3 Listar Actividades por Fecha

* **Método:** `GET`
* **URL:** `{{base_url}}/actividades?fecha={ISO8601}`
* **Query Params:**

  * `fecha` – Fecha exacta en formato ISO 8601.

**Ejemplos de respuesta:**

* **200 OK** – Devuelve lista de actividades en esa fecha

  ```json
  [
    {
      "id": 1,
      "titulo": "Taller de Programacion Avanzada",
      "fecha": "2025-06-01T10:00:00.000Z",
      "cupoMaximo": 1,
      "estado": 2,
      "estudiantes": [
        {
          "id": 1,
          "cedula": 123456780,
          "nombre": "Angel Farfan",
          "correo": "a.farfana@uniandes.edu.co",
          "programa": "Ingeniería",
          "semestre": 5
        }
      ]
    },
    {
      "id": 3,
      "titulo": "Taller de Programacion Avanzada",
      "fecha": "2025-06-01T10:00:00.000Z",
      "cupoMaximo": 1,
      "estado": 0,
      "estudiantes": []
    },
    /* ...otros elementos... */
  ]
  ```

* **200 OK** – Sin parámetro `fecha` o inválido (error interno)

  ```json
  {
    "statusCode": 500,
    "message": "Internal server error"
  }
  ```

---

## 3. Reseñas

### 3.1 Crear Reseña

* **Método:** `POST`
* **URL:** `{{base_url}}/resenas`
* **Headers:**

  * `Content-Type: application/json`
* **Body (raw JSON):**

  ```json
  {
    "comentario": "¡Excelente taller, aprendí mucho sobre NestJS!",
    "calificacion": 5,
    "fecha": "2025-05-01T10:00:00.000Z",
    "estudianteId": 1,
    "actividadId": 1
  }
  ```

**Ejemplos de respuesta:**

* **201 Created** – Reseña creada

  ```json
  {
    "id": 7,
    "comentario": "¡Excelente taller, aprendí mucho sobre NestJS!",
    "calificacion": 5,
    "fecha": "2025-05-01T10:00:00.000Z",
    "estudiante": { /* datos completos */ },
    "actividad": { /* datos completos */ }
  }
  ```

* **404 Not Found** – Estudiante o actividad no encontrados

  ```json
  {
    "message": "Estudiante no encontrado",
    "error": "Not Found",
    "statusCode": 404
  }
  ```

* **400 Bad Request** – Actividad no finalizada o estudiante no inscrito

  ```json
  {
    "message": "Actividad no finalizada",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

### 3.2 Obtener Reseña por ID

* **Método:** `GET`
* **URL:** `{{base_url}}/resenas/{id}`

**Ejemplos de respuesta:**

* **200 OK** – Reseña encontrada

  ```json
  {
    "id": 1,
    "comentario": "¡Excelente taller, aprendí mucho sobre NestJS!",
    "calificacion": 5,
    "fecha": "2025-05-01T10:00:00.000Z",
    "estudiante": { /* datos */ },
    "actividad": { /* datos */ }
  }
  ```

* **404 Not Found** – Reseña no existe

  ```json
  {
    "message": "Reseña no encontrada",
    "error": "Not Found",
    "statusCode": 404
  }
  ```

