const mqtt = require('mqtt')
const getImagePath = require('./lib/get_image_path')
const getTranslateText = require('./lib/translate')
const conf = require('./config.json')
const analyseImage = require('./lib/analyse_image')
const isDanger = require('./lib/is_danger')

const client  = mqtt.connect(
	'ws://std1.mqtt.shiguredo.jp/mqtt', {
		username: conf.sango_user,
		password: conf.sango_password
	}
)

client.on('connect', function () {
	client.subscribe('sh8@github/jphacks/image')
	client.publish('sh8@github/jphacks/result', 'Hello mqtt')

	console.log('----- CONNECTED TO SHIGUREDO -----')
});

client.on('message', function (topic, message) {
	console.log('\n')
	console.log('----- Receiving message -----')
	console.log(topic)
	if (topic == 'sh8@github/jphacks/image') {
    getImagePath(
      message.toString(),
      (filePath) => {
        // Using Azure Computer Vision API
				analyseImage(filePath, (items) => {
					//TODO Should check all items?
					var text = items[0]
					getTranslateText(text, (translation) => {
						console.log(translation)
						client.publish('sh8@github/jphacks/result', translation)
					});
				});
			});
		}
	});
