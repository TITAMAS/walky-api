const mqtt = require('mqtt')
const getImagePath = require('./lib/get_image_path')
const translate = require('./lib/translate')
const googleVision = require('node-cloud-vision-api')
const conf = require('../config.json')
const analyseImage = require('./lib/analyse_image')

const client  = mqtt.connect(
	'ws://std1.mqtt.shiguredo.jp/mqtt', {
		username: 'sh8@github',
		password:  process.env.SANGO_PASSWORD
	}
)

client.on('connect', function () {
	client.subscribe('sh8@github/jphacks/image')
	client.publish('sh8@github/jphacks/result', 'Hello mqtt')
})

client.on('message', function (topic, message) {
	console.log('\n')
	console.log('----- Receiving message -----')
	console.log(topic)
	if (topic == './image') {
    getImagePath(
      message.toString(),
      (filePath) => {
        // Using Azure Computer Vision API
				analyseImage(filePath, (text) => {
					console.log(text)
					translate(text, 'ja', (translation) => {
						console.log(translation)
						client.publish('sh8@github/jphacks/result', translation)
					})
				})
			}
		)
	}
})
