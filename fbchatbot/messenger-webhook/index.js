'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server

const PAGE_ACCESS_TOKEN = "EABENOjgIvPUBAEQ38yY0IiCN3fEDRSdXKraKPOKZAVXhPcTh4cQXXZCGrtEnogxXqOrRGP7pLD7DiFe9uRFTAwXM3E7RzwLYV74g9WoXJR5zw7XZBZCiaR5VaKFgAaUicF2AiHFBTulsvKBiHnWNEAeINU5aPvBDPPouxW4nZC35AplqOffFg"

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
    console.log(req.body)

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            // 取得發送者的 PSID
            // let sender_psid = webhook_event.sender.id;

            // if (webhook_event.message) {
            //     handleMessage(sender_psid, webhook_event.message);        
            // } else if (webhook_event.postback) {
            //     handlePostback(sender_psid, webhook_event.postback);
            // }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = PAGE_ACCESS_TOKEN
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});

function handleMessage(sender_psid, received_message) {
    let response;

    if (received_message.text) {    
        // 回傳的文字訊息
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }

    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    let response;

    // 取得發送者回覆內容
    let payload = received_postback.payload;
    
    // 判斷回覆的內容，對應機器人回應的訊息
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

// 發送機器人的回應
function callSendAPI(sender_psid, response) {
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            // console.log('---> message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    }); 
}