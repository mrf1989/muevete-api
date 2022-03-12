# Muévete API

API REST para la aplicación web Muévete inspirada en la iniciativa solidaria "Muévete por los que no pueden" y que se desarrolla como proyecto TFG.

## Requisitos para desarrollo y despliegue local

El entorno de desarrollo local debe contar con el siguiente software instalado.

- Deno v1.13.2
- MongoDB v5.0.6

```
git clone https://github.com/mrf1989/muevete-api.git
```

Se debe crear un archivo `.env` en el directorio raiz del proyecto y configurar las variables de entorno requeridas:

- `PORT`: puerto que se utilizará en el despliegue local del entorno de desarrollo.
- `MONGODB_URI`: URI de conexión a la base de datos MongoDB que se utiliza.

Puede seguirse el ejemplo mostrado en `.env.example`.
