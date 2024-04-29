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

  io.on("connection", handleConnection);
  //  Maneja la conexion y cuando un cliente se conecta al servidor se llama a la funcion handleConnection)

  async function handleConnection(socket) {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    // Publicaa los productos y se pone a escuchar los eventos
    emitProducts(socket);
    // Publicaa los mensajes tambien. Si lo saco el nuevo cliente ve los mensajes cuando se identifica
    // y escribe un mensaje.
   // emitMessage(socket);
    
    
    // En el endpoint realtimeproducts a traves del viewsrouter correspondiente
    // recibe los emit del add o el delete
    socket.on("add", async (product) => {
      console.log("producto a agregar en socket:", product);
      await addProductAndEmit(product);
    });

    socket.on("delete", async (id) => {
      console.log("ID del producto a eliminar en socket:", id);
      await deleteProductAndEmit(id);
    });
  }

  // Emite los productos a los clientes conectados

  async function emitProducts(socket) {
    const productsList = await productManager.getProduct();
    //console.log("Lista de productos con getProduct en socket:", productsList);

    //agrego un pequeño mod para utilizar img por defecto en caso de no tener thumbnail, despues ver si se puede mejorar
    productsList.forEach((product) => {
      if (!product.img || product.img.length === 0) {
        product.img = ["img/noimg.jpg"];
      }
    });

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

  // ACA SE EMITE LOS MENSAJES DEL CHAT COPIA DE PRACTICA DE CHAT MAS EMIT DE MENSAJES ANTERIORES AL CONECTARSE AL SERVIDOR
  // Da un error cuando se recarga la ruta de realtimeproducts porque quiere emitir un mensaje vacio

  io.on("connection", socket => {
    // El servidor socket guarda la id de cada cliente que se comunica
   // chatgpt saca el io.on

    socket.on("message", async (data) => {
      // Da un error cuando se carga o recarga la ruta de realtimeproducts porque quiere emitir un
      // mensaje vacio en ${data.message} pero no crashea
      console.log(`Mensaje en socket: ${data.message}`);
      // guardo el nuevo mensaje  y emito todos los mensajes recibidos
      try {
        // Agegar el nuevo mensaje 
        await messageManager.addMessage(data);

        // Obtener todos los mensajes
        const messages = await messageManager.getMessages();

        // Emitir los mensajes mas el nuevo
        io.emit("messagesLogs", messages);
        //emitMessage(socket); No actualiza todos los clientes, solo el que escribe el mensaje

      } catch (error) {
        console.error("Error al agregar el mensaje: ", error);
        // Emitir mensaje de error al cliente
        socket.emit("statuserror", "Error al procesar el mensaje")
      }


    });
  });

  // No la llamo para que el cliente vea los mensajes anteriores cuando se identifique
  async function emitMessage(socket) {
    const messageList = await messageManager.getMessages();
    console.log("Lista de mensajes con getmessages en socket:", messageList);

    socket.emit("messagesLogs", messageList);
  }
}
