const axios = require('axios');
const cron = require('node-cron');
const message = require('./send-whatsapp');
const fs = require('fs');
let rawConfig = fs.readFileSync('./config.json');
let config = JSON.parse(rawConfig);

async function main() {
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin";
    let pinCode = config.pincode;
    let dates = config.dates;
    let arrResponses = [];

    url = addPinCode(url, pinCode);

    for(let date of dates) {
        let dateBasedUrl = addDate(url, date);
        let response = await axios.get(dateBasedUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36' }  });
        arrResponses.push({"date": date, "availability": response.data});
    }

    return arrResponses;
}

async function callMain() {
    const answers = await main();

    for(let obj of answers) {
        console.log("Appointments available for date ", obj.date);
        let sessions = obj.availability.sessions;

        if (sessions.length == 0) {
            message.sendMessageWhole(`No slots available for the date ${obj.date}`, config);
        } else {
            for (let session of sessions) {
                let slotArray = session.slots;
                let str = "slots available are :";
                for(let i = 0; i < slotArray.length; i++) {
                    str = str.concat(`\n${i + 1}. ${slotArray[i]}`);
                }
                session.slots = JSON.stringify(slotArray);

                let {center_id, lat, long, session_id, ...formattedMsg} = session;

                let answer = `For the date ${formattedMsg.date} the vaccine is available at Hospital ${formattedMsg.name} from ${formattedMsg.from} to ${formattedMsg.to}. Name of the vaccine available is ${formattedMsg.vaccine}. Min age Limit is ${formattedMsg.min_age_limit}. The capacity available is ${formattedMsg.available_capacity}. Fee charged for the vaccine is ${formattedMsg.fee}. And the ${str}`
                message.sendMessageWhole(answer, config);
            }
        }

        console.log(obj.availability);
    }
}

callMain().then(() => {
    console.log("Get Vaccinated !!!");
});

// cron.schedule('*/1 * * * *', () => {
//
// });


function addPinCode(url, pincode) {
    return url.concat(`?pincode=${pincode}`);
}

function addDate(url, date) {
    return url.concat(`&date=${date}`);
}