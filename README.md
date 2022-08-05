# Muévete API

API REST para la aplicación web Muévete APP inspirada en la iniciativa solidaria
"Muévete por los que no pueden" y que se desarrolla como proyecto TFG.

## Requisitos para desarrollo y despliegue local

El entorno de desarrollo local debe contar con el siguiente software instalado.

- Deno v1.13.2
- MongoDB +v4.4.0

```
$ git clone https://github.com/mrf1989/muevete-api.git
```

Se debe crear un archivo `.env` en el directorio raíz del proyecto y configurar
las variables de entorno requeridas:

- `PORT`: puerto que se utilizará en el despliegue local del entorno de
  desarrollo.
- `MONGODB_URI`: URI de conexión a la base de datos MongoDB que se utiliza.

Puede seguirse el ejemplo mostrado en `.env.example`.

### Ejecutar la aplicación

Es necesario tener configuradas las variables de entorno en `.env` y tener
activado el servicio de MongoDB.

La aplicación se ejecuta mediante el siguiente comando, desde el directorio raíz
del proyecto:

```
$ deno run -c ./tsconfig.json --allow-net --allow-env --allow-read --unstable ./src/app.ts
```

También es posible disponer del proyecto en ejecución y que este se vuelva a ejecutar de forma automática ante cualquier cambio en el código. Esto mejora y agiliza la experiencia de desarrollo.

Esto es posible a través del módulo denon. Para instalarlo en el entorno de desarrollo local, debe ejecutarse el siguiente comando:

```
$ deno install -qAf --unstable https://deno.land/x/denon@2.4.8/denon.ts
```

Toda la configuración de denon está en el archivo `scripts.config.ts`.

Una vez instalado, solo será necesario ejecutar `denon start` para ejecutar el proyecto y que quede en estado de escucha ante cualquier cambio.

### Ejecutar los tests

Los tests del sistema se ejecutan a través desde el siguiente comando, desde el
directorio raíz del proyecto:

```
$ deno test -c ./tsconfig.json --allow-net --allow-env --allow-read --unstable
```

También es posible ejecutar los tests con denon, a través del comando `denon test`, lo que hará que los tests se lancen automáticamente ante cualquier cambio.
