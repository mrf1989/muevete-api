echo "Importando conjuntos de datos de prueba como carga inicial del sistema..."

mongoimport --db=muevete --collection=usuarios --file=./usuarios.json
mongoimport --db=muevete --collection=eventos --file=./eventos.json
mongoimport --db=muevete --collection=articulos --file=./articulos.json
mongoimport --db=muevete --collection=dorsales --file=./dorsales.json
mongoimport --db=muevete --collection=usuarios --file=./usuarios.json

echo "Database populated! Enjoy!"