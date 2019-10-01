// tmi.js and fs
// https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder
// @strothj: F2 to rename a variable when you click it

const QuotaEnforcer = require('./server/quotaEnforcer.js');
const ChatQ = require('./server/chatQ.js');
const incomingChatQ = new ChatQ();
const outgoingChatQ = new ChatQ();
const incomingQEnforcer = new QuotaEnforcer(incomingChatQ, 0, 0, 1);
const outgoingQEnforcer = new QuotaEnforcer(outgoingChatQ, 100); //Rate for modded users = 100/30seconds

const tmi = require('tmi.js');
const fs = require('fs');
const express = require('express');
const app = express();

const TMIInput = require("./server/tmi-input.js");
const tmiInput = new TMIInput();
tmiInput.start();

const StreamlabsInput = require('./server/streamlabs-input.js')
const streamlabsInput = new StreamlabsInput();
streamlabsInput.start();

const keyWords = ["panicBasket", "BloodTrail"];


//#region Setting Up TMI

//#endregion


//#region Listening and Routing 

// There's a small semantic difference. The one with the bracket returns no value, 
// the bracketless version, returns the result of console.log (which in this case is also nothing)
// Courtesy of: undefinedV1 && strothj
// app.listen(3000,()=> console.log("Listening on 3000") );


// client listeners
tmiInput.event.on('chatInput', (messageData)=>{
    // queue input
    incomingQEnforcer.addItem(messageData);
});


incomingQEnforcer.eventEmitter.on('enqueue', messageData=>{
    messageParser(messageData)
});

outgoingQEnforcer.eventEmitter.on('enqueue', messageData=>{
    outgoingQEnforcer.msgSent = false;
    client.say(messageData.channel, messageData.message).then((channel)=>{
        outgoingQEnforcer.msgSent = true;
    })
    .catch(()=>{
        console.log(`client.say error`);
        outgoingQEnforcer.msgSent = true;
    });
});

//#endregion


//#region Response functions

// Chat Message
function messageParser(messageData){
    // console.log(`Message: ${messageData.message}`);
    const parsedInput = messageData.message.split(" ");

    if(parsedInput.includes(keyWords[0])){
        // ...messageData is copied instead of referenced. @Pyro240
        outgoingQEnforcer.addItem(messageMutator(messageData, 
            `${keyWords[0]} ${keyWords[0]} ${keyWords[0]} ${keyWords[0]}`));
    }
    else if(parsedInput.includes(keyWords[1])){
        outgoingQEnforcer.addItem(messageMutator(messageData, 
            `PJSalt PJSalt PJSalt PJSalt`));
    }

    if(parsedInput[0][0] === "!"){ commandParser(messageData); }
    
}



//#endregion

//#region Helper Functions

function commandParser(messageData){
    const parsedInput = messageData.message.split(" ");
    if(parsedInput[0]===`!dice`){
        // const isNull = (parsedInput[1] === null);
        var diceRoll, outGoingMessage;

        if(parsedInput[1] == null){
            diceRoll = rollDice("20");
            if(diceRoll === 20){
                console.log(`You rolled a Nat-20!!! Woo!!`);
                outgoingQEnforcer.addItem(messageMutator(messageData, 
                    `You rolled a Nat-20!!! Woo!!`));
            }
            else if( diceRoll === 1){
                console.log(`You rolled a Nat-1!!! Too bad!`);
                outgoingQEnforcer.addItem(messageMutator(messageData, 
                    `You rolled a Nat-1!!! Too bad!`));
                    
            }
            else{
                console.log(`You rolled a ${diceRoll}!`);
                outgoingQEnforcer.addItem(messageMutator(messageData, 
                    `You rolled a ${diceRoll}!`));
            }
        }
        else if(!isNaN(parsedInput[1]) && parsedInput[1] >= 2){
            
            // <3 fillmyvoid
            if(parsedInput[1] === "0xDEADBEEF") {
                client.say("bombbeard", "BloodTrail");
                return;
            }
            // roll an n-sided die
            diceRoll = rollDice(parsedInput[1]);
            if(diceRoll === Number.POSITIVE_INFINITY || diceRoll === Number.NEGATIVE_INFINITY) {
                console.log(`You rolled an ${diceRoll}!`);
                outgoingQEnforcer.addItem(messageMutator(messageData, 
                    `You rolled an ${diceRoll}!`));
            }else{
                console.log(`You rolled a ${diceRoll}!`);
                outgoingQEnforcer.addItem(messageMutator(messageData, 
                    `You rolled a ${diceRoll}!`));
            }
        }

        else{
            console.log(`The second argument of !dice needs to be a number that is 2 or larger.`);
            outgoingQEnforcer.addItem(messageMutator(messageData, 
                `The second argument of !dice needs to be a number that is 2 or larger.`));
        }
    }
}

// Dice roller
function rollDice(numSides){
    return Math.ceil(Math.random() * numSides);
}

// messageMutator!!!
function messageMutator(messageData, newMessage){
    const newMData = { ...messageData};
    newMData.message = newMessage;
    return newMData;
}

//#endregion


