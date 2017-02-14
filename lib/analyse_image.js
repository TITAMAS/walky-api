const https = require('https');
const fs = require('fs');
const conf = require('../config.json')
const isDanger = require('./is_danger')

// need to get access token
const api_key = conf.ms_computer_vision_api_key;
const image_analyse_host = 'westus.api.cognitive.microsoft.com';
const image_analyse_path = '/vision/v1.0/analyze?';

// execute translate
analyseImage(function (token) {
    analyseImage(function (analysed) {
      console.log(analysed);
    });
});

// do analyse image
function analyseImage(callback) {
  fs.readFile('./image/house_yard.jpg', function(err, data) {
    if(err) throw err;

    var buf = new Buffer(data, 'binary');

    var result = ""
    var options = 'visualFeatures=Description&Subscription-key=' + api_key

    // make request
    var req = https.request({
      host: image_analyse_host,
      path: image_analyse_path + options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
    }, function (res) {
        res.on('data', function (chunk) {
            result += chunk;
        }).on('end', function () {
            result_json = JSON.parse(result);
            /*
             respone format is
             {description:{tags:
              {
                {name: <NAME>, "confidence": <CONFIDENCE-RATE>},
                {name: <NAME2>, "confidence":<CONFIDENCE-RATE2>},
              }
            }}
             */
            // appending results
            var analysed_items = "";
            (result_json.description.tags).forEach(function(tag){
              analysed_items += tag + "\n"
            });
            analysed(analysed_items)
        });
    }).on('error', function (err) {
        console.log(err);
    });

    // write data to request
    req.write(buf)
    req.end();

  });

  function analysed(text) {
      callback(text);
  }
}
