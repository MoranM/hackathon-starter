/**
 * Created by L&M on 08/03/14.
 */

var request = require("request");
var User = require('../models/User');
var querystring = require('querystring');


module.exports = function (app) {
    app.get("/map/:name/*", function (req, res) {
        var userName = req.params.name;
        if (!userName) {
            req.flash('errors', {msg: "the mapping schema is /map/{your user name}/{other params}. Review your mapping settings."});
            return res.redirect("/settings");
        }

        User.findOne({userName: userName}, function (err, user) {
            if (err){
                res.status(500);
                res.end();
            }

            var mappingUrl = getMappingUrl(user);
            var originalUrl = req.originalUrl;
            var mock = isMockedRequired(user, originalUrl)
            if (mock) {
                try{
                    var data = JSON.parse(mock.data);
                    return res.json(data);
                }catch (e){
                    console.log(e)
                }
            }

            var redirectTo = req.protocol + "://" + originalUrl.replace("/map/" + userName, mappingUrl);
            request(redirectTo, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(html));
                }
            })
        });
    });

    app.post("/map/:name/*", function (req, res) {
        var userName = req.params.name;
        if (!userName) {
            req.flash('errors', {msg: "the mapping schema is /map/{your user name}/{other params}. Review your mapping settings."});
            return res.redirect("/settings");
        }

        User.findOne({userName: userName}, function (err, user) {
            if (err){
                res.status(500);
                res.end();
            }

            var mappingUrl = getMappingUrl(user);
            var originalUrl = req.originalUrl;
            var mock = isMockedRequired(user, originalUrl)

            if (mock) {
                try{
                    var data = JSON.parse(mock.data);
                    return res.json(data);
                }catch (e){
                    console.log(e)
                }
            }

            var redirectTo = req.protocol + "://" + originalUrl.replace("/map/" + userName, mappingUrl);
            console.log(req.body.username);
            console.log(JSON.stringify(req.body));

            request({
                url: redirectTo,
                body: querystring.stringify(req.body),
                method: "POST",
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(html));
                } else {
                    res.status(500);
                    res.end();
                }
            })
        });
    });
}

function getMappingUrl(user) {
    var mappingUrl = user.connectionMapping;
    if (mappingUrl.indexOf("https") > -1) {
        mappingUrl = mappingUrl.replace("https://", "");
    }
    if (mappingUrl.indexOf("http") > -1) {
        mappingUrl = mappingUrl.replace("http://", "");
    }
    return mappingUrl;
}

function isMockedRequired(user, mappingUrl) {
    var length = user.mockedEndpoints.length;
    if (length == 0)
        return false;

    var urlPath = extractPathFromUrl(user, mappingUrl);


    for (var i = 0; i < length; i++) {
        var isMockUrl = user.mockedEndpoints[i].url == urlPath
        if (isMockUrl)
            return user.mockedEndpoints[i];
    }

    return false;
}


function extractPathFromUrl(user, mappingUrl) {
    mappingUrl = mappingUrl.replace("/map/" + user.userName, "");
    var urlWithoutQuery = mappingUrl.split('?')[0];
    var path = urlWithoutQuery.split('/').slice(1);

    return path.join('/');
}