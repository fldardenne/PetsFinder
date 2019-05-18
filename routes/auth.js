let express = require('express');
let router = express.Router();
User = require('../models/user');
require('../config/passport');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.render('auth/create', {
        session: req.session
    })
})
  
router.post('/login', (req, res) => {
    User.findOne({mail: req.body.email}, (err,doc_acc) => {
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
                console.log("\x1b[36m%s\x1b[0m", "[Auth] " + req.body.mail + " failed");
                res.redirect('/');
            }
      
          }); 
    })
})

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

router.get('/logout', (req, res) => {
    req.session.mail = '';
    res.redirect('/');
})

module.exports = router;
