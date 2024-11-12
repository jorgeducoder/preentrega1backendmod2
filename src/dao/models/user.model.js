import mongoose from 'mongoose';
// Se agrega para definir el modelo de usuarios solicitado
// Esta línea nos evitará problemas de nombres si Mongoose crea alguna colección no existente
mongoose.pluralize(null);

const collection = 'users';


const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    password: { type: String, required: true },
    cart:{
        type: [
            {
                _id: {
                    // El tipo del ID generado por Mongo
                    type: mongoose.Schema.ObjectId,
                    // Ponemos la referencia al objeto carts
                    ref: "carts"
                }
                
            }
        ],
        // El array de products se genera vacio en el POST por lo que por defecto creo un array vacio
        // en mi modelo
        default: []
    },
    role: { type: String, required: false }  // deberia ser requerido y debe ser enumerado con 3 roles
});

const model = mongoose.model(collection, schema);


export default model;
