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
    axios.post('https://places-dsn.algolia.net/1/places/query', {
        query: req.query.city,
    })
    .then(function (response) {
        coord = response.data.hits[0]._geoloc;
        coord_list = [coord.lng, coord.lat];
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
        }) .catch(function (error) {
            console.log(error)
            res.redirect('/')
        });
    })
   
module.exports = router;
