/**
 * Created by L&M on 08/03/14.
 */

var passportConf = require('../config/passport');
var User = require('../models/User');

module.exports = function (app) {
    app.get('/settings', passportConf.isAuthenticated, function (req, res) {
        res.render("settings/settings", {
            title: "Settings"
        })
    });

    app.post("/settings/add-mapping", passportConf.isAuthenticated, function (req, res) {
        var mappingUrl = req.body.mappingUrl;
        if (!mappingUrl.trim()) {
            req.flash("error", {msg: "Please enter a valid URL address to be mapped."})
            return req.redirect("/settings");
        }

        User.findById(req.user.id, function (err, user) {
            if (err) return next(err);

            user.connectionMapping = mappingUrl;

            user.save(function (err) {
                if (err) return next(err);
                req.flash('success', { msg: 'Mapping Url successfully saved.' });
                res.redirect('/settings');
            });
        });
    })


}