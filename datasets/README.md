Se requiere instalar MongoDB Database Tools y referenciar en el PATH del sistema, lo que permite el uso de estas herramientas desde la consola o la terminal.

Para realizar la **exportación** local de los datos de la base de datos MongoDB se utiliza el siguiente comando:

```
$ mongoexport --db=muevete --collection=usuarios --type=json --out=./datasets/usuarios.json
```

Para realizar la **importación** local de los datos a la base datos MongoDB se utiliza el siguiente comando:

```
$ mongoimport --db=muevete --collection=usuarios --file=./datasets/usuarios.json
```

En caso de que se disponga de una base de datos desplegada en MongoDB Atlas Database, la exportanción y la importanción de los datos se hará, de igual manera, con los siguientes comandos:

**Exportación**

```
$ mongoexport --uri "<URI_DE_CONEXIÓN_A_DB>" --collection=articulos --type=json --out=./datasets/articulos.json
```

**Importación**

```
$ mongoimport --uri "<URI_DE_CONEXIÓN_A_DB>" --collection=articulos --file=./datasets/articulos.json
```

Para ambos comandos, `<URI_DE_CONEXIÓN_A_DB>` hace referencia a la URI que facilita el servicio de MongoDB Atlas Database para conectar con la instancia de la base de datos.

Está accesible desde el panel principal, accediendo a "Connect", y eligiendo la opción de "Connect your application". La URI tiene un aspecto parecido a:

```
mongodb+srv://<username>:<password>@muevete-db.zqn8c.mongodb.net/muevete?retryWrites=true&w=majority&authMechanism=SCRAM-SHA-1
```