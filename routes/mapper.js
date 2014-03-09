/**
 * Created by L&M on 08/03/14.
 */

var request = require("request");
var User = require('../models/User');

module.exports = function (app) {
    app.get("/map/:name/*", function (req, res) {
        var userName = req.params.name;
        if (!userName) {
            req.flash('errors', {msg: "the mapping schema is /map/{your user name}/{other params}. Review your mapping settings."});
            return res.redirect("/settings");
        }

        User.findOne({userName: userName}, function (err, user) {
            if (err)return next(arr);
            var mappingUrl = user.connectionMapping;
            if (mappingUrl.indexOf("https") > -1){
                mappingUrl = mappingUrl.replace("https://","");
            }
            if (mappingUrl.indexOf("http") > -1){
                mappingUrl = mappingUrl.replace("http://","");
            }

            var mock = isMockedRequired(user,mappingUrl)
            if(mock){
                return res.send(mock.data);
            }

            var redirectTo = req.protocol + "://" + req.originalUrl.replace("/map/" + userName, mappingUrl);
            request(redirectTo, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    res.send(html);
                }
            })
        });
    });
}


function isMockedRequired(user, mappingUrl){
    var length = user.mockedEndpoints.length;
    if(length == 0)
        return false;

    for (var i = 0; i < length; i++) {
        var isMockUrl = user.mockedEndpoints[i].url == mappingUrl
        if(isMockUrl)
            return user.mockedEndpoints[i]
    }

    return false;
}