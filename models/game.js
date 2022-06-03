const mongoose = require('mongoose');
const { teamSchema } = require('./team');
const { courseSchema } = require('./course');
const { holeSchema } = require('./hole');

const gameSchema = new mongoose.Schema({
    teams: { type: [teamSchema], default: undefined },
    course: courseSchema,
    currentHoleIndex: Number,
    currentHole: holeSchema,
    nextHole: holeSchema,
    lastHole: { type: Boolean, default: false },
    complete: {type: Boolean, default: false },
    winner: teamSchema,
    loser: teamSchema
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;