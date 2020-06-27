# Prueba técnica - Desarrollador backend LEAL
## Aspectos a tener en cuenta
* Versión de MySQL 8.0.2
* Versión de npm 6.14.5
* Versión de Node.js 12.18.1

## Dependencias
* Creación de la base de datos y las tablas como se muestra en el archivo ```database/db.sql```
* Instalar las dependencias del package.json con ```npm install```

## Configuración
> Para esta configuración se recomienda usar variables de entorno, pero para facilidad de ejecución y desarrollo se optó por realizarlo de este modo.
* Editar la configuración de la base de datos en el archivo ```src/keys.js```
* Editar el secret key de JWT en el archivo ```src/keys.js```

## Despliegue del servidor
Para desplegar el servidor y continuar con los microservicios de http requests, ejecutar el comando de Node.js ```npm run dev```.

## Información adicional
* La contraseña fue cifrada bajo el estandar SHA256 y con *salt* el md5 del correo del usuario concatenado a la contraseña, dificultando ataques de diccionario.
* Para realizar una transacción, editar el estado o revisar las transacciones y puntos de un usuario, se debe haber iniciado sesión para tener el token de acceso y enviarla en el header.
* Para pruebas en un software de API testing, se adjunta la colección de las 7 peticiones en el archivo ```leal-backend.postman_collection.json```.