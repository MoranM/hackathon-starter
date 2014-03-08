/**
 * Created by L&M on 08/03/14.
 */

var userController = require('../controllers/user');
var forgotController = require('../controllers/forgot');
var resetController = require('../controllers/reset');
var passportConf = require('../config/passport');


module.exports = function(app){

    app.get('/login', userController.getLogin);
    app.post('/login', userController.postLogin);
    app.get('/logout', userController.logout);
    app.get('/forgot', forgotController.getForgot);
    app.post('/forgot', forgotController.postForgot);
    app.get('/reset/:token', resetController.getReset);
    app.post('/reset/:token', resetController.postReset);
    app.get('/signup', userController.getSignup);
    app.post('/signup', userController.postSignup);
    app.get('/account', passportConf.isAuthenticated, userController.getAccount);
    app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
    app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
    app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

}
