let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
let User = require('../models/user');
let Post = require('../models/post');


router.get('/delete', (req, res) => {
    res.render('user/delete', {
        session: req.session
    });
})

router.post('/delete', (req,res) => {
    User.find({mail: req.session.mail}, (err, acc_doc) => {
        Post.find({author:acc_doc}).remove().then(function(value) {
            User.find({mail: req.session.mail}).remove().then(function(value){
                req.session.mail = '';
                req.session.save((err) => {
                    res.redirect('/');
                })
            })
        });
    })
    
    
})
module.exports = router;
