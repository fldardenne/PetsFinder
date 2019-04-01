let express = require('express');
let router = express.Router();


router.get('/', (req,res) =>{
    res.send('post form');
});

router.post('/', (req,res) => {
    res.send('post post')
});

module.exports = router;