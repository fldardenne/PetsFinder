let express = require('express');
let router = express.Router();
let User = require('../models/user');




router.get('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        res.render('email/edit', {
            session: req.session,
            mail: doc_acc.mail
        })
    })
    
})

router.post('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        doc_acc.mail = req.body.mail;
        req.session.mail = req.body.mail;
        req.session.save(function(value){
            doc_acc.save(function(value){
                res.render('email/edit', {
                    session: req.session,
                    mail: doc_acc.mail
                });
            });
        })  
    })
})

module.exports = router;
