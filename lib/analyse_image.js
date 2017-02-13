const https = require('https');
const fs = require('fs');
const conf = require('../config.json')

// need to get access token
const api_key = conf.ms_computer_vision_api_key;
const image_analyse_host = 'westus.api.cognitive.microsoft.com';
const image_analyse_path = '/vision/v1.0/analyze?';

// execute translate
analyseImage(function (token) {
    analyseImage(token, function (analysed) {
      console.log(analysed);
    });
});

// do analyse image
function analyseImage(callback) {
  var body = ''

  fs.readFile('./image/house_yard.jpg', 'binary', function(err, data) {
    if(err) throw err;

    var options = 'visualFeatures=Description&Subscription-key=' + api_key

    var req = https.request({
      host: image_analyse_host,
      path: image_analyse_path + options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: "",
    }, function (res) {
        res.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            console.log(body);
        });
    }).on('error', function (err) {
        console.log(err);
    });

    req.end();
  })

  function analysed(text) {
      callback(text);
  }
}
