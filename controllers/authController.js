const Game = require('../models/game');
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');

exports.login_post = async (req, res) => {
    console.log(req.body);
    // Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid login');

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid login');

    // Generate jwt
    const token = user.generateAuthToken();

    // Find game
    let game = await Game.findOne({});

    if (game) return res.status(200).send({ jwt: token, game: game});

    return res.status(200).send({ jwt: token });
}

exports.verifyJwt_get = async (req, res) => {
    // Find game
    let game = await Game.findOne({});

    if (game) return res.status(200).send({ jwt: req.token, game: game});

    // If no game, send the token back (token value applied in auth middleware)
    return res.status(200).send({ jwt: req.token });
}

function validate(req) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(req);
}