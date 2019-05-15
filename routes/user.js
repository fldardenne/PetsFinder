let express = require('express');
let router = express.Router();


router.get('/register', (req, res) => {
    res.render('user/create');
})

router.post('/register', (req, res) => {
    user = new User();
    user.mail = req.body.email;
    user.setPassword(req.body.password);

    user.save((err) => {
        res.redirect('/');
    })

})

router.get('/delete', (req, res) => {
    res.render('user/delete');
})

module.exports = router;
