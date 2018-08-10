const Symphony = require('symphony-api-client-node');

const prompts = {
	create: 'create zd ticket',
	subject: 'Enter ticket subject:',
	rvm: 'What RVM version are you using?',
	runtime: 'What Runtime version are you using?',
	details: 'Enter details of issue:'
}

let requests = {};
let requestCtr = 0;

const listenToMessages = (event, messages) => {
	messages.forEach((message, index) => {

		const userEmail = message.user.email;

		const messageText = message.messageText.toLowerCase();

		if (messageText === prompts.create) {
			requests[userEmail].previousPrompt = prompts.create;
			Symphony.sendMessage(message.stream.streamId, prompts.subject, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[userEmail] && requests[userEmail].previousPrompt === prompts.create) {
			requests[userEmail].subject = message.messageText;
			requests[userEmail].previousPrompt = prompts.subject;
			Symphony.sendMessage(message.stream.streamId, prompts.rvm, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[userEmail] && requests[userEmail].previousPrompt === prompts.subject) {
			requests[userEmail].rvm = message.messageText;
			requests[userEmail].previousPrompt = prompts.rvm;
			Symphony.sendMessage(message.stream.streamId, prompts.runtime, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[userEmail] && requests[userEmail].previousPrompt === prompts.rvm) {
			requests[userEmail].runtime = message.messageText;
			requests[userEmail].previousPrompt = prompts.runtime;
			Symphony.sendMessage(message.stream.streamId, prompts.details, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[userEmail] && requests[userEmail].previousPrompt === prompts.runtime) {
			requests[userEmail].details = message.messageText;
			requests[userEmail].previousPrompt = prompts.details;
		}
	});
};

Symphony.initBot(__dirname + '/config.json')
	.then((symAuth) => {
		Symphony.getDatafeedEventsService(listenToMessages);
	});