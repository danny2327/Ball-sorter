class Tube {
    constructor(ballsPerTube, i) {
        this.ballsPerTube = ballsPerTube;

        this.balls = [];

        this.tubeDiv = this.makeDiv(); 

        this.setHeight(this.determineHeight());
    }

    makeDiv() {
        let div = document.createElement('div');
        div.className = 'tube';
        return div;
    }

    getBalls() {
        return this.balls;
    }

    determineHeight() {
        return 30+(32*this.ballsPerTube)
    }

    addBall(ball) {
        this.balls.push(ball);
        this.tubeDiv.appendChild(ball.getDiv());
    }

    getDiv() {
        return this.tubeDiv;
    }

    setHeight(height) {
        this.height = height;
        this.tubeDiv.style.height = this.height + "px";
    }

    //This shouldn't be in the tube class, it should be controlled by the controller (builder or solver)
    // Won't even have to be once I get rid of the absolute stuff
    setLeft(i) {
        let tubeLeft = 30 + (60*i);
        this.tubeDiv.style.left = tubeLeft + "px"; 
    }

    setTop(top) {
        this.tubeDiv.style.top = top + "px";
    }
}
