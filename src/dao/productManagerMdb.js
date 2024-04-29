import productModel from "./models/productModel.js";


class ProductManagerMdb {

    async addProduct(productData) {

       /* try {
            console.log("Producto que llega a addProduct en PMMdbjs: ", producto)
            // aca estaba el problema del undefined, le estaba pasando un objeto de la clase products
            //const result = await productModel.create({ producto });
            const result = await productModel.create( producto );
            return result;

        } catch (error) {
            console.error(error.message);
            throw new error("Error al crear el producto")

        }*/

        try {
            // Crear un nuevo producto con los datos recibidos y la imagen
            const product = new productModel({
              title: productData.title,
              portions: productData.portions,
              description: productData.description,
              thumbnails: productData.imageData,  // Guarda los datos de la imagen en base 64
              stock: productData.stock,
              price: productData.price,
              category: productData.category,
              status: productData.status,
              code: productData.code
            });
      
            // Guardar el producto en la base de datos
            await product.save();
      
            console.log('Producto guardado:', product);
            // Puedes emitir un mensaje de confirmación de que el producto se ha guardado correctamente si lo deseas
          } catch (error) {
            console.error('Error al guardar el producto:', error);
            // Puedes emitir un mensaje de error si ocurre un problema durante el proceso de guardado
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

export { ProductManagerMdb };