// RxJS synchronization timing of async operations !!BEWARE STEEP LEARNING CURVE!!

class ChatQ{
    constructor(){
        this.q = [];
    }

    enqueue(input){
        this.q.splice(0,0, input); //( index to insert at, how many elements to remove from that index, the elements to add )
    }

    dequeue(){
        // check if quota is fine
        return this.q.shift(); //returns and deletes the last element of the array
    }

    isEmpty(){
        return (this.q.length <= 0);
    }
    

}

module.exports = ChatQ;