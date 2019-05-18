let express = require('express');
let router = express.Router();

router.get('/edit', (req, res) => {
    res.render('email/edit', {
        session: req.session
    })
})

router.post('/edit', (req, res) => {
    res.send('Logged');
})

module.exports = router;
