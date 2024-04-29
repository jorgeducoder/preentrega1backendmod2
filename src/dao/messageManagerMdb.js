import messageModel from "./models/messageModel.js";




class messageManagerMdb {

    async getMessages() {
        // Retorna todos los mensajes de la BD

        try {
            return await messageModel.find().lean(); // se agrega lean() porque mongo devuelve un objeto mongo 

        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar los mensajes");
        }
    }


    async getMessagebyId(id) {
        // Obtener un mensaje por su ID
        try {
            const message = await messageModel.findOne({ _id: id });
            if (!message) throw new Error(`El mensaje ${id} no existe!`);
            return message;
        
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al buscar mensaje por su ID");
        }
    }

 

    async addMessage(message) {

        try {
            const result = await messageModel.create(message);
            console.log("Mensaje agregado");
            return result;
        } catch (e) {
            console.error("Error al agregar el mensaje\n", e);

        }
    }

    async updateMessage(mid, message) {

        try {
            const result = await messageModel.updateOne({ _id: mid }, message);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al actualizar el mensaje");

        }

    }

    async deleteMessage(mid) {
        try {
            const result = await messageModel.deleteOne({ _id: mid });
            if (result.deletedCount === 0) throw new Error(`El mensaje no existe ${mid} `);

            return result;
        } catch (error) {
            throw new Error(`Error al intentar borrar el ID ${mid} `);
        }

    }

}

export { messageManagerMdb };




