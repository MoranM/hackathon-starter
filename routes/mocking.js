/**
 * Created by L&M on 09/03/14.
 */

var passportConf = require('../config/passport');
var User = require('../models/User');

module.exports = function (app) {
    app.get("/mocking", passportConf.isAuthenticated, function (req, res) {
        res.render("settings/mocking", {
            title: "Mocking"
        })
    });

    app.get("/settings/remove-mock", passportConf.isAuthenticated, function (req, res) {
        var mockIndex = req.query.index;

        User.findById(req.user.id, function (err, user) {
            if (err) return res.status(500);

            if(user.mockedEndpoints.length == 0){
                req.flash('error', { msg: 'no mocking found.' });
                res.redirect('/mocking');
            }

            user.mockedEndpoints.splice(mockIndex,1);
            user.save(function (err) {
                if (err) return next(err);
                req.flash('success', { msg: 'mocking was successfully deleted' });
                res.redirect('/mocking');
            });
        });

    });

    app.post("/settings/add-mock", passportConf.isAuthenticated, function (req, res) {
        var mockUrl = req.body.mockUrl;
        var mockData = req.body.mockData;

        mockData = mockData.replace(/(\r\n|\n|\r)/gm, "");
        mockData = mockData.replace(/\s+/g, " ");

        mockUrl = mockUrl.trim();

        if (mockUrl.indexOf("https") > -1) {
            mockUrl = mockUrl.replace("https://", "");
        }
        if (mockUrl.indexOf("http") > -1) {
            mockUrl = mockUrl.replace("http://", "");
        }

        if (!mockUrl || mockUrl.length == 0) {
            req.flash("error", {msg: "Please enter a valid URL address to be mocked."})
            return req.redirect("/mocking");
        }

        if (!mockData || mockData.length == 0) {
            req.flash("error", {msg: "Please enter a valid URL address to be mocked."})
            return req.redirect("/mocking");
        }

        User.findById(req.user.id, function (err, user) {
            if (err) return res.status(500);

            user.mockedEndpoints.push({
                url: mockUrl,
                data: mockData
            });

            user.save(function (err) {
                if (err) return res.status(500);
                req.flash('success', { msg: 'Mapping Url successfully saved.' });
                res.redirect('/mocking');
            });
        });
    });
};


