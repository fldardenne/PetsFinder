let express = require('express');
let router = express.Router();
let User = require('../models/user');

router.get('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        res.render('phone/edit', {
            session: req.session,
            phone: doc_acc.phone
        })
    })
})

router.post('/edit', (req, res) => {
    User.findOne({mail: req.session.mail}, (err, doc_acc) => {
        doc_acc.phone = req.body.phone;
        doc_acc.save(function(value){
            res.render('phone/edit', {
                session: req.session,
                phone: doc_acc.phone
            });
        });
        
    })
})

module.exports = router;
