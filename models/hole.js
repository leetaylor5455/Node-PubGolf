const mongoose = require('mongoose');

const holeSchema = new mongoose.Schema({
    location: String,
    drink: String,
    par: Number,
    index: Number
});

const Hole = mongoose.model('Hole', holeSchema);

exports.Hole = Hole;
exports.holeSchema = holeSchema;