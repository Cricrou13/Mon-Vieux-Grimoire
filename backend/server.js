const http = require('http');
const app = require('./app');

// On dit à l'application sur quel port elle doit tourner

const port = process.env.PORT || 4000;
app.set('port' , port);

// On crée le serveur en lui passant notre application app.js

const server = http.createServer(app);

// On écoute le port défini

server.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});