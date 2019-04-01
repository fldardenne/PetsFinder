let express = require('express');
let router = express.Router();


router.get('/', (req,res) =>{
    res.send('<h1> Return something, home </h1>');
});

router.post('/', (req,res) => {
    res.send('account post')
});

module.exports = router;