var express = require('express');
var router = express.Router();
let Post = require('../models/post')

/* GET home page. */
router.get('/', function(req, res) {
    Post.find({}, (err, posts)=>{
        console.log(posts);
        
        res.render('home/index', {
            posts:posts
        });
    });
});

module.exports = router;
