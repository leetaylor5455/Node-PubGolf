const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: String,
    score: { type: Number, default: 0 },
    position: Number
});

const Team = mongoose.model('Team', teamSchema);

exports.Team = Team;
exports.teamSchema = teamSchema;