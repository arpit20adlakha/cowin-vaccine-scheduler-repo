

const axios = require('axios');
const prompt = require('prompt-sync')();
const cron = require('node-cron');
const message = require('./send-whatsapp');
const fs = require('fs');

async function main() {
    let rawConfig = fs.readFileSync('./config.json');
    let config = JSON.parse(rawConfig);
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin";
    let pinCode = config.pincode;
    let dates = config.dates;
    // pinCode = prompt("Enter your pin code ");
    // let dateString = prompt("Enter the dates in a comma separated format '03-04-2021,04-04-2021' where the data format is DD-MM-YYYY ");
    // dates = dateString.split(',');
    let arrResponses = [];

    url = addPinCode(url, pinCode);

    for(let date of dates) {
        let dateBasedUrl = addDate(url, date);
        let response = await axios.get(dateBasedUrl);

        arrResponses.push({"date": date, "availability": response.data});
    }

    return arrResponses;
}

async function callMain() {
    const answers = await main();
    // if (Array.isArray(answers) && answers.length > 0 && answers[0].availability.sessions[0]) {
    //     let date = answers[0].date;
    //     let time = JSON.stringify(answers[0].availability.sessions[0].slots);
    //     let hospital = answers[0].availability.sessions[0].name;
    //     sendMessage.sendMessage(date, time, hospital);
    // } else {
    //     sendMessage(answers[0].date);
    // }
    for(let obj of answers) {
        console.log("Appointments available for date ", obj.date);
        let sessions = obj.availability.sessions;
        for (let session of sessions) {
             let slotArray = session.slots;
             let str = "slots available are :";
             for(let i = 0; i < slotArray.length; i++) {
                 str = str.concat(`\n${i + 1}. ${slotArray[i]}`);
             }
             session.slots = JSON.stringify(slotArray);

             let {center_id, lat, long, session_id, ...formattedMsg} = session;

             let answer = `For the date ${formattedMsg.date} the vaccine is available at Hospital ${formattedMsg.name} from ${formattedMsg.from} to ${formattedMsg.to}. Name of the vaccine available is ${formattedMsg.vaccine}. The capacity available is ${formattedMsg.available_capacity}. Fee charged for the vaccine is ${formattedMsg.fee}. And the ${str}`
             message.sendMessageWhole(answer, config);
        }
        console.log(obj.availability);
    }
}

cron.schedule('*/1 * * * *', () => {
    callMain().then(() => {
        console.log("Get Vaccinated !!!");
    });
});


function addPinCode(url, pincode) {
    return url.concat(`?pincode=${pincode}`);
}

function addDate(url, date) {
    return url.concat(`&date=${date}`);
}