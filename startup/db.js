const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
    })
        .then(() => console.log(`Connected to ${db}...`))
        .catch(err => console.log('Could not connect to DB: ', err));    
}