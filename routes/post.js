let express = require('express');
let router = express.Router();
let Post = require('../models/post')
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

router.get('/', (req, res) => {
    if(req.session.mail){
        res.render('post/index', {
          session: req.session
        });
    }else{
        req.session.redirect = '/post';
        req.session.save((err) => {
          res.redirect('/auth/login');
        })
    }
});

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
        var post = new Post();
        post.author = "Temporary Author";
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

            res.redirect('/',{
                session: req.session
            });
        });

    });
});

module.exports = router;
