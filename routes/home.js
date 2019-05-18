var express = require('express');
var router = express.Router();
let Post = require('../models/post');
let User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
      
    Post.find({}, (err, posts)=> {
            res.render('home/index', {
                posts:posts,
                session: req.session,
                user: User
            });        
    });
});

module.exports = router;
