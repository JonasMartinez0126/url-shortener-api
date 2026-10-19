# URL shortener API

Una API RESTful de alto rendimiento para acortar URLs y registrar metricas analiticas de clics en tiempo real.
Diseñada bajo principios de **Clean Architecture**, containerizada con **Docker** y con pipeline de
**Integracion Continua (CI)** automatizado.

## Tenologias Utilizadas

- **Backend:** Node.js (ES Module), Express.js
- **Base de datos:** PostgreSQL 15 (Dockerized)
- **Generacion de codigo:** NanoID
- **Pruebas Automatizadas:** Jest, SuperTest
- **DevOps & CI/CD:** Docker Compose, Github Actions
- **Control de Versiones:** Git, GitHub Flow, Branch Protection Rules

## Arquitectura del Proyecto

text
/src
├── /config # Configuración de base de datos (Pool PG) y scripts de init
├── /controllers # Lógica de negocio (Shorten, Redirect, Stats)
├── /routes # Enrutadores Express (/api y raíz)
├── app.js # Configuración de Express y middlewares
└── server.js # Punto de entrada y listener del servidor
/tests # Pruebas de integración HTTP
.github/workflows # Pipeline de CI (GitHub Actions)

## Configuracion e Instalacion Local

### Prerrequisitos

- Node.js (v18+)
- Docker Desktop & Docker Compose

### 1. Clonar el repositorio

bash
git clone https://github.com/TU_USUARIO/url-shortener-api.git
cd url-shortener-api

### 2. Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto en este formato:

PORT=3000
DB_USER=admin
DB_PASSWORD=adminpassword
DB_NAME=url_shortener
DB_HOST=localhost
DB_PORT=5432

### 3. Levantar la base de datos

bash
docker compose up -d

### 4. Inicializar las tablas

bash
npm run db:init

### 5. Iniciar la API en Modo Desarrollo

bash
npm run dev

## Endpoints de la API

| Método | Endpoint           | Descripción                                             | Body / Params                     | Respuesta     |
| :----- | :----------------- | :------------------------------------------------------ | :-------------------------------- | :------------ |
| `GET`  | `/health`          | Verificación de estado de la API                        | N/A                               | `200 OK`      |
| `POST` | `/api/shorten`     | Acorta una URL larga                                    | `{"original_url": "https://..."}` | `201 Created` |
| `GET`  | `/:code`           | Redirige HTTP 302 al enlace original y registra el clic | Param: `code`                     | `302 Found`   |
| `GET`  | `/api/stats/:code` | Obtiene el total de clics y el historial reciente       | Param: `code`                     | `200 OK`      |

## Pruebas Automatizadas (CI/CD)

Para ejecutar el conjunto de pruebas unitarias e integracion en entorno local:
bash
npm test
