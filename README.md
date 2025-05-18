````markdown
## Documentación Completa de la API – Parcial Práctico No. 2

Esta documentación detalla todos los endpoints disponibles para gestionar estudiantes, actividades y reseñas en el sistema.

---

## 1. Estudiantes

### 1.1 Crear Estudiante

- **Método:** `POST`  
- **URL:** `http://localhost:3000/estudiantes`  
- **Headers:**  
  - `Content-Type: application/json`  
- **Body (raw JSON):**
  ```json
  {
    "cedula": 123456780,
    "nombre": "Angel Farfan",
    "correo": "a.farfana@uniandes.edu.co",
    "programa": "Ingeniería",
    "semestre": 5
  }
````

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
  * **400 Bad Request**:

    * Correo inválido (sin ‘@’)
    * Semestre fuera de rango \[1–10]

---

### 1.2 Obtener Estudiante por ID

* **Método:** `GET`
* **URL:** `http://localhost:3000/estudiantes/{id}`
* **Parámetros de ruta:**

  * `id` (number) – Identificador del estudiante
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
  * **404 Not Found**: Estudiante no encontrado

---

### 1.3 Inscribir Estudiante en Actividad

* **Método:** `POST`
* **URL:** `http://localhost:3000/estudiantes/{estudianteId}/inscribir/{actividadId}`
* **Parámetros de ruta:**

  * `estudianteId` (number) – ID del estudiante
  * `actividadId` (number) – ID de la actividad
* **Respuestas:**

  * **200 OK**: Devuelve la actividad con el estudiante agregado
  * **404 Not Found**:

    * Estudiante no encontrado
    * Actividad no encontrada
  * **400 Bad Request**:

    * Actividad no está abierta (`estado !== 0`)
    * Estudiante ya inscrito
    * Cupo agotado

---

## 2. Actividades

### 2.1 Crear Actividad

* **Método:** `POST`
* **URL:** `http://localhost:3000/actividades`
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
* **Validaciones:**

  * `titulo`: mínimo 15 caracteres; solo letras, números y espacios
* **Respuestas:**

  * **201 Created**

    ```json
    {
      "id": 3,
      "titulo": "Taller de Programacion Avanzada",
      "fecha": "2025-06-01T10:00:00.000Z",
      "cupoMaximo": 1,
      "estado": 0
    }
    ```
  * **400 Bad Request**: Título inválido

---

### 2.2 Cambiar Estado de Actividad

* **Método:** `PATCH`
* **URL:** `http://localhost:3000/actividades/{id}/estado/{nuevoEstado}`
* **Parámetros de ruta:**

  * `id` (number) – ID de la actividad
  * `nuevoEstado` (0|1|2) –

    * `1` = cerrar (≥ 80 % cupo ocupado)
    * `2` = finalizar (cupo lleno)
* **Respuestas:**

  * **200 OK**: Actividad actualizada
  * **400 Bad Request**:

    * No cumple requisito de cupo
    * Estado inválido
  * **404 Not Found**: Actividad no encontrada
* **Ejemplo de error:**

  ```json
  HTTP/1.1 400 Bad Request
  {
    "message": "No cumple 80% del cupo para cerrar",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

### 2.3 Listar Actividades por Fecha

* **Método:** `GET`
* **URL:** `http://localhost:3000/actividades?fecha={ISO_DATE}`
* **Query Params:**

  * `fecha` – Fecha exacta (ISO 8601), e.g. `2025-06-01T10:00:00.000Z`
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
  * Array vacío si no hay actividades en esa fecha

---

## 3. Reseñas

### 3.1 Crear Reseña

* **Método:** `POST`
* **URL:** `http://localhost:3000/resenas`
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
* **Reglas de negocio:**

  1. La actividad debe existir y `estado === 2`
  2. El estudiante debe estar inscrito en la actividad
* **Respuestas:**

  * **200 OK**: Reseña creada y retornada
  * **404 Not Found**:

    * Estudiante no encontrado
    * Actividad no encontrada
  * **400 Bad Request**:

    * Actividad no finalizada
    * Estudiante no inscrito

---

### 3.2 Obtener Reseña por ID

* **Método:** `GET`
* **URL:** `http://localhost:3000/resenas/{id}`
* **Parámetros de ruta:**

  * `id` (number) – ID de la reseña
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
  * **404 Not Found**: Reseña no encontrada

---

```
```

