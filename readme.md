Cosas que hace este proyecto:

Utiliza nodejs, express y MongoDb Atlas, Mongoose, Multer, Handlebars y Websockets.

Para implemntar el backend de un ecommerce con carrito, productos y un chat.

Utilza Postman para las pruebas de CRUD en cada coleccion.

Separa un cliente para el chat y otro para los productos.

En el endpoint /products lista los productos en la base
En el endpoint /products/realtimeproducts muestra el formulario para dar de alta un producto y la lista actualizada con el producto dado de alta.Tambien en la lista se permite dar de baja un producto.

En el endpoint /products/chat permite ingresar un usuario al chat e intercambiar mensajes con otros usuarios.

Errores que no crashean la aplicacion:

Al listar los productos da un warning que para evitarlo hay que setear una variable.
Al listar los productos en tiempo real da un error porque se ejecuta el socket on de los mensajes del chat pero no crashea la aplicacion.