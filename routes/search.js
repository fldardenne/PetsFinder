var express = require('express');
var router = express.Router();
let Post = require('../models/post');
let User = require('../models/user');
var axios = require('axios');
var moment = require('moment');

router.get('/', function(req, res) {
    var posts_g = [];
    let promises = []; // The rendering must be executed after the foreach loop.
    
    if(req.query.city.length == 0){
        res.redirect("/");
        return;
    }
    range = 10;
    if(req.query.range.length > 0){
        range = req.query.range;
    }

    //Call API for translating the location into geocode
    axios.get('https://api.opencagedata.com/geocode/v1/json?q='+req.query.city+'&key=be981c22e9ac4b68aa488575f6cfb34c')
    .then(response => {
        coord_dict = response.data.results[0].geometry;
        coord_list = [coord_dict.lng, coord_dict.lat];
        //We search into the database for posts near the location
        var aggregation = Post.aggregate([
            {
                "$geoNear": {
                    "near": {
                        "types": "Point",
                        "coordinates": coord_list
                    },
                    "distanceField": "distance",
                    "spherical": true,
                    "maxDistance": range*1000
                }
            }
        ]);

        //When we found the posts near the location
        aggregation.then(function(posts){
            posts.forEach(function(p){
                //Adding useful information for each posts about the author and the relative date from the posts
                var doc_acc = User.findById(p.author);
                promises.push(doc_acc);
                doc_acc.then(function(value){
                    console.log("OUI");
                    var temp = p;
                    temp.username = value.username;
                    temp.phone = value.phone;
                    temp.mail = value.mail;
                    temp.date =  moment(p.date).fromNow();
                    posts_g.push(temp);
                })  
            });
            //When all the usefull information are added, we render the search
            Promise.all(promises)
            .then((result) => {
                    res.render('home/index', {
                        posts:posts_g,
                        session: req.session,
                        city: req.query.city,
                        center: coord_list,
                        radius: range,
                        zoom: 10,
                    });  
                })
            })
        })           
    });

module.exports = router;
