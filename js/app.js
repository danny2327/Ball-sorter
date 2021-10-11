class Test {
    constructor() {
        // const fart = 'smelly';
        this.fart = 'smelly';
        // console.log(this.fart);

    }

    makeSound() {
        console.log("pftttttteeet");
    }
}

// class Test2 {
//     constructor(test) {
//         test.makeSound();
//     }
// }
// 
let test = new Test();
// let test2 = new Test2(test);

class App{
    constructor() {
        this.ballColours = {
            0: 'RED',
            1: 'BLUE',
            2: 'YELLOW',
            3: 'LIME',
            4: 'PURPLE',
            5: 'ORANGE',
            6: 'AQUA',
            7: 'TEAL',
            8: 'GREEN',
            9: 'WHITE',
            10: 'FUCHSIA',
            11: 'LIGHTPINK',
            12: 'BROWN',
            13: 'MIDNIGHTBLUE'
        };
                
        this.solverTab = document.getElementById('solver');
        this.builderTab = document.getElementById('builder');
        this.lnkSolver = document.getElementById('lnkSolver');
        this.lnkBuilder = document.getElementById('lnkBuilder');
        
        this.lnkSolver.addEventListener('click', () => {
            this.hideBuilder();
            this.showSolver();
        });
        
        this.lnkBuilder.addEventListener('click', () => {
            this.hideSolver();
            this.showBuilder();
            
        });
        
        this.solver = new Solver(this.ballColours);
        this.builder = new Builder(this.ballColours);

        // Hides Builder initially
        // hideSolver();
        this.hideBuilder();
    }
    showSolver() {
        this.solverTab.style.display = 'block';
    }

    showBuilder() {
        this.builderTab.style.display = 'block';
    }

    hideSolver() {
        this.solverTab.style.display = 'none';
        this.showBuilder();
    }

    hideBuilder() {
        this.builderTab.style.display = 'none';
        this.showSolver();
    }
}


class Solver {
    constructor(ballColours) {
        this.display = document.getElementById('display');
        
        this.prev = document.getElementById('prev');
        this.next = document.getElementById('next');

        this.stage = document.createElement('span');


        this.addEventListeners();

        this.prev.disabled = "true";
        
        
        // **Variables**
        this.tubes = {}
        this.numberOfTubes;
        this.ballsPerTube;
        this.http = new EasyHTTP;
        this.grid;
        this.ballColours = ballColours;
        this.currentStage = 0;
        this.playing = false;
        //this.player = new Player();
        this.timeoutHandle;
        //default play speed in ms
        this.playSpeed = 1000;

        
        // this.http.get('../Examples Solved/ball_sort_616_solved.json') //  14 colours x 5, puzzle 616 
        // this.http.get('../Examples Solved/ballsortSolved.json') //   3 colours x 3
        // this.http.get('../Examples Solved/ballSortSolved7x4.json') //   7 colours x 4
        // this.http.get('../Examples Solved/ballSortSolved3x4.json') //   3 colours x 4
        this.http.get('../Examples Solved/ballSortSolved12x5.json') 
            .then(data => this.solve(data))
            .catch(err => console.log(err)); 

    } //End of Constructor

    addEventListeners() {
        document.querySelectorAll(".actionButton").forEach(button => 
            button.addEventListener('click', (e) => {
                switch(e.target.id) {
                    case 'beginning':
                        this.firstStage();
                        break;
                    case 'prev':
                        this.prevStage();
                        break;
                    case 'next':
                        this.nextStage();
                        break;
                    case 'last':
                        this.lastStage();
                        break;
                    case 'play':
                        this.play();
                        break;
                    case 'playFromStart':
                        this.playFromStart();
                        break;
                    case 'pause':
                        this.pause();
                        break;
                    case 'slower':
                        this.slower();
                        break;
                    case 'faster':
                        this.faster();
                        break;
                    case 'reset':
                        this.reset();
                        break;
                }
        }));
        
        document.addEventListener('keydown', (e) => {
            const key = e.code
            switch(key) {
                case "ArrowLeft": {
                    this.prevStage();
                    break;
                }
                case "ArrowRight": {
                    this.nextStage();
                    break;
                }
                case "ArrowUp": {
                    this.firstStage();
                    break;
                }
                case "ArrowDown": {
                    this.lastStage();
                    break;
                }
                case "Space": {
                    this.playPause();
                    break;
                }
            }
        });
    }

    solve(data) {
        this.grid = Object.values(data);
        //look at the number of tubes in the first grid
        this.numberOfTubes = this.grid[0].length
        //look at the number of balls in the first tube in the first grid.
        this.ballsPerTube = this.grid[0][0].length;//getTubeSize()
        this.prepareToDraw();
    }


