const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const gamesController = require('../controllers/gamesController');

// Get game data
// GET: no schema
router.get('/', gamesController.getGameData_get);

// Start a new game
// Required schema
// {
//      teams: [teamSchema],
//      holes: [holeSchema]   
// }
router.post('/newgame', auth, gamesController.startNewGame_post);

// Next hole
// GET: no schema
router.get('/nexthole', auth, gamesController.nextHole_get);

// Add points
// Required schema
// {
//     game_id: String
//     team_id: String
//     points: Number
// }
router.post('/addpoints', auth, gamesController.addPoints_post);


module.exports = router;