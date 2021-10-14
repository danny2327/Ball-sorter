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
        this.hideSolver();
        // this.hideBuilder();
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
            this.display.appendChild(tube.getDiv());        
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
        this.inputBalls = document.getElementById('numBalls');
        this.inputColours = document.getElementById('numColours');
        //Where the tubes and balls are shown
        this.tubeDisplay = document.getElementById('builderTubeDisplay');

        //The parent of the ball selector. Used for showing messages. 
        this.selectorDisplay = document.getElementById('builderSelectorDisplay');

        //Where the ball selector is shown. 
        this.ballSelector = document.getElementById('ballSelect');

        this.output = document.getElementById('output');

        this.addEventListeners();

        // **Variables**
        this.ballColours = ballColours;
        this.currentBallPosition = [0,0];
        this.currentBall;        
        this.numEachColour = {};
        this.ballsPerTube;
        this.numberOfTubes;
        this.grid;
        this.full = false;
        this.tubes = {};

        this.prepareToDraw();
        this.startBuild();
    }

    addEventListeners() {
        // Clicking on the output copies the text (meant for the JSON but will work on any message) and displays a msg for 3 seconds.
        // nav clipboard api is async func  
        this.output.addEventListener('click', async () => {
            await navigator.clipboard.writeText(this.output.textContent);
            let jsonMsg = document.createTextNode('JSON Copied!');
            this.output.appendChild(jsonMsg);
            setTimeout(() => {
                this.output.removeChild(jsonMsg);
            }, 3000)
        });

        document.getElementById('updateGrid').addEventListener('click', (e) => {
            if (confirm('Are you sure you want to change the size and reset?')) {
                //redraw
                this.prepareToDraw();
                this.resetCurrentBallPosition();
                this.setBall();
                this.selectBall();
                this.zeroNumColourList();
              } else {
                // Do nothing!
                this.displayMessage('No Change');
                //undoes the change
                this.inputColours.value = this.numberOfTubes-2;
                this.inputBalls.value = this.ballsPerTube;
              }
        });

        //Resets balls but leaves the grid size alone - in fact if the input numbers have changed, but update grid has not been clicked, it will update them as well. 
        document.getElementById('resetBuilder').addEventListener('click', () => {
            this.prepareToDraw();
            this.resetCurrentBallPosition();
            this.setBall();
            this.selectBall();
            this.zeroNumColourList();
            this.output.innerText = '';
        });

        //Ball in selector click listener
        this.ballSelector.addEventListener('click', (e) => {
            let ball = e.composedPath()[0];
            if(ball.id == 'clearBall') {
                //update ball with no arg is clearing it.
                this.updateBall();
            } else if (!this.isGridFull() ) {
                if(ball.className == 'ball') {
                    let bg = this.extractColourFromGradient(ball.style.backgroundImage);
                    //If max number of chosen colour is not reached
                    if(!this.isColourFull(bg)) {
                        this.updateBall(bg);
                        this.nextBall();
                    } else {
                        //max number of this colour already exists.
                        this.displayMessage(`Max number of ${bg} balls (${this.ballsPerTube}) already exist`);
                    }
                }        
            } 
        });

        //Ball in tube click listener to select a ball to change
        this.tubeDisplay.addEventListener('click', (e) => {
            // There must be a better way to do this than have to loop through every 'ball' div comparing them.  
            if (e.composedPath()[0].className == 'ball') {
                let clickedBall = e.composedPath()[0];
                //look through each ball in each tube until I find the one that is the same as the one that was clicked.  I do this because the ball doesn't know where it is in which tube. 
                let tubes = this.getTubes();
                // Had to do the Object.keys(tubes).length for it to work.
                //Had to do -2 on this one, didn't previously, should investigate why
                for(let i = 0; i < Object.keys(tubes).length-2; i++) {
                    let balls = this.getBalls(tubes[i]);
                    console.log('tube', tubes[i]);
                    for (let x = this.ballsPerTube-1; x >= 0 ; x--) { 
                        let ball = balls[x];
                        // console.log('ball', x, ball);
                        if (ball.getDiv() == clickedBall) {
                            console.log('clickedBall', clickedBall)
                            this.resetBorder();
                            this.currentBallPosition = [i,x];
                            this.setBall();
                            this.selectBall();
                        }
                    }
                }
            }
        });
        
        document.getElementById('genJSON').addEventListener('click', (e) => {
            if(this.isGridFull()) {
                this.fillGrid();
                this.outputJSON();
            } else {
                //need to display
                this.displayMessage('Grid is not complete');
            }
        });
    }

    // ***UI***  //
    // ***BUILDING***  //
    // ***OUTPUT***  //


    prepareToDraw() {    
        this.resetTubes();
        this.getInputs();
        this.drawTubes();
        this.drawBallSelector();
        this.placeOutput();
    }
    
    startBuild() {
        this.setBall();
        this.selectBall();
        this.zeroNumColourList();
    }

    getInputs() {
        //Tubes are 2 more than num of colours
        this.numberOfTubes = (parseInt(this.inputColours.value) + 2);
        this.ballsPerTube = this.inputBalls.value;
    }
    
    drawTubes() {
        //displays the tubes
        for(let i = 0; i < this.numberOfTubes; i++) {
            let tube = new Tube(this.ballsPerTube);        
            this.tubes[i] = tube;   
            tube.setLeft(i);
            tube.setTop(100);
            this.tubeDisplay.appendChild(tube.getDiv()); 
            // displays the balls
            //done in reverse so we're effectively drawing from the bottom up
            for (let x = this.ballsPerTube-1; x >= 0 ; x--) {            
                if(i < this.numberOfTubes-2) {
                    let ball = new Ball();
                    ball.setBottom(x * 34)
                    // add the ball to the tube
                    tube.addBall(ball);
                }
            }        
        }
        this.tubeDisplay.appendChild(document.createElement("p"));
    }

    drawBallSelector() {
        this.ballSelector.innerHTML = '';
        this.ballSelector.style.width = (parseInt(this.numberOfTubes)-2)*65;
        this.ballSelector.style.height = 35;
        this.ballSelector.style.top = 80+(32*this.ballsPerTube)+"px";
        let ball;
        for (let i = 0; i < parseInt(this.numberOfTubes)-2; i++) {
            ball = new Ball(this.ballColours[i])
            // let ball = createBall(this.ballColours[i])
            this.ballSelector.appendChild(ball.getDiv());
            ball.setLeft(i * 32);     
        }
        //Add 'clear' ball at the end
        ball = new Ball();
        ball.setID('clearBall');
        this.ballSelector.appendChild(ball.getDiv());
        ball.setLeft((parseInt(this.numberOfTubes)-2) * 32)
    }

    resetCurrentBallPosition() {
        this.currentBallPosition = [0,0];
    };

    isGridFull() {
        let isFull = true;
        for(let colour in this.numEachColour) {
            if (parseInt(this.numEachColour[colour]) < parseInt(this.ballsPerTube)) { 
                isFull = false;
            }
        };
        return isFull;
    }

    isColourFull(colour) {
        if (this.numEachColour[colour.toUpperCase()] == this.ballsPerTube) {
            return true;
        }
        return false;
    }

    placeOutput() {
        let BSTop = parseInt(this.ballSelector.style.top) + 30;
        this.output.style.top = BSTop +"px";
    }

    resetTubes() {
        this.tubeDisplay.innerHTML='';
        this.tubes = {};
    }

    zeroNumColourList() {
        // This list keeps track of how many of each ball has been added so only the correct number can be added. 
        //Need to clear it each time
        this.numEachColour = {};
        for(let i=this.numberOfTubes-3; i >= 0; i-- ) {
            this.numEachColour[this.ballColours[i]] = 0;
        }
    }

    incrementNumColourList(colour) {
        this.numEachColour[colour.toUpperCase()]++;
        this.ballSelectVisibility();
    }

    decrementNumColourList(colour) {
        this.numEachColour[colour.toUpperCase()]--;
        this.ballSelectVisibility();    
    }

    ballSelectVisibility() {
        //each time a ball is changed, run this to see if any colours are fully selected, or no longer fully selected. 
        this.ballSelector.querySelectorAll('.ball').forEach((ball) => {
            if(ball.id == 'clearBall') return;
            if (this.numEachColour[this.extractColourFromGradient(ball.style.backgroundImage).toUpperCase()] == this.ballsPerTube) {
                ball.style.opacity = "0.5";
            } else {
                ball.style.opacity = "1";
            }
        })
    }
