const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Table login name and password -> jwt
// Required schema
// {
//     tableId: String, REQUIRED
//     password: String REQUIRED
// }
router.post('/', authController.login_post);



module.exports = router;