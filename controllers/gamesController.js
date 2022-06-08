const Game = require('../models/game');
const { Course } = require('../models/course');
const { Team } = require('../models/team');
const { Hole } = require('../models/hole');
const Joi = require('joi');
const { wss } = require('../startup/socket');


exports.getGameData_get = async (req, res) => {

    // Not going to store games, so find single game in collection
    const game = await Game.findOne({});
    if (!game) return res.status(400).send('Game not found');

    return res.status(200).send(game);

}

exports.startNewGame_post = async (req, res) => {


    const { error } = validateStartGame(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.message);

    // Check if game exists already
    let game = await Game.findOne({});
    if (game) return res.status(400).send('Game already in progress');

    let holes = [];

    req.body.course.holes.forEach(hole => {
        holes.push(new Hole({ 
            location: hole.location,
            drink: hole.drink,
            par: hole.par,
            index: hole.index 
        }));
    });

    let course = new Course({
        holes: holes
    })

    let teams = [];

    // Populate teams with team objects
    req.body.teams.forEach((team, index) => {
        teams.push(new Team({ name: team.name, position: index+1 }));
    })

    // Populate game
    game = new Game({
        course: course,
        teams: teams,
        orderedTeams: teams,
        currentHoleIndex: 0,
        currentHole: holes[0],
        nextHole: holes[1],
        winner: teams[0],
        loser: teams[1]
    });

    game = await game.save();

    wss.broadcast(game);

    return res.send(game);

}

// Sort teams in score order
function compare (a, b) {
    if (a.score > b.score) return 1;

    if (a.score < b.score) return -1;

    return 0;
}

exports.nextHole_get = async (req, res) => {

    // Not going to store games, so find single game in collection
    let game = await Game.findOne({});
    if (!game) return res.status(400).send('Game not found');

    // If not last hole iterate to next hole
    if (!game.lastHole) {
        game.currentHoleIndex++;
        game.currentHole = game.course.holes[game.currentHoleIndex];
        game.nextHole = game.course.holes[game.currentHoleIndex+1]

        if (game.currentHoleIndex == game.course.holes.length-1) {
            game.lastHole = true;
        }

        game.orderedTeams = game.teams;
        // Sort before going back
        game.orderedTeams.sort(compare);

        await game.save();
        wss.broadcast(game);
        return res.status(200).send(game);
    }

    game.orderedTeams.sort(compare);

    // Assign winner/loser
    game.winner = game.orderedTeams[0];
    game.loser = game.orderedTeams[game.orderedTeams.length-1];
    game.complete = true;

    game = await game.save();
    
    wss.broadcast(game);

    // Then game is complete
    return res.status(200).send(game);

}

exports.addPoints_post = async (req, res) => {

    const { error } = validateAddPoints(req.body);
    if (error) return res.status(400).send(error.message);

    let game = await Game.findById(req.body.game_id);
    if (!game) return res.status(400).send('Invalid Game ID');

    // Find team by _id
    const teamIndex = game.teams.findIndex(team => {
        return team._id == req.body.team_id;
    });

    if (teamIndex < 0) return res.status(400).send('Invalid Team ID');

    game.teams[teamIndex].score += req.body.points;

    game.orderedTeams = game.teams;

    game.orderedTeams.sort(compare);
    
    game = await game.save();
    wss.broadcast(game);
    return res.status(200).send(game);
}

exports.deleteGame_delete = async (req, res) => {
    console.log('delete request')

    const game = await Game.deleteMany({});

    if (game) return res.status(200).send('Game deleted');

    return res.status(400).send('No game found to delete.');
}

function validateStartGame(req) {

    const schema = Joi.object({
        course: Joi.object({
            holes: Joi.array().items(Joi.object({
                location: Joi.string().required(),
                drink: Joi.string().required(),
                par: Joi.number().required(),
                index: Joi.number().required()
            })).required(),
        }).required(),
        teams: Joi.array().items(Joi.object({ name: Joi.string().required() })).required()
    });

    return schema.validate(req);
}

function validateAddPoints(req) {

    const schema = Joi.object({
        game_id: Joi.string().required(),
        team_id: Joi.string().required(),
        points: Joi.number().required()
    });

    return schema.validate(req);
}