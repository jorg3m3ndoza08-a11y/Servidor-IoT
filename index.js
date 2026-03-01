const express = require('express');
const app = express();

let comando = "";

app.get('/Comando', (req, res) => {

    const texto = (req.query.texto || "").toLowerCase();
    comando = "";

    const quierePrender = texto.match(/prende|enciende|activa/);
    const quiereApagar  = texto.match(/apaga|desactiva|deshabilita/);

    if (texto.includes("verde")) {

        if (quierePrender)
            comando = "GREEN_ON";
        else if (quiereApagar)
            comando = "GREEN_OFF";
    }
    else if (texto.includes("azul")) {

        if (quierePrender)
            comando = "BLUE_ON";
        else if (quiereApagar)
            comando = "BLUE_OFF";
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
