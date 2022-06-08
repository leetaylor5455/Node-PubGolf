const { WebSocketServer } = require('ws');
const Game = require('../models/game');

exports.startupSocket = function(server) {

    function heartbeat() {
        this.isAlive = true;
    }

    const wss = new WebSocketServer({ server });

    wss.broadcast = function(data) {
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(data));
        });
    }

    wss.on('connection', function connection(ws) {

        ws.isAlive = true;
        ws.on('pong', heartbeat);

        ws.on('message', async function message() {
            
            const game = await Game.findOne({});

            wss.broadcast(game);
        });
    });

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });
    }, 20000);

    wss.on('close', function close() {
        clearInterval(interval);
    })

    exports.wss = wss;
}
