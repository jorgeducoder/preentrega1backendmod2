// Para hacer publica la carpeta publics cuando se suba el prpoyecto a un servidor

import { fileURLToPath } from "url";
import { dirname } from "path";

// Para trabajar con helpers en handlebars
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper para calcular el subtotal
Handlebars.registerHelper('calcSubtotal', function (quantity, price) {
  return quantity * price;
});

// Helper para calcular el total del carrito
Handlebars.registerHelper('calcTotal', function (products) {
  return products.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
});


export default __dirname;






