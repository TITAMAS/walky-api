const https = require('https');
const qs = require('querystring');
const xml2json = require('xml2json');
const conf = require('../config.json')

// need to get access token
const api_key = conf.ms_text_translator_api_key;
const access_token_host = 'api.cognitive.microsoft.com';
const access_token_path = '/sts/v1.0/issueToken?Subscription-Key=';

// text translator api
const translate_host = 'api.microsofttranslator.com';
const translate_path = '/v2/Http.svc/Translate?';

// execute translate
getAccessToken(function (token) {
    translate(token, process.argv[2], function (translated) {
        console.log(process.argv[2],'->',translated);
    });
});

// get access token
function getAccessToken(callback) {
  var body = '';
  var req = https.request({
    host: access_token_host,
    path: access_token_path + api_key,
    method: 'POST'
  }, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            var access_token = body
            callback(access_token);
        });
    }).on('error', function (err) {
        console.log(err);
    });

    req.end();
}

// do translate
function translate(token, text, callback) {
    var options = '&to=ja&text=' + qs.escape(text);
    var body = '';
    var req = https.request({
        host: translate_host,
        path: translate_path + options,
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
        }
    }, function (res) {
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            // result is in xml, so parse it
            var result_json = JSON.parse(xml2json.toJson(body));

            // getting {string: {xmlns:'http://schemas.microsoft.com/2003/10/Serialization/', $t : <RESULT>}}
            translated(result_json.string.$t)
        });
    }).on('error', function (err) {
        console.log(err);
    });

    req.end();

    function translated(text) {
        callback(text);
    }
}
