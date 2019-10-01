const ChatQueue = require('./chatQ');
const EventEmitter = require('events')

class QuotaEnforcer{
    constructor(queueToEnforce, rateQuota=20, quotaInterval=30000, direction=0){
        this.queue = queueToEnforce;

        this.eventCounter = 0;
        this.rateQuota = rateQuota;
        this.quotaInterval = quotaInterval;
        this.canEmit = true;
        this.msgSent = true;
        // this.enqueueEvent = new Event(`enqueue`);
        this.eventEmitter = new EventEmitter();

        // direction === 0 Outgoing, else incoming
        this.direction = direction;

        this.eventEmitter.on('timerUp', ()=>{

            if( this.direction === 0 )
                console.log('Time Up: sending queue request!');
            this.attemptMsgSend();
        });
    }

    addItem(item){
        this.queue.enqueue(item);
        this.attemptMsgSend();
    }


    attemptMsgSend(){
        if(this.checkQuota() && !this.queue.isEmpty()){
            this.eventCounter++
            this.eventEmitter.emit('enqueue', this.queue.dequeue())
            this.taskTimer();
        }
    }
    
    checkQuota(){
        return (this.rateQuota === 0 || (this.eventCounter < this.rateQuota && this.msgSent === true ) );
    }

    async taskTimer(){
        setTimeout(()=>{
            this.eventCounter--;
            if(this.direction === 0)
            this.eventEmitter.emit('timerUp');
        },this.quotaInterval);
    }

}
module.exports = QuotaEnforcer;