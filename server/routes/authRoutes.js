const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController'); // Add getProfile

router.post('/register', register);
router.post('/login', login);
router.get('/profile', require('../middleware/authMiddleware'), getProfile); // Add this line

module.exports = router;