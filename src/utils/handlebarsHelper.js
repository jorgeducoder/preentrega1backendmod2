import Handlebars from 'handlebars';

/* Helper para calcular el subtotal
Handlebars.registerHelper('calcSubtotal', function (quantity, price) {
  return quantity * price;
});*/

// Helper para calcular el total del carrito
Handlebars.registerHelper('calcTotal', function (products) {
  
  //  return products.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
});
