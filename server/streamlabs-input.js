// https://www.npmjs.com/package/streamlabs-socket-client
// https://streamlabs.readme.io/docs/socket-api

const fs = require('fs');
const StreamlabsClient = require('streamlabs-socket-client');

class streamlabsInput{
    constructor(){
        // Gather credentials
        this.credentials = JSON.parse(fs.readFileSync('./server/assets/streamlabs_secrets.json'));
        
        // Open connection and authenticate user
        this.client =  new StreamlabsClient({
            token: this.credentials.streamlabsSocketToken,
            emitTests: true
        });

        
    }

    start(){

        // Receive input
        this.client.on('follow', eventData =>{
            console.log(eventData);
        });
        this.client.on('subscribtion', eventData =>{
            console.log('Subscribtion Found: ');
            console.log(eventData);
        });
        this.client.on('resubscription', eventData =>{
            console.log(eventData);
        });
        this.client.on('donation', eventData =>{
            console.log('Donation Found: ');
            console.log(eventData);
        });
        this.client.on('host', eventData =>{
            console.log("Host event!!");
            console.log(eventData);
        });
        this.client.on('raid', eventData =>{
            console.log("Raid event!!");
            console.log(eventData);
        });
        this.client.on('bits', eventData =>{
            console.log(eventData);
        });

        this.client.on('event', eventData =>{
            console.log("random event:");
            console.log( eventData);
        });

        // Transform data to accomodate internal representation.
        
        
        // Emit event with data


        this.client.connect();
        console.log('SLabs connected');

        this.client.client.emit('event', {
            type: 'raid',
            message: [{
                name:'surebert',
                raiders: 3,
                type: 'manual', 
                _id: '34tf34f89oij'
            }],
            for: 'twitch_account'
        });

        this.client.client.emit('event', {
            
                "type": "donation",
                "message": [
                  {
                    "id": 96164121,
                    "name": "test",
                    "amount": "13.37",
                    "formatted_amount": "$13.37",
                    "formattedAmount": "$13.37",
                    "message": "test donation",
                    "currency": "USD",
                    "emotes": null,
                    "iconClassName": "user",
                    "to": {
                      "name": "Sai Harsha Maddela"
                    },
                    "from": "test",
                    "from_user_id": null,
                    "_id": "0820c9d5bafd768c9843f5e35c885e71"
                  }
                ],
                "event_id": "evt_17e5f4dc6888767ed9799f78dfa2cabc"
              
        })

    }
    
}

module.exports = streamlabsInput;