const express = require('express');
const app = express();

app.use(express.static('public'));

let comando = "";

// RECIBE COMANDO
app.get('/Comando', (req, res) => {

    const texto = (req.query.texto || "").toLowerCase();

    if(texto === "prende verde")
        comando = "GREEN_ON";

    if(texto === "apaga verde")
        comando = "GREEN_OFF";

    res.json({ ok:true });
});

// ESP32 LEE COMANDO
app.get('/LeerComando', (req, res) => {

    res.json({ comando });

    comando = "";
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
