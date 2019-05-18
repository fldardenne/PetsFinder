let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');


router.get('/register', (req, res) => {
    res.render('user/create',{
        session: req.session
    });
})

router.post('/register', (req, res) => {
    user = new User();
    bcrypt.hash(req.body.password, 10, function(err, hash) {

        user.password = hash;
        user.mail = req.body.email;
        user.phone = req.body.phone;
    
        user.save((err) => {
            req.session.mail = req.body.email;
            req.session.save( (err) => {
                res.redirect('/');
            })
        })
    });
    
})

router.get('/delete', (req, res) => {
    res.render('user/delete', {
        session: req.session
    });
})

module.exports = router;
