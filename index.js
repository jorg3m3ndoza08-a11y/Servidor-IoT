const express = require('express');
const app = express();

app.use(express.static('public'));

let comandos = [];

app.get('/Comando', (req, res) => {

    const texto = (req.query.texto || "").toLowerCase();
    comandos = [];

    const quierePrender = texto.match(/prende|enciende|activa/);
    const quiereApagar  = texto.match(/apaga|desactiva|deshabilita/);

    // ---- CLIMA ----
    if (texto.includes("clima") || texto.includes("temperatura")) {
        hablar("Consultando condiciones actuales, señor.");
        setTimeout(() => {
            obtenerClima();
        }, 1500);
        return;
    }

    // ---- HORA ACTUAL ----
    if (texto.includes("hora")) {
    
        const ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
    
        if (minutos < 10) minutos = "0" + minutos;
    
        hablar("Son las " + horas + " con " + minutos + " minutos, señor.");
        return;
    }

    // ---- VERDE ----
    if (texto.includes("verde")) {
        if (quierePrender)
            comandos.push("GREEN_ON");
        else if (quiereApagar)
            comandos.push("GREEN_OFF");
    }

    // ---- AZUL ----
    if (texto.includes("azul")) {
        if (quierePrender)
            comandos.push("BLUE_ON");
        else if (quiereApagar)
            comandos.push("BLUE_OFF");
    }

    res.json({ comandos });
});

app.get('/LeerComando', (req, res) => {
    res.json({ comandos });
    comandos = [];
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
