class Card {
    constructor(name, id, imageLink){
        this.name = name;
        this.id = id;
        this.imageLink = imageLink;
    }
    getName(){
        return this.name;
    }
    getID(){
        return this.id;
    }
    getImageLink(){
        return this.imageLink;
    }
}
