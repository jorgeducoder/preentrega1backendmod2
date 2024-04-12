import { Router } from "express";
//import { ProductManager } from "../dao/productManager.js";

import { ProductManagerMdb } from "../dao/productManagerMdb.js";


const router = Router();
//const products = new ProductManager("./src/saborescaseros.json");
const products = new ProductManagerMdb();

//router.get("/realtimeproducts", async (req, res) => {
 router.get("/", async (req, res) => {   
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


/*router.get("/realtimeproducts", (req, res) =>
  res.render("realTimeProducts", {
    products: [],
    style: "styles.css",
  })
);*/

export default router;