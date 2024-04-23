import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import __dirname from "./utils.js";

// importo los routers
import router from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
// lo utilizo en el socket import { ProductManager } from "./service/ProductManager.js";
import Sockets from "./sockets.js";
import mongoose from "mongoose";

const app = express();

// MongoDB connect

//Antes del ? donde empiezan los query params se pone el nombre de la BD a la que quiero acceder que es ecommerce
const uri = "mongodb+srv://jeduclosson:HoIOatEgfADTFsA6@cluster0.ngvrtai.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);


const port = 8080;
// lo utilizo en el socket const products = new ProductManager();

// Middleware

//  app.use(express.static(`${__dirname}/../public`)); no esta en otros proyectos (en el de chat esta asi) esta este app.use(express.static('public')); 

// Para decirle que tu servidor puede recibir datos primitivos desde el cuerpo de la app debes decirle que va a usar la herramienta de express
// para poder utilizar JSON en tus rutas

app.use(express.json()); // Tu server podra leer los datos recibidos por los cuerpos de las paginas (req.body)
app.use(express.urlencoded({ extended: true })); //Podra leer cantidades grandes de datos/complejos. JSON muy grandes 
app.use(express.static('public')); // esta en otros

// handlebars config

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


// routers - cambio a cartsRouter y dejo solo router porque asi se llaman los router en cart.router.js y product.router.js respectivamente
// El use del viewsRouter lleva el path definido en el get de views.router.js
// si el path de viewsRouter lo pongo en /products en el endpoint se ejecuta localhost:8080/products/localhost
app.use("/api/products", router);
app.use("/api/carts", cartsRouter);
app.use("/products", viewsRouter);


// Start servidor
const httpServer = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// Set up WebSocket server
const io = new Server(httpServer);
Sockets(io);

