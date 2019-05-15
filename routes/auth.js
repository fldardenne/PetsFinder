let express = require('express');
let router = express.Router();
User = require('../models/user');
require('../config/passport');

router.get('/login', (req, res) => {
    res.render('auth/create')
})

router.post('/login', (req, res) => {
    res.send('Logged');
})

module.exports = router;
