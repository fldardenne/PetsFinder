let express = require('express');
let router = express.Router();
let User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        res.render('password/edit', {
            session: req.session,
            alert: req.alert
        })
    })
})

router.post('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        bcrypt.compare(req.body.current, doc_acc.password, function(err, rescrypt) {
            if(rescrypt) {
                bcrypt.hash(req.body.new, 10, function(err, hash) {
                    doc_acc.password = hash;
                    doc_acc.save(function(value){
                        req.session.alert = "Successfully updated"
                        res.redirect('/password/edit');
                    });
                    
                });
                
            }else{
                req.session.error = "Wrong credential"
                res.redirect('/password/edit');
            }
        })  
    })
})

module.exports = router;
