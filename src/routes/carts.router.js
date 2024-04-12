import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";
import { ProductManager } from "../dao/productManager.js";

// Define los nuevos objetos CM y PM con los metodos y datos del json
const CM = new CartManager("./src/cartsaborescaseros.json");

// La nueva clase PM en principio la necesito para ver si el producto que se ingresa para incorporar la carrito esta en la clase productos
const PM = new ProductManager("./src/saborescaseros.json");
 
// Define los metodos para el router de usuarios
const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    //Desde la raiz se agrega un carrito nuevo
    try {

        const response = await CM.addCart();
        res.json(response);
    } catch (error) {
        res.send("Error al crear carrito")
    }
})




cartsRouter.get("/", async (req, res) => {
    // Desde la raiz se obtienen todos los carritos
    
    const { limit } = req.query;

    let carts = await CM.getCarts();
    if (limit) {
        carts = carts.slice(0, limit);
    }

    res.send(carts);
});

cartsRouter.get('/:cid', async (req, res) => {
    // Dado el id de un carrito lo muestra
    let cartId = req.params.cid;
    const cart = await CM.getcartProducts(cartId);
    res.send({ cart });
});



cartsRouter.post("/:cid/productos/:pid", async (req, res) => {
    // Dado un id de carrito y un producto lo agrega y si existe lo actuliza con la cantidad que se recibe en el body
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    console.log(cid, pid, quantity);
    if (!cid || !pid || !quantity) 

        // Permite crear un carrito con la cantidad del body
        return res.status(400).send({ error: "Faltan datos para crear o agregar al carrito" });

    const product = await PM.getProductbyId(pid)
    if (!product)
        return res.status(404).send({ error: "Producto no existe" });

    await CM.addproductCart(cid, pid, quantity);

    res.status(201).send({ message: "Producto creado correctamente!" });
});


export default cartsRouter;