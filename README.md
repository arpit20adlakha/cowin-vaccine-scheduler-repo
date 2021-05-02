
<img src="https://user-images.githubusercontent.com/16517873/116822026-4bcd6f80-ab9a-11eb-81cf-5b83c6933341.jpg" width="200" height="400"/>
# cowin-vaccine-scheduler-repo

**Steps to setup twilio whatsapp sandbox**

1. [Link to setup](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn?frameUrl=%2Fconsole%2Fsms%2Fwhatsapp%2Flearn%3Fx-target-region%3Dus1)

2. Enter the details in the config file located at the root of the repo after the sandbox setup.

3. Refer to the image "How to get twilio credentials.png" to add "accountSid", "authToken".

4. Once the twilio setup is done, add the pin code and dates you want to get information for on different whatsapp numbers registered in the sandbox.

5. Make sure you send the message to sandbox from the numbers you configure and add the sandbox number to your contacts.

6. Dont add too many dates and numbers twilio will rate limit the requests otherwise.

**Steps to Run the script**

1. The dependencies for the script can be donwloaded using 
`npm install`

2. The script can be run using `node index.js`

"WhatsAppScreenShot.jpg" image shows the whatsapp messages received.




