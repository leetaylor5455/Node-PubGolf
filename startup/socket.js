const socketIo = require('socket.io');
const Game = require('../models/game');

exports.socket = function(server) {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    let interval;

    io.on('connection', (socket) => {
        console.log('New client connection.');

        const gameId = socket.handshake.query.data;
        let iteration = -1;

        // Routine polling of db to get data
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(async () => { 
            if (iteration != -2) { // code for game complete
                iteration = await getGameDataAndEmit(socket, gameId, iteration);
            }
        }, 300);
        socket.on('disconnect', () => {
            console.log('Client disconnected.');
            clearInterval(interval);
        });

    });

    const getGameDataAndEmit = async (socket, gameId, iteration) => {
        const game = await Game.findById(gameId);

        if (!game) return socket.emit('GameData', 'gameId invalid.');

        if (game.isComplete) { 
            socket.emit('GameData', { isComplete: true, gameId: game._id });
            return -2;
        }
        
        if (game.iteration > iteration) {
            socket.emit('GameData', game);
            return game.iteration;
        }

        return iteration;
        

    }
}