export class PriorityQueue {
    constructor() {
      this.collection = [];
    }

    push(node){

        // console.log(`PUSHED  ${node.weight}, ${node.row}, ${node.column}, ${node.rowDir}, ${node.columnDir}, ${node.steps}`)

        if (this.isEmpty()) { 
            this.collection.push(node);
        } 
        else {
            let added = false;

            for (let index = 0; index < this.collection.length; index++){
                if (node.weight < this.collection[index].weight) { 

                    this.collection.splice(index, 0, node);
                    added = true;
                    break;
                }
            }
            
            if (!added) {
                this.collection.push(node);
            }
        }
    }

    pop() {
        let node = this.collection.shift();
        return node;
    }


    isEmpty() {
        return (this.collection.length === 0) 
    }
}