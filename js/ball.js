class Ball {
    //takes an optional colour, will be blank if not
    constructor(colour = null) {
        this.ballDiv = this.makeDiv(colour);
        this.setColour(colour);
        return this;
    }

    makeDiv(colour) {
        let div = document.createElement('div');
        div.className = "ball";
        return div;
    }

    getDiv() {
        return this.ballDiv;
    }

    setColour(colour) {
        if (colour) {
            this.ballDiv.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${colour} 80%)`;
            this.ballDiv.style.backgroundRepeat = "no-repeat";
            this.colour = colour;
        } else {
            this.clearColour();
        }
    }

    setLeft(ballLeft) {
        this.ballDiv.style.left = ballLeft + "px";
    }

    setBottom(ballBottom) {
        this.ballDiv.style.bottom = ballBottom + "px";
    }

    getColour() {
        return this.colour;
    }

    hasColour() {
        if (this.colour != "") return true;
        return false;
    }

    clearColour() {
        this.ballDiv.style.backgroundImage = '';
        this.colour = '';
    }

    setBorder() {
        this.ballDiv.style.border = '2px solid red';
    }

    resetBorder() {
        this.ballDiv.style.border = '';
    }

    setID(id) {
        this.ballDiv.id = id;
    }
}