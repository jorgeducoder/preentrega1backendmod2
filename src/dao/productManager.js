import error from "console";
import fs from "fs";


// lo exporto para usar import
export class ProductManager {
    
    constructor(archivo) {
        this.archivo = archivo;
        
    }
    
    
    async addProduct(producto) {
        
        
        // Armo el array del nuevo producto con nueva id mas el array de atributos del nuevo producto
        const nuevoProducto = { id: await this.GetId(), ...producto, };
        
        console.log("Estoy en add  y producto a agregar: ", nuevoProducto)

        // Guardo en productos todos los existentes

        const productos = await this.getProduct();
        
        // Busco si el nuevo objeto tiene codigo ya existente

        if (productos.some(product => product.nombre === producto.nombre)) {
            
            console.error(`Error: Nombre ${producto.nombre} ya existe.`);
            
        }else{
            // Si no existe el producto con ese codigo lo agrego al array de productos y hago el push de todo el array
            productos.push(nuevoProducto);
            try {
                await fs.promises.writeFile(this.archivo, JSON.stringify(productos, null, "\t"));
                  
            } catch(e) {
                console.error("Error al agregar el producto\n", e);
                
            }
        }
    
    }

    async getProduct() {
        
        console.log(" ARCHIVO: ", this.archivo);
        
        try {
            const productos = await fs.promises.readFile(this.archivo, "utf-8");
            
            return JSON.parse(productos);
        } catch (error) {
            console.error(error);
            
            return [];
        }
    }

    

    async updateProduct (id, producto){
        
        // En productos tengo el conjunto de objetos existentes

        const productos = await this.getProduct();
        
        // Busco la ID si existe en el array de productos. El findindex devuelve ei index del producto encontrado.
        
        const buscoId = productos.findIndex(product => product.id == id);
        if (buscoId === -1) return console.error("ID no encontrado");

        // Hago un split del producto a actualizar mas los atributos del array producto donde vienen las actulizaciones.
        // para cambiar solo lo que viene en req.body
        
        const productoActualizado = { ...productos[buscoId], ...producto,  };        
      

        productos[buscoId] = productoActualizado;

      // Se genera un nuevo JSON con el objeto actualizado.
        
        await fs.promises.writeFile(this.archivo , JSON.stringify(productos , null , "\t"));
        console.log("Producto actualizado : " , productoActualizado);
    }
    
    
    async getProductbyId(id) {
         
         try{
         // Obtengo todos los productos
         const productos = await this.getProduct();
         // Busco en los productos el de igual ID con find para que me devuelva el array
        
        const producto = productos.find(product => product.id === parseInt(id));
       
         //console.log("Estoy con este find: ", producto)

        return producto ?  producto : console.error ("No se encontro el producto con ID: ", id) 

        } catch (error) {
            console.error ("Error al obtener producto por ID", error);
            
      }}
    
    async deleteProduct(id) {
        try{
            // Obtengo el producto a eliminar

            const producto = await this.getProductbyId(id);
            console.log("Estoy en delete y producto encontrado ", producto, id)
            if (producto) {
                //Obtengo todos los productos para eliminar el encontrado
                this.productos = await this.getProduct();
                // Con el filter lo elimino del objeto

                const productos = this.productos.filter(product => product.id != id)

                await fs.promises.writeFile(this.archivo, JSON.stringify(productos, null, "\t"));
                console.log("Producto eliminado")
            }else{
                 console.error("No se encontro el ID en Delete")
            }

          } catch (error) {
                console.error("Error al intentar borrar el ID: ", id)
          }
  
    }  
    async GetId() {
        // Para generar el ID automatico no recibe los productos por parametro, los consulta.
        
        const products = await this.getProduct();
        // toma el id del ultimo usuario, por eso el lenght - 1 Los indices comienzan en 0 y el length devuelve la cantidad de elementos
        if(products.length > 0) {
            return parseInt(products[products.length - 1].id + 1);
        }
        // Si no hay ninguno retorna 1 
        return 1;
    }
}
//Exporto la clase
//module.exports = ProductManager;
// Lo cambio por type module en json
export default ProductManager;