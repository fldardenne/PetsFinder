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


router.get('/', (req,res) =>{
    res.render('post/create');
});

router.post('/', (req,res) => {
    upload(req,res,(err) => {
        if(err){
            res.json(err);
        }
        console.log(req.file);
        var post = new Post();
        post.author = req.body.author;
        post.petname = req.body.petname;
        post.location = [req.body.latitude,req.body.longitude]
        post.email = req.body.email;
        post.password = req.body.password;
        post.date = req.body.date_lost;
        post.owner_name = req.body.owner;
        post.phone = req.body.phone;
        post.description = req.body.description;
        post.found = req.body.found;
        post.tags = req.body.tags.split(' ');
        post.thumbnail = "/uploads/" + req.file.filename;

        post.save(function(err) {
            console.log("saved");
            if (err) res.json(err);
            
            res.redirect('/');
        });

    });


    
    /**
     * 
     var post = new Post();

    console.log(req.file);
    console.log(req);
    
    post.author = req.body.author;
    post.petname = req.body.petname;
    post.location = [req.body.latitude,req.body.longitude]
    post.email = req.body.email;
    post.password = req.body.password;
    post.date = req.body.date_lost;
    post.owner_name = req.body.owner;
    post.phone = req.body.phone;
    post.description = req.body.description;
    post.found = req.body.found;
    post.tags = req.body.tags.split(' ');


    post.save(function(err) {
        console.log("saved");
        if (err) res.json(err);
        
        res.redirect('/');
    });
     */
    
    
});

module.exports = router;