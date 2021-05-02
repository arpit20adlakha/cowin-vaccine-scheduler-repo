
function sendMessageWhole(msg, config) {
    const client = require('twilio')(config.accountSid, config.authToken);
    for(let user_number of config.user_numbers) {
        client.messages
            .create({
                body: `${msg}`,
                from: config.twilio_sandbox_number,
                to: user_number
            })
            .then(message => console.log(message.sid))
            .done();
    }
}


module.exports = {
    sendMessage : sendMessage,
    sendMessageWhole: sendMessageWhole
}