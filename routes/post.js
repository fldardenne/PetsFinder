let express = require('express');
let router = express.Router();
let Post = require('../models/post')
let User = require('../models/user')
var path = require('path');
var moment = require('moment');
const axios = require('axios');

//upload image
const multer = require("multer");
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req,file,next)=>{
    next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({
  storage:storage
}).single('thumbnail');
// end upload image

// The user posts list
router.get('/', (req, res) => {
    User.find({'mail': req.session.mail}, (err, acc_doc) => {
        Post.find({author: acc_doc}, (err, post_doc) =>{
            res.render('post/index', {
                session: req.session,
                post: post_doc
            });
        })
    })
    
    
});

// Post creation view
router.get('/create', (req, res) => {
    res.render('post/create', {
        session: req.session
    });
});

router.post('/create', (req,res) => {
    upload(req,res,(err) => {
        if(err){
            res.json(err);
        }
        User.findOne({mail: req.session.mail}, (err, doc_acc) => {
            var post = new Post();
            post.author = doc_acc;
            post.petname = req.body.petname;
            post.location = req.body.location;
            post.date = req.body.date_lost;
            post.description = req.body.description;
            if(req.body.found == "Found"){
                post.found = true;
            }else{
                post.found = false;
            }
            post.tags = req.body.tags;
            post.thumbnail = "/uploads/" + req.file.filename;
            axios.get('https://api.opencagedata.com/geocode/v1/json?q='+req.body.location+'&key=be981c22e9ac4b68aa488575f6cfb34c')
            .then(response => {
                coord = response.data.results[0].geometry;
                post.coordinates = {
                    "type": "Point",
                    "coordinates": [coord.lng, coord.lat]
                };
                post.save(function(err) {
                    console.log("saved");
                    if (err) res.json(err);
    
                    res.redirect('/');
                });
            });
            

            
            
        });

    });
});

router.get('/delete/:postID', (req, res) => {
    var id = req.params.postID;
    Post.findById(id, (err, post_doc) => {
        console.log(id);
        User.findOne({mail: req.session.mail}, (err, acc_doc) => {
            if (post_doc.author == acc_doc.id) {
                post_doc.remove();
                res.redirect('/post');
            }else{
                res.redirect('/post');
            }
        })
    })
})

router.get('/edit/:postID', (req, res) => {
    var id = req.params.postID;
    Post.findById(id, (err, post_doc) => {
        User.findOne({mail: req.session.mail}, (err, acc_doc) => {
            if (post_doc.author == acc_doc.id) {
                res.render('post/edit', {
                    post: post_doc,
                    date: moment(post_doc.date).format('YYYY-MM-DD'),
                    session: req.session
                });
            }else{
                res.redirect('/post');
            }
        })
    })
})

router.post('/edit/:postID', (req,res) => {
    upload(req,res,(err) => {
        if(err){
            res.json(err);
        }
        User.findOne({mail: req.session.mail}, (err, doc_acc) => {
            Post.findById(req.params.postID, (err, post_doc) => {
                
                post_doc.author = doc_acc;
                post_doc.petname = req.body.petname;
                post_doc.location = req.body.location;
                post_doc.date = req.body.date_lost;
                post_doc.description = req.body.description;
                if(req.body.found == "Found"){
                    post_doc.found = true;
                }else{
                    post_doc.found = false;
                }
                
                post_doc.tags = req.body.tags;
                if(req.file){
                    post_doc.thumbnail = "/uploads/" + req.file.filename;
                }

                axios.get('https://api.opencagedata.com/geocode/v1/json?q='+req.body.location+'&key=be981c22e9ac4b68aa488575f6cfb34c')
                .then(response => {
                    coord = response.data.results[0].geometry;
                    post_doc.coordinates = {
                        "type": "Point",
                        "coordinates": [coord.lng, coord.lat]
                    };
                    post_doc.save(function(err) {
                        console.log("saved");
                        if (err) res.json(err);
        
                        res.redirect('/post');
                    });
                });
            })
            
            
        });

    });
});

module.exports = router;
