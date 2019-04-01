let express = require('express');
let router = express.Router();

router.get('/login', (req,res) => {
    res.send('Login')
})

router.post('/post', (req, res) => {
    res.send('Logged');
})

router.get('/register', (req,res) => {
    res.send('Register')
})

router.post('/post', (req, res) => {
    res.send('Registered');
})

module.exports = router;

