const tmi = require('tmi.js');
const fs = require('fs');
const EventEmitter = require('events')

class tmiInput{
    // todo possibly allow path to credentials as constructor parameter
    constructor(){
        this.event = new EventEmitter();

        // #region Open connection and authenticate user

        this.tmiCredentials = JSON.parse( fs.readFileSync("./server/assets/tmi_secrets.json") );
        this.opts = {
            identity: {
                username: this.tmiCredentials.username,
                password: this.tmiCredentials.password
            },
            channels: ['bombbeard']
        };
        this.client = new tmi.client(this.opts);

        //#endregion
    }

    start(){
        this.client.on('chat', (channel, userstate, message, self)=>{
            if( self ) return; // If ME, Do nothing.
            
            // HEY ME:
            //  if the value and key are the same in a JSON object, you dont need to delcare it twice
            //  Courtesy of: undefinedV1. Thank you!
            const messageData = {
                channel,
                userstate,
                message, 
                self
            };    
            
            this.event.emit('chatInput', messageData);
        });
        
        this.client.connect();
        console.log(this.client.readyState());
    }



    // Receive input


    // Transform data to accomodate internal representation.


    // Emit event with data




}

module.exports = tmiInput;