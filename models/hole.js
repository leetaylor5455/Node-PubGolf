const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
    name: String,
    drink: String,
    par: Number,
    index: Number
});

const Hole = mongoose.model('Hole', holeSchema);

exports.Hole = Hole;
exports.holeSchema = holeSchema;