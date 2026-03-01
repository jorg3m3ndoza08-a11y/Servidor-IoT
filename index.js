const express = require('express');
const app = express();

let comando = "";

app.get('/Comando', (req, res) => {
    const texto = req.query.texto || "";

    if (texto.toLowerCase().includes("prende el foco")) {
        comando = "ON";
    } 
    else if (texto.toLowerCase().includes("apaga el foco")) {
        comando = "OFF";
    }

    res.send("Comando recibido: " + comando);
});

app.get('/LeerComando', (req, res) => {
    res.send(comando);
    comando = "";
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
