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

		const messageText = message.messageText.toLowerCase();

		if (messageText === prompts.create) {
			requests[message.user.email] = {
				previousPrompt: prompts.create
			};
			Symphony.sendMessage(message.stream.streamId, prompts.subject, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[message.user.email] && requests[message.user.email].previousPrompt === prompts.create) {
			requests[message.user.email].subject = message.messageText;
			requests[message.user.email].previousPrompt = prompts.subject;
			Symphony.sendMessage(message.stream.streamId, prompts.rvm, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[message.user.email] && requests[message.user.email].previousPrompt === prompts.subject) {
			requests[message.user.email].rvm = message.messageText;
			requests[message.user.email].previousPrompt = prompts.rvm;
			Symphony.sendMessage(message.stream.streamId, prompts.runtime, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[message.user.email] && requests[message.user.email].previousPrompt === prompts.rvm) {
			requests[message.user.email].runtime = message.messageText;
			requests[message.user.email].previousPrompt = prompts.runtime;
			Symphony.sendMessage(message.stream.streamId, prompts.details, null, Symphony.MESSAGEML_FORMAT);
		} else if (requests[message.user.email] && requests[message.user.email].previousPrompt === prompts.runtime) {
			requests[message.user.email].details = message.messageText;
			requests[message.user.email].previousPrompt = prompts.details;
		}
	});
}



Symphony.initBot(__dirname + '/config.json')
	.then((symAuth) => {
		Symphony.getDatafeedEventsService(listenToMessages);
	});