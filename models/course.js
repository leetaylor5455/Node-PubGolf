const { number } = require('joi');
const mongoose = require('mongoose');
const { holeSchema } = require('./hole');

const courseSchema = new mongoose.Schema({
    holes: [holeSchema]
});

const Course = mongoose.model('Course', courseSchema);

exports.Course = Course;
exports.courseSchema = courseSchema;
