##  Requisitos

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) >= 10

##  Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/ChirimoyaJoyful/Faros-test.git
cd ordenes-compra
````

2. Backend:
```bash
npm install
npm run dev
````
El backend correrá en http://localhost:3000

Endpoints disponibles:

* GET /api/all → Lista todas las órdenes.
* GET /api/:id → Busca una orden por número de OC.
* GET /api/search/:keyvalue → Busca por no_ordencompra, fecha_oc o codigo_ean.
* POST /api/create → Crear una nueva orden.
* PUT /api/update/:id → Actualizar fecha o código EAN de una orden.
* DELETE /api/:id → Eliminar una orden.

3. Frontend:
```bash  
cd frontend
npm install
npm run dev
````
El frontend se abrirá en http://localhost:3001

