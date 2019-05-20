let express = require('express');
let router = express.Router();
User = require('../models/user');
require('../config/passport');
const bcrypt = require('bcrypt');
var validator = require('validator');
 


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
        session: req.session,
        alert: req.alert
    });
})

router.post('/register', (req, res) => {
    user = new User();
    if(req.body.password.length < 6){
        req.session.error = "The length of the password must be greater than 5 character"
        res.redirect('/auth/register');
        return;
    }

    if(!validator.isEmail(req.body.email)){
        req.session.error = "Invalid mail format: must be in user@domain.be"
        res.redirect('/auth/register');
        return;
    }
    if(isNaN(req.body.phone) || req.body.phone.length <= 8){
        req.session.error = "Invalid phone format: only numbers and must be > 7";
        res.redirect('/auth/register');
        return;
    }

    if(req.body.name.length >= 10){
        req.session.error = "Invalid username, must be < 10";
        res.redirect('/auth/register');
        return;
    }
    if(!req.body.check){
        req.session.error = "terms and conditions are not accepted";
        res.redirect('/auth/register');
        return;
    }

    User.find({mail : req.body.email}, function (err, docs) {
        if(docs.length){
            req.session.error = "This mail is already taken";
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

    });
})

router.get('/logout', (req, res) => {
    req.session.mail = '';
    res.redirect('/');
})

module.exports = router;
