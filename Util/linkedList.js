const LinkedListNode = function(){
    let element = null;
    let next = null;
    let prev = null;

    const initialize = function(e, nextNode=null, prevNode=null){
        element = e;
        next = nextNode;
        prev = prevNode;
    };

    const getElement = function(){
        return element;
    };

    const getNext = function(){
        return next;
    };

    const getPrev = function(){
        return prev;
    };

    const setNext = function(nextNode){
        next = nextNode;
    }

    const setPrev = function(prevNode){
        prev = prevNode;
    }

    return {initialize, getElement, getNext, getPrev, setNext, setPrev};
};

const LinkedList = function(){
    let head = null;
    let tail = null;

    let count = 0;
    
    const initialize = function(){};

    const addNode = function(element){
        let newNode = LinkedListNode();
        newNode.initialize(element);

        if(count == 0){
            head = newNode;
            tail = newNode;
        }
        else{
            // connect the tail with the new node
            tail.setNext(newNode);
            newNode.setPrev(newNode);

            tail = newNode;
        }
        count += 1;
    }

    const removeNode = function(index = 0){
        if(index < count && count > 0){
            let iterator = head;
            let i = 0;

            while(i != index){
                iterator = iterator.getNext();
                i += 1;
            }

            let prev = iterator.getPrev();
            let next = iterator.getNext();

            // remove the iterator from the list
            iterator.setPrev(null);
            iterator.setNext(null);

            if(prev != null){
                prev.setNext(next);
            }
            if(next != null){
                prev.setPrev(prev);
            }
            
            // iterator is at tail
            if(next == null){
                tail = prev;
            }

            // iterator is at head
            if(prev == null){
                head = next;
            }

            count -= 1;

            return iterator.getElement();
        }
        return null;
    }

    const removeElement = function(element){
        if(count > 0){
            let iterator = head;
            while(iterator != null || iterator.getElement() != element){
                iterator = iterator.getNext();
            }
    
            if(iterator != null){
                let prev = iterator.getPrev();
                let next = iterator.getNext();
    
                // remove the iterator from the list
                iterator.setPrev(null);
                iterator.setNext(null);
    
                if(prev != null){
                    prev.setNext(next);
                }
                if(next != null){
                    prev.setPrev(prev);
                }
                
                // iterator is at tail
                if(next == null){
                    tail = prev;
                }
    
                // iterator is at head
                if(prev == null){
                    head = next;
                }
    
                count -= 1;
                return iterator.getElement();
            }
        }
        return null;
    }

    const getCount =  function(){
        return count;
    }

    const peak = function(){
        return head;
    }

    return {initialize, addNode, removeNode, removeElement, getCount, peak};
};



