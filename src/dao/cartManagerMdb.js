import cartModel from "./models/cartModel.js";


// reutiliza los manager para mantener los mismos nombres de los metodos y no tener que cambiar la llamada a ellos en los routers

class cartManagerMdb {

    async getCarts() {
        // Retorna todos los carritos del objeto

        try {
            return await cartModel.find().lean(); // se agrega lean() porque mongo devuelve un objeto mongo 

        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los carritos");
        }
    }


    async getCartbyId(id) {
        // Obtener un carrito por su ID
        const product = await cartModel.findOne({ _id: id });

        if (!product) throw new Error(`El carrito ${id} no existe!`);

        return product;

    }



    async getcartProducts(id) {
        // Obtener todos los productos de un carrito
        const product = await cartModel.findMany({ _id: id });

        if (!product) throw new Error(`El carrito ${id} no tiene productos!`);

        return product;
    }


    async addCart(cart) {

        try {
            const result = await cartModel.create(cart);
            console.log("Carrito creado sin  productos");
            return result;
        } catch (e) {
            console.error("Error al agregar el carrito\n", e);

        }
    }

    async addproductCart(cid, pId, cantidad) {

        try {
            // Buscar el carrito
            const cartp = await cartModel.findById(cid);
            if (!cartp) {
                console.log("Carrito no encontrado buscando sus productos");
            } else {
                // Buscar el producto en el carrito por su ID
                const productoEncontrado = cartp.products.find(product => product._id.toString() === pId);

                if (productoEncontrado) {
                    // Si el producto existe, actualizar su cantidad sumando la cantidad nueva
                    productoEncontrado.quantity += cantidad;
                    await cartp.save();
                    console.log('Cantidad actualizada.');

                } else {
                    // Si el producto no existe, agregarlo al carrito con la cantidad proporcionada
                    cartp.products.push({ _id: pId, quantity: cantidad });
                    await cartp.save();
                    console.log('Producto agregado al carrito.');
                }
            }
        }
        catch (err) {
            console.error('Error al actualizar el carrito:', err);
        }
    }






}



export { cartManagerMdb };




