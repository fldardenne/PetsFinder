var express = require('express');
var router = express.Router();
let Post = require('../models/post');
let User = require('../models/user');


router.get('/', function(req, res) {
    var posts_g = [];
    let promises = []; // The rendering must be executed after the foreach loop.
    if(req.query.city.length == 0){
        res.redirect("/");
        return;
    }
    Post.find({'location': {$regex : '(?i)' + req.query.city}}, (err, posts)=> {
        posts.forEach(function(p){
            var doc_acc = User.findById(p.author);
                promises.push(doc_acc);
                doc_acc.then(function(value){
                    var temp = p.toObject();
                    temp.username = value.username;
                    temp.phone = value.phone;
                    temp.mail = value.mail;
                    posts_g.push(temp);
                })  
        });
        
             
    }).then(function(value){
        Promise.all(promises)
        .then((result) => {
            res.render('home/index', {
                posts:posts_g,
                session: req.session,
                city: req.query.city
            });  
        })
        
        
    })
});

module.exports = router;
