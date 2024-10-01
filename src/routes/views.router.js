import { Router } from "express";
//import { ProductManager } from "../dao/productManager.js";

import { ProductManagerMdb } from "../dao/productManagerMdb.js";



const router = Router();
//const products = new ProductManager("./src/saborescaseros.json");
const products = new ProductManagerMdb();


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
      console.log("Esto devuelve el paginate o el find en views.router", productList);
     
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


export default router;