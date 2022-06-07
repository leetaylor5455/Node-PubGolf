const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');

// username and password -> jwt
// Required schema
// {
//     username: String, REQUIRED
//     password: String REQUIRED
// }
router.post('/', authController.login_post);

// verify jwt stored in cookie
// jwt sent in header
router.get('/jwt', auth, authController.verifyJwt_get);

module.exports = router;