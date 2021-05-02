const accountSid = 'ACca0fc81e7812240c2d1b09b53b911b59';
const authToken = '3d06e2f49b8132166c059284afdfe758';
const client = require('twilio')(accountSid, authToken);


function sendMessage(date, time, hospital) {
    if (hospital) {
        client.messages
            .create({
                body: `The appointments  available at ${date} at ${time} hospital name is ${hospital}`,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+919158043074'
            })
            .then(message => console.log(message.sid))
            .done();
    } else {
        client.messages
            .create({
                body: `No appointments available on ${date}`,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+919158043074'
            })
            .then(message => console.log(message.sid))
            .done();
    }
}

function sendMessageWhole(msg, config) {
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