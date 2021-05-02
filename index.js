

const axios = require('axios');
const prompt = require('prompt-sync')();
// const cron = require(node-cron);

async function main() {
    let url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin";
    let pinCode;
    let dates = [];
    pinCode = prompt("Enter your pin code ");
    let dateString = prompt("Enter the dates in a comma seperated format '03-04-2021,04-04-2021' where the data format is DD-MM-YYYY ");
    dates = dateString.split(',');
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
    for(let obj of answers) {
        console.log("Appointments available for date ", obj.date);
        let sessions = obj.availability.sessions;
        for (let session of sessions) {
             let slotString = session.slots;
             session.slots = JSON.stringify(slotString);
        }
        console.log(obj.availability);
    }
}

callMain().then(() => {
    console.log("Get Vaccinated !!!");
});

function addPinCode(url, pincode) {
    return url.concat(`?pincode=${pincode}`);
}

function addDate(url, date) {
    return url.concat(`&date=${date}`);
}