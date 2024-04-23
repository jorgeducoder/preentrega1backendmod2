// Saco el intercambio del socket con el cliente fuera de app. En app tengo que importarlo
// Cuando pongo a coorer el servidor en APP, se ejecuta io.on 

//import ProductManager from "./dao/productManager.js";
// Cambio el import al de la DB y cambio en el views para que realtimeproducts vea los de la base 
import { ProductManagerMdb } from "./dao/productManagerMdb.js";

export default (io) => {
  const productManager = new ProductManagerMdb();

  io.on("connection", handleConnection);
  //  Maneja la conexion y escucha los clientes conectados
  async function handleConnection(socket) {
    console.log(`Nuevo cliente conectado ${socket.id}`);
    // Publicaa los productos y se pone a escuchar los eventos
    emitProducts(socket);
    
    // En el endpoint realtimeproducts a traves del viewsrouter correspondiente recibe los emit del add o el delete
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
};
