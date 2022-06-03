const User = require('./models/user');
const bcrypt = require('bcrypt');

module.exports = async function() {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('<password>', salt);

    const user = new User({
        username: '<username>',
        password: password
    })

    await user.save();
    
}