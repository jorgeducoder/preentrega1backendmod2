//console.log("Estoy funcionando en index.js");

// Inicializo socket del lado del cliente
const socket = io();


let user;
let chatBox = document.querySelector("#chatBox");

// defino la variable para mostrar los mensajes recibidos
let messagesLogs = document.querySelector("#messagesLogs");

Swal.fire({
    title: "hola Coders! Identificate",
    input: "text",
    text: "Ingresa tu usuario para identificarte en el Coder Chat",
    inputValidator: (value) => {
        return !value && "Necesitas identificarte para continuar";
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    console.log(`Tu nombre de usuario es ${user}`);
});

chatBox.addEventListener("keypress", e => {
    if (e.key == "Enter") {

        if (chatBox.value.trim().length > 0) {

            console.log(`Mensaje indexchat: ${chatBox.value}`);

            socket.emit("message", {
                user,
                message: chatBox.value
            });

            chatBox.value = "";
        }
    }
});

// En los clientes tengo que capturar los mensajes

socket.on("messagesLogs", data => {
    let messages = "";

    data.forEach(chat => {
        messages += `${chat.user}: ${chat.message} </br>`;
        console.log(`Mensaje lista: ${messages}`);
        
    })
    messagesLogs.innerHTML = messages;
    
});

