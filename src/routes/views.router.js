import { Router } from "express";
//import { ProductManager } from "../dao/productManager.js";

import { ProductManagerMdb } from "../dao/productManagerMdb.js";
import { cartManagerMdb } from "../dao/cartManagerMdb.js";


const router = Router();
//const products = new ProductManager("./src/saborescaseros.json");
const products = new ProductManagerMdb();
const CM = new cartManagerMdb()

router.get("/", async (req, res) => {
  const { limit, page, sort, search } = req.query;

  // Crear el filtro de búsqueda en función del parámetro "search"
  let query = {};
  if (search) {
      // Por ejemplo, buscar productos cuyo nombre coincida con el parámetro "search"
      query = { name: { $regex: search, $options: 'i' } }; // Búsqueda insensible a mayúsculas
  }
  console.log("Estos son los parametros en views.router  ", limit, page, sort, search)
  try {
      const productList = await products.getProduct({ 
          limit: parseInt(limit) || 10, 
          page: parseInt(page) || 1, 
          sort: sort || 'none', 
          query // Pasar el filtro de búsqueda
      });
      
      //res.send(products);
      // renderizo la handlebars definida
      console.log("Esto devuelve el paginate o el find en views.router", productList.title);
     
       res.render("home",
      {
        title: "Productos desde HTML",
        style: "productList.css",
        productList
      }
    );

    
  } catch (error) {
      res.status(500).send({ error: 'Error al obtener productos' });
  }
});



// renderizo form y lista de productos actualizada desde socket
// Accedo a getProductRt porque no uso page, limit, etc.

router.get("/realtimeproducts", async (req, res) => {    // en endpoint products/realtimeproducts muestra form para agregar y lista actualizada
  try {
    const productList = await products.getProduct();
    // renderizo la handlebars definida
    res.render("realTimeProducts",
      {
        title: "Real Time Products",
        style: "realtimeproducts.css",
        productList
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para obtener los productos de un carrito

router.get("/cart/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    // Buscar el carrito por su ID
    const cart = await CM.getcartProducts(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    

    // Renderizar la vista de Handlebars pasando la lista de productos
    
    // Mapear productos y extraer solo los atributos necesarios
    const products = cart.products.map(product => {
      // Verificar que _id existe antes de acceder a sus propiedades
      if (product._id) {
        return {
          title: product._id.title,
          description: product._id.description,
          price: product._id.price,
          category: product._id.category,
          quantity: product.quantity,
          subtotal: product.quantity * product._id.price,
        };
      } else {
        // Si _id no existe, devolver un objeto vacío o con valores predeterminados
        return {
          title: 'Producto no encontrado',
          description: '-',
          price: 0,
          category: '-',
          quantity: product.quantity,
          subtotal: 0,
        };
      }
    });

    // Renderizar la vista de Handlebars pasando la lista de productos desestructurados
    res.render('cart', {
      title: 'Productos en el carrito',
      products,  // Ahora solo pasas los atributos que necesitas
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos del carrito', error: error.message });
  }
});

export default router;