    prepareToDraw() {
        this.setDisplaySize();
        this.drawTubes();
    }

    setDisplaySize() {
        this.display.style.width = (60+(32*this.ballsPerTube)) + "px";
    }

    drawTubes(){
        //displays the tubes
        this.stage.innerText = `Stage ${this.currentStage+1} of ${this.grid.length}`;
        //reset Tubes
        this.tubes = {};
        for(let i = 0; i < this.numberOfTubes; i++) {
            let tube = new Tube(this.ballsPerTube)
            tube.setLeft(i);
            tube.setTop(100);
            this.tubes[i] = tube;
            
            //want to add - make the from and destination tubes change colour
            this.display.appendChild(tube.getTubeDiv());        
            // displays the balls
            //done in reverse so we're effectively drawing from the bottom up
            for (let x = this.grid[this.currentStage][i].length-1; x >= 0 ; x--) {
                //create ball (div), set class and color
                let ball = new Ball(this.grid[this.currentStage][i][x]);  
                ball.setBottom(x * 32)
                tube.addBall(ball);
            }        
        }
        this.display.appendChild(document.createElement("p"));
    }

    prevStage() {
        if(this.currentStage > 0) this.currentStage--;
        if(this.currentStage == 0) this.prev.disabled = true;
        this.next.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }

    nextStage() {
        if(this.currentStage < this.grid.length-1) this.currentStage++;
        if(this.currentStage == this.grid.length-1) this.next.disabled = true;
        this.prev.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    firstStage() {
        this.currentStage = 0;
        this.prev.disabled = true;
        this.next.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    lastStage() {
        this.currentStage = this.grid.length-1
        this.next.disabled = true;
        this.prev.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    async play() {
        this.resetTimeout();
        const wait = (timeToDelay) => new Promise((resolve) => this.timeoutHandle = setTimeout(resolve, timeToDelay));
        
        this.showPlayControls();
        while (this.currentStage < this.grid.length-1) {
            await wait(this.playSpeed);
            this.nextStage();
        }
        this.hidePlayControls();
    }
    
    playPause() {
        //if playing, pauses, if not, starts 
        if (this.isPlaying()) this.pause();
        else this.play();
    }
    
    isPlaying() {
        if (document.querySelector('.playControls').style.visibility == 'hidden') {
            return false; 
        } else {
            return true;
        }
    }
    
    playFromStart() {
        this.resetTimeout();
        this.currentStage = -1;
        this.play();
    }
    
    pause() {
        this.resetTimeout();
        this.hidePlayControls();
    }
    
    resetTimeout() {
        clearTimeout(this.timeoutHandle);
    }
    
    faster() {
        // don't want to be able to stop it
        if (this.playSpeed > 200) this.playSpeed-=200;
        console.log(this.playSpeed);
    }
    
    slower() {
        this.playSpeed+=200;
        console.log(this.playSpeed);
    }
    
    reset() {
        this.playSpeed = 1000;
        console.log(this.playSpeed);
    }
    
    showPlayControls() {
        document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'visible');  
    }
    
    hidePlayControls() {
        document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'hidden');
    }
    
}

class Builder {
    constructor(ballColours) {

        // **Variables**
        this.ballColours = ballColours;
    }
}

class Ball {
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

    setBottom(ballBottom) {
        this.ballDiv.style.bottom = ballBottom + "px";
    }

    getColour() {
        return this.colour;
    }

    clearColour() {
        this.ballDiv.style.backgroundImage = '';
        this.colour = '';
    }
}

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

    determineHeight() {
        return 30+(32*this.ballsPerTube)
    }

    addBall(ball) {
        this.balls.push(ball);
        this.tubeDiv.appendChild(ball.getDiv());
    }

    getTubeDiv() {
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


// class grid {
//     constructor(numberOfColours, numberOfBalls) {
//         this.numberOfColours = numberOfColours;
//         this.numberOfBalls = numberOfBalls;

//     }
// }

app = new App();

// BLUE
// RED
// YELLOW
// ORANGE
// PURPLE
// WHITE
// TEAL
// BROWN
// LIGHT PINK = LIGHTPINK
// DARK BLUE = NAVY
// DARK GREEN = GREEN
// LIGHT GREEN = LIME
// DARK PINK = FUCHSIA
// LIGHT BLUE = AQUA

// Make this project in this JS, and some frameworks like angular, react, vue


function createBall(colour = null) {
    //create ball (div), set class 
    let ball = document.createElement('div');
    ball.className = "ball";
    if (colour) ball.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${colour} 80%)`;
    ball.style.backgroundRepeat = "no-repeat";
    return ball;
}
