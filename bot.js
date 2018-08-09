const Symphony = require('symphony-api-client-node');

Symphony.setDebugMode(true);

const listenToMessages = (event, messages) => {
	console.log(event);
	messages.forEach((message, index) => {
		const messageText = message.messageText.toLowerCase();
		console.log(messageText);
	});
}

Symphony.initBot(__dirname + '/config.json')
	.then((symAuth) => {
		Symphony.getDatafeedEventsService(listenToMessages);
	});