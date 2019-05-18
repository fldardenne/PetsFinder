let express = require('express');
let router = express.Router();
let Post = require('../models/post')
let User = require('../models/user')
var path = require('path');

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

            post.save(function(err) {
                console.log("saved");
                if (err) res.json(err);

                res.redirect('/');
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

module.exports = router;
