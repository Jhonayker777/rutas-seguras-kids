# 🚌 Rutas Seguras Kids

Sistema de gestión de rutas escolares desarrollado con HTML, CSS y JavaScript Vanilla.

Permite administrar rutas de transporte escolar, asignar estudiantes a cada ruta y visualizar información climática en tiempo real mediante una API externa.

---

## 📌 Objetivo

Desarrollar una aplicación frontend que permita gestionar rutas escolares aplicando conceptos fundamentales de JavaScript moderno como:

- Manipulación del DOM
- Eventos personalizados
- Programación asíncrona
- Consumo de APIs
- Web Components
- Shadow DOM
- LocalStorage
- Responsive Design

---

## 🚀 Funcionalidades

### Gestión de Rutas

- Crear rutas escolares.
- Editar rutas existentes.
- Eliminar rutas.
- Registrar conductor.
- Registrar hora de salida.

### Gestión de Estudiantes

- Asignar estudiantes a una ruta.
- Eliminar estudiantes de una ruta.
- Visualización dinámica de estudiantes por ruta.

### Estadísticas

- Total de rutas registradas.
- Total de estudiantes.
- Promedio de estudiantes por ruta.

### Persistencia

Los datos permanecen almacenados mediante:

```javascript
localStorage
```

permitiendo conservar la información incluso después de cerrar el navegador.

---

## 🌦️ Integración con API

Se implementó consumo de API utilizando:

```javascript
fetch()
async/await
```

Características:

- Obtención automática de ubicación mediante Geolocation API.
- Consulta del clima actual.
- Información mostrada:
  - Temperatura
  - Sensación térmica
  - Humedad
  - Velocidad del viento
  - Ciudad y país

API utilizada:

WeatherAPI

---

## 🧩 Web Components

El proyecto implementa un componente reutilizable:

```html
<div-tarjeta></div-tarjeta>
```

Características:

- Shadow DOM
- Template HTML
- Encapsulamiento de estilos
- Reutilización de componentes

---

## 🔔 Eventos Personalizados

Se implementaron eventos personalizados mediante:

```javascript
CustomEvent
```

Eventos utilizados:

```javascript
editar-tarjeta
eliminar-tarjeta
estudiante-removido
```

---

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- LocalStorage
- WeatherAPI
- Geolocation API
- Web Components
- Shadow DOM
- Git
- GitHub

---

## 📂 Estructura del Proyecto

```bash
proyecto-javaScript/
|
├── frontend/
|   ├── index.html
|   ├── css/
│
├── js/
│   └── app.js
│
│
└── README.md
```

---

## ⚙️ Instalación

### Clonar repositorio

```bash
git clone https://github.com/Jhonayker777/proyecto-javaScript.git
```

### Ingresar al proyecto

```bash
cd proyecto-javaScript
```

### Ejecutar

Abrir:

```bash
index.html
```

o ejecutar mediante Live Server.

---

## 📱 Responsive Design

El proyecto se adapta a diferentes tamaños de pantalla:

- 📱 Mobile
- 📲 Tablet
- 💻 Desktop

Utilizando Media Queries.

---

## 📸 Capturas de Pantalla

### Página Principal

![alt text](/img/image.png)

### Rutas agregadas

![alt text](/img/image-1.png)

### Estudiantes agregados

![alt text](/img/image-2.png)

### Clima cargado

![alt text](/img/image-3.png)

### Vista Responsive

![alt text](/img/image-4.png)

---

## 💡 Retos Técnicos

Durante el desarrollo se implementaron conceptos avanzados de JavaScript:

- Creación de Web Components.
- Comunicación entre Shadow DOM y DOM principal.
- Eventos personalizados.
- Persistencia con LocalStorage.
- Integración con API externa.
- Manejo de asincronía con async/await.
- Geolocalización del navegador.

---

## 👨‍💻 Autor

**Jhonayker Quintero**



---

## 📄 Licencia

Proyecto desarrollado con fines académicos para demostrar habilidades en desarrollo Frontend utilizando JavaScript Vanilla.