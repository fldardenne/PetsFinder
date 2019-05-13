let express = require('express');
let router = express.Router();
User = require('../models/user');
require('../config/passport');

router.get('/login', (req,res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    res.send('Logged');
})

router.get('/register', (req,res) => {
    res.render('auth/register');
})

router.post('/register', (req, res) => {
    user = new User();
    user.mail = req.body.email;
    user.setPassword(req.body.password);

    user.save((err) => {
        res.redirect('/');
    })
    
})

module.exports = router;

