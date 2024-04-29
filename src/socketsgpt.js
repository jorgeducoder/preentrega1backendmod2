// Saco el intercambio del socket con el cliente fuera de app. En app tengo que importarlo
// Cuando pongo a coorer el servidor en APP, se ejecuta io.on 

//import ProductManager from "./dao/productManager.js";
// Cambio el import al de la DB y cambio en el views para que realtimeproducts vea los de la base 
import { ProductManagerMdb } from "./dao/productManagerMdb.js";
import { messageManagerMdb } from "./dao/messageManagerMdb.js";

//La sentencia export default (io) => {  exporta 
// la función desde el archivo sockets.js


export default (io) => {
  const productManager = new ProductManagerMdb();
  const messageManager = new messageManagerMdb();

  //  Maneja la conexion y cuando un cliente se conecta al servidor se llama a la funcion handleConnection)
  io.on("connection", handleConnection);

  function handleConnection(socket) {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    // Publicaa los productos y se pone a escuchar los eventos
    emitProducts(socket);
    // Publicaa los mensajes tambien. Si lo saco el nuevo cliente ve los mensajes cuando se identifica
    // y escribe un mensaje. Que es lo correcto.
    //emitMessages(socket);


    // En el endpoint realtimeproducts a traves del viewsrouter correspondiente
    // recibe los emit del add o el delete
    
    /* Cambio porque no se hace el reset del formulario
    socket.on("add", async (product) => {

      console.log("Producto a agregar en socket:", product);
      await addProductAndEmit(product);
      

    });*/

    socket.on("add", async (product) => {
      try {
        // Guardar el producto en la base de datos
        await addProductAndEmit(product);
        // Emitir el evento "addProductSuccess" al cliente para confirmar que el producto se ha agregado correctamente
        socket.emit("addProductSuccess");
      } catch (error) {
        console.error("Error al guardar el producto:", error);
        // Puedes manejar el error aquí si es necesario
      }
    });

    socket.on("delete", async (id) => {
      console.log("ID del producto a eliminar en socket:", id);
      try {
        await deleteProductAndEmit(id);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
      
    });

    socket.on("message", handleMessage); // Escucha solo los mensajes de chat y da error sin crashear cuando emito realtime...
    
  }

  // Emite los productos a los clientes conectados


  async function emitProducts(socket) {
    const productsList = await productManager.getProduct();
    socket.emit("products", productsList);
  }

  async function addProductAndEmit(product) {
    await productManager.addProduct(product);
    emitProducts(io);
  }

  async function deleteProductAndEmit(id) {
    await productManager.deleteProduct(id);
    emitProducts(io);
  }

  async function emitMessages(socket) { // No la ejecuta porque saco el emit de los mensajes al principio.
    const messageList = await messageManager.getMessages();
    socket.emit("messagesLogs", messageList);
  }
  // Se saca la funcion flecha y se llama desde socket.on(message)
  // Da error Type error porque lo ejecuta el socket de realtime,
   
  async function handleMessage(data) {
    console.log(`Mensaje en socket: ${data.message}`);
    try {
      await messageManager.addMessage(data);
      const messages = await messageManager.getMessages();
      io.emit("messagesLogs", messages);
    } catch (error) {
      console.error("Error al agregar el mensaje:", error);
      socket.emit("statuserror", "Error al procesar el mensaje");
    }
  }
}
