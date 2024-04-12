import productModel from "./models/productModel.js";


class ProductManagerMdb {

    async addProduct(producto) {

        try {
            console.log("Producto que llega a addProduct en PMMdbjs: ", producto)
            const result = await productModel.create({ producto });
            return result;

        } catch (error) {
            console.error(error.message);
            throw new error("Error al crear el producto")

        }
    }



    async getProduct() {

        try {
            return await productModel.find().lean(); // se agrega lean() porque mongo devuelve un objeto mongo 
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los productos");

        }
    }



    async updateProduct(pid, producto) {

        try {
            const result = await productModel.updateOne({ _id: pid }, producto);
            return result;
        } catch (error) {
            console.error(error.messsage);
            throw new Error("Error al actualizar el producto");

        }

    }

        

    async getProductbyId(pid) {

        const product = await productModel.findOne({_id: pid});

        if (!product) throw new Error(`El producto ${pid} no existe!`);

        return product;

    }

    async deleteProduct(pid) {
        try {
            const result = await productModel.deleteOne({ _id: pid });
            if (result.deletedCount === 0) throw new Error(`El producto no existe ${pid} `);

            return result;
        } catch (error) {
            throw new Error(`Error al intentar borrar el ID ${pid} `);
        }

    }
    
}
//Exporto la clase
//module.exports = ProductManager;
// Lo cambio por type module en json
export { ProductManagerMdb };