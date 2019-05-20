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
                post: post_doc,
                alert: req.alert
            });
        })
    }) 
});

// Post creation view
router.get('/create', (req, res) => {
    res.render('post/create', {
        session: req.session,
        alert: req.alert
    });
});

router.post('/create', (req,res) => {
    upload(req,res,(err) => {
        if(err){
            req.session.error('Error: Your post was not created');
            res.redirect('/');
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
            if(!req.file){
                req.session.error = "Error: must provide a picture";
                res.redirect('/post/create');
                return;
            }
            post.thumbnail = "/uploads/" + req.file.filename;
            axios.post('https://places-dsn.algolia.net/1/places/query', {
                    query: req.body.location,
            })
            .then(function (response) {
                coord = response.data.hits[0]._geoloc;
                    post.coordinates = {
                        "type": "Point",
                        "coordinates": [coord.lng, coord.lat]
                    };
                    post.save(function(err) {
                        console.log("saved");
                        if (err) res.json(err);
                        req.session.alert = "Your post was successfully created !";
                        res.redirect('/post');
                    });
                })
                .catch(function (error) {
                    req.session.error = "Error";
                    res.redirect('/post')
                });  
        });

    });
});

router.get('/delete/:postID', (req, res) => {
    var id = req.params.postID;
    Post.findById(id, (err, post_doc) => {
        User.findOne({mail: req.session.mail}, (err, acc_doc) => {
            if (post_doc.author == acc_doc.id) {
                post_doc.remove();
                req.session.alert = "Successfully removed";
                res.redirect('/post');
            }else{
                req.session.alert = "Not your post";
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
                    session: req.session,
                    alert: req.alert
                });
            }else{
                req.session.alert = "Not your post";
                res.redirect('/post');
            }
        })
    })
})

router.post('/edit/:postID', (req,res) => {
    upload(req,res,(err) => {
        if(err){
            req.session.alert = "Error";
            res.redirect('/post');
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

                axios.post('https://places-dsn.algolia.net/1/places/query', {
                    query: req.body.location,
                })
                .then(function (response) {
                    coord = response.data.hits[0]._geoloc;
                    post_doc.coordinates = {
                        "type": "Point",
                        "coordinates": [coord.lng, coord.lat]
                    };
                    post_doc.save(function(err) {
                        req.session.alert = "Successfully edited !";
                        res.redirect('/post');
                    });
                })
                .catch(function (error) {
                    req.session.alert = "Error fetching API";
                    res.redirect('/post')
                });
            })
            
            
        });

    });
});

module.exports = router;
