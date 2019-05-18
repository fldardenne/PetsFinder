// Middlewae for redirecting not authenticated user accessing protected route
var sessionRedirect = function (req, res, next) {
    //is authenticated ?
    if(req.session.mail){
        next();
    }else{
        //else redirect to login, the login will then redirect to the requested page
        req.session.redirect = req.originalUrl;
        req.session.save((err) => {
          res.redirect('/auth/login');
        });
    }
};

  
module.exports = {
    sessionRedirect: sessionRedirect
}