/////////////////////////
    resetBorder() {
        this.currentBall.resetBorder();
    }
/////////////////////////
    selectBall() {
        // console.log(this.currentBall);
        this.currentBall.setBorder();
    }

    setBall() {
        let balls = this.getBalls();
        // console.log(`Balls from tube ${this.currentBallPosition[0]}`,balls)
        if(balls) {
            this.currentBall = balls[this.currentBallPosition[1]];
        } else {
            this.currentBall;
        }

    }

    getBalls(tube = null) {
        // console.log('this.currentBallPosition', this.currentBallPosition)
        //func can take an optional tube and return the balls from that tube. Otherwise it will return the balls from the current tube.
        if(!tube) {
            let tubes = this.getTubes();
            // console.log('tubes',tubes);
            tube = tubes[this.currentBallPosition[0]]
        }
        return tube.getBalls();
    }

    getTubes() {
        // let tubes = this.tubes;// tubeDisplay.querySelectorAll('.tube');
        return this.tubes;
    }

    setTubes() {

    }

    updateBall(newColour = null) {
        //if no colour provided, the clear was clicked, so decrement the colour if one exists, and then clear the ball.
        if(!newColour) {
            console.log(this.currentBall.getDiv())
            // If the ball BG image doesn't start with URL             and            ball bg image isn't nothing
            // if(this.currentBall.getDiv().style.backgroundImage.id !== 'clearBall' && this.currentBall.style.backgroundImage !== '') {
            if(this.currentBall.getDiv().style.backgroundImage.substr(0,2) !== 'url' && this.currentBall.getDiv().style.backgroundImage !== '') {
                this.decrementNumColourList(this.extractColourFromGradient(this.currentBall.getDiv().style.backgroundImage));
            }
            this.currentBall.clearColour();
            
        } else {   //Else set the new colour provided
            // If the ball selected has a colour already,it was manually selected and therefore the colour being replaced should be decremented in the colour list
            if (this.currentBall.getDiv().style.backgroundImage !== '') {
                this.decrementNumColourList(this.extractColourFromGradient(this.currentBall.style.backgroundImage));
            }
            // currentBall.style.backgroundColor = newColour;
            this.currentBall.setColour(newColour);
            this.incrementNumColourList(newColour);
        }
    }

    extractColourFromGradient(gradient) {
        //Have to use this method because in some cases I rely on the bg color, and need to be able to know it.
        let temp = gradient.split(',')[2];
        return(temp.slice(1,-5));
    }

    nextBall() {
        // console.log('this.currentBallPosition',this.currentBallPosition);
        let tube = this.currentBallPosition[0];
        let ball = this.currentBallPosition[1];
        // if not done in tube, next ball
        if (ball < this.ballsPerTube-1) {
            this.currentBallPosition[1]++
            this.resetBorder();
            this.setBall();
            this.selectBall();  
        // if one tube is done, next tube, back to place 0         
        } else if (tube < this.numberOfTubes-3) {
            this.currentBallPosition[1] = 0;
            this.currentBallPosition[0]++;
            this.resetBorder();
            this.setBall();
            this.selectBall();  
        } else {
            //else all have been filled
            this.resetBorder();
        }  
    }

    displayMessage(message, timeout = true) {
        this.output.innerText = message;
        this.output.innerHTML += '<p>';
        if (timeout) {
            setTimeout(() => output.innerText = '', 3000)
        }
    }

    fillGrid() {
        let tubes = this.getTubes();
        let tubeArray = [];
        Object.values(tubes).forEach((tube) => {
            let ballsArr = [] 
            Object.values(this.getBalls(tube)).forEach((ball) => {
                ballsArr.push(this.extractColourFromGradient(ball.getDiv().style.backgroundImage).toUpperCase());
            })
            tubeArray.push(ballsArr.reverse()); 
        }) 
        this.grid = {tubes: tubeArray};
    }

    outputJSON() {
        this.displayMessage(JSON.stringify(this.grid), false);
        this.output.innerHTML += '<p>';
    }
        

}

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
