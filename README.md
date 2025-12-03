# Patentes - Bingo de Patentes Argentinas

Aplicación Next.js 14 con Prisma y SQLite para jugar a completar todas las patentes (000-999) dentro de salas colaborativas. Incluye autenticación simple con usuario y contraseña y una interfaz con estética Windows 98.

## Requisitos
- Node.js 18+
- SQLite (incluido por defecto)

## Configuración inicial
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo de entorno y ajusta los valores si es necesario:
   ```bash
   cp .env.example .env
   ```
3. Genera el cliente de Prisma y aplica la migración inicial:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Características
- Registro e inicio de sesión con contraseña hasheada con bcrypt.
- Gestión de salas con modos Dual, Aleatorio y Solo Ascendente.
- Invitaciones por enlace (`/rooms/[id]?join=1`).
- Registro de patentes encontradas con control de duplicados.
- Generación de ejemplos de patentes en formato viejo y nuevo.
- Tabla ordenable de hallazgos y barra de progreso.
- Componentes reutilizables con estilo Windows 98 (`Win98Window`, `Win98Button`, `Win98Input`, `Win98Card`, `Win98Progress`).

## Notas técnicas
- Las sesiones se almacenan en una cookie HTTP-only firmada con JWT.
- El esquema de Prisma define las relaciones entre usuarios, salas, miembros y registros de patentes con unicidad por sala y número.
- Los server actions se utilizan para registro, login, creación de salas y registro de patentes.
