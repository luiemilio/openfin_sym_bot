const apiConfig = require('./api_config.json');
const zendesk = require('node-zendesk');

const client = zendesk.createClient({
	username: apiConfig.username,
	token: apiConfig.token,
	remoteUri: apiConfig.remoteUri
});

const createTicket = (ticketInfo, cb) => {
	client.tickets.create(ticketInfo, cb);
};

const parseTicket = (answersFromClient) => {
	let ticket = {
		"ticket": {
			"subject": answersFromClient.subject,
			"comment": {
				"body": `RVM: ${answersFromClient.rvm}
                        Runtime: ${answersFromClient.runtime}
                        Details:
                        ${answersFromClient.details}`
			},
			"requester": {
				"locale_id": 1,
				"name": answersFromClient.requesterName,
				"email": answersFromClient.requesterEmail
			}
		}
	};
	return ticket;
}

module.exports = {
	createTicket: createTicket,
	parseTicket: parseTicket
};