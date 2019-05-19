let express = require('express');
let router = express.Router();
let User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        res.render('password/edit', {
            session: req.session,
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
                        res.redirect('/password/edit');
                    });
                    
                });
                
            }else{
                res.redirect('/password/edit');
            }
        })  
    })
})

module.exports = router;
