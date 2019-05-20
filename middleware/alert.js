// Middleware for managing error
var alertManager = function (req, res, next) {
    req.alert = {}
    req.alert.error = '';
    req.alert.success = '';
    if(req.session.error){
        req.alert.error = req.session.error;
        req.session.error = '';
    }
    if(req.session.alert){
        req.alert.success = req.session.alert;
        req.session.alert = '';
    }
    next();
};

  
module.exports = {
    alertManager: alertManager
}