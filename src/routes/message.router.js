import { Router } from "express";

//import { ProductManager } from "../dao/productManager.js";  lo sustituimos por acceso a la base
import { messageManagerMdb } from "../dao/messageManagerMdb.js";

const MM = new messageManagerMdb;

// Define los metodos para el router de mensajes
const msRouter = Router();


// Los CRUD se hacen por Postman a la raiz "/" mas la ruta en app.use de app.js En este caso message
msRouter.get("/", async (req, res) => {
    const { limit } = req.query;
    // Debe ir adentro del get porque utilizo products para el params, si carga uno solo es el que queda para el slice
    let messages = await MM.getMessages();
    if (limit) {
        messages = messages.slice(0, limit);
    }

    res.send(messages);
});

msRouter.get('/:mid', async (req, res) => {

    let messageId = req.params.mid;
    // Convierto el tipo para que no haya problemas en ProductManager con el ===
    const message = await MM.getMessagebyId(messageId);
    res.send({ message });
});


msRouter.post("/", async (req, res) => {
    const { user, message } = req.body;
    console.log("Body:", req.body);
    console.log(user, message);
    if (!user || !message)

        return res.status(400).send({ error: "Faltan datos para agregar el mensaje!" });

    try {
        await MM.addMessage(req.body);

        res.status(201).send({ message: "Mensaje creado correctamente!" });
    } catch (error) {

        res.status(500).send({ error: "Error al procesar la solicitud!" });
    }

});


// UPDATE

msRouter.put("/:mid", async (req, res) => {
    const mid = req.params.mid;
    try {
        await MM.updateMessage(mid, req.body);
        res.status(200).send({ message: "Mensaje actualizado correctamente!" });
    } catch (error) {
        res.status(500).send({ error: "Error al procesar la solicitud!" });
    }

})

msRouter.delete("/:mid", async (req, res) => {
    const mid = req.params.mid;
    try {
        await MM.deleteMessage(mid);
        console.log("Se elimino:", mid);
        res.status(201).send({ message: "Mensaje eliminado correctamente!" });
    } catch (error) {
        res.status(500).send({ error: "Error al procesar la solicitud!" });
    }

});

export default msRouter;