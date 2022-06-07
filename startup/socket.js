const { WebSocketServer } = require('ws');
const Game = require('../models/game');

exports.startupSocket = function(server) {

    const wss = new WebSocketServer({ server });

    wss.broadcast = function(data) {
        console.log('broadcast')
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(data));
        });
    }

    wss.on('connection', function connection(ws) {
        ws.on('message', async function message() {
            
            const game = await Game.findOne({});

            wss.broadcast(game);
        });
    });

    exports.wss = wss;
}
