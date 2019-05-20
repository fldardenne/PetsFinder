let express = require('express');
let router = express.Router();
User = require('../models/user');
require('../config/passport');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.render('auth/create', {
        session: req.session,
        alert: req.alert
    })
})
  
router.post('/login', (req, res) => {
    User.findOne({mail: req.body.email}, (err,doc_acc) => {
        if (doc_acc == null){
            req.session.error = "Wrong creditential !";
            res.redirect('/auth/login');
        }else{
            bcrypt.compare(req.body.password, doc_acc.password, function(err, rescrypt) {
                if(rescrypt) {
                    req.session.mail = req.body.email;
                    req.session.save( (err) => {
                        if(req.session.redirect){
                            var temp = req.session.redirect;
                            req.session.redirect = "";
                            req.session.save( (err) => {
                                res.redirect(temp);
                            })
                        }else{
                            res.redirect('/');
                        }
                  });
                } else {
                    req.session.error = "Wrong creditential !";
                    res.redirect('/auth/login');
                }
          
            }); 
        }
        
    })
})

router.get('/register', (req, res) => {
    res.render('user/create',{
        session: req.session
    });
})

router.post('/register', (req, res) => {
    user = new User();
    if(req.body.password.length < 6){
        req.session.error = "The length of the password must be greater than 5 character"
        res.redirect('/auth/register');
        return;
    }
    bcrypt.hash(req.body.password, 10, function(err, hash) {

        user.password = hash;
        user.mail = req.body.email;
        user.phone = req.body.phone;
        user.username = req.body.name;
    
        user.save((err) => {
            req.session.mail = req.body.email;
            req.session.save( (err) => {
                res.redirect('/');
            })
        })
    });
})

router.get('/logout', (req, res) => {
    req.session.mail = '';
    res.redirect('/');
})

module.exports = router;
