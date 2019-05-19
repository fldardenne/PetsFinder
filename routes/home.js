var express = require('express');
var router = express.Router();
let Post = require('../models/post');
let User = require('../models/user');
var axios = require('axios');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {

    var posts_g = [];
    let promises = []; // The rendering must be executed after the foreach loop. 

    Post.find({}, (err, posts)=> {
        //Adding useful information for each posts about the author and the relative date from the posts
        posts.forEach(function(p){
            var doc_acc = User.findById(p.author);
                promises.push(doc_acc);
                doc_acc.then(function(value){
                    var temp = p.toObject();
                    temp.username = value.username;
                    temp.phone = value.phone;
                    temp.mail = value.mail;
                    temp.date =  moment(p.date).fromNow();
                    posts_g.push(temp);
                })  
        });   
    })
    //When all the usefull information are added, we render the search
    .then(function(value){
        Promise.all(promises)
        .then((result) => {
            res.render('home/index', {
                posts:posts_g,
                session: req.session,
                city: '',
                center: [4.61,50.69],
                radius: 0,
                zoom: 8,
            });  
        })
        
        
    })
      
});

module.exports = router;
