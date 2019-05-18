let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');


router.get('/delete', (req, res) => {
    res.render('user/delete', {
        session: req.session
    });
})

module.exports = router;
