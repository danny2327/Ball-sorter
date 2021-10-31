// Still to do:
// Classes
// Make it not shitty
class Builder {
    constructor(ballColours, app) {
        this.app = app;
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

    //Will be called from App
    getPuzzle() {
        if(this.isGridFull()) {
            this.fillGrid();
            return JSON.stringify(this.grid)
        } else {
            //need to display
            this.displayMessage('Grid is not complete');
            return null;
        }
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

        document.getElementById('randomize').addEventListener('click', () => {
            this.resetBuilder()
            this.randomize();
        });

        //Resets balls but leaves the grid size alone - in fact if the input numbers have changed, but update grid has not been clicked, it will update them as well. 
        document.getElementById('resetBuilder').addEventListener('click', () => {
            this.resetBuilder();
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
                for(let i = 0; i < Object.keys(tubes).length-2; i++) {
                    let balls = this.getBalls(tubes[i]);
                    for (let x = this.ballsPerTube-1; x >= 0 ; x--) { 
                        let ball = balls[x];
                        // console.log('ball', x, ball);
                        if (ball.getDiv() == clickedBall) {
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

    resetBuilder() {
        this.prepareToDraw();
        this.resetCurrentBallPosition();
        this.setBall();
        this.selectBall();
        this.zeroNumColourList();
        this.output.innerText = '';
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
            // If the ball BG image doesn't start with URL             and            ball bg image isn't nothing
            // if(this.currentBall.getDiv().style.backgroundImage.id !== 'clearBall' && this.currentBall.style.backgroundImage !== '') {
            if(this.currentBall.getDiv().style.backgroundImage.substr(0,2) !== 'url' && this.currentBall.getDiv().style.backgroundImage !== '') {
                this.decrementNumColourList(this.extractColourFromGradient(this.currentBall.getDiv().style.backgroundImage));
            }
            this.currentBall.clearColour();
            
        } else {   //Else set the new colour provided
            // If the ball selected has a colour already,it was manually selected and therefore the colour being replaced should be decremented in the colour list
            if (this.currentBall.getDiv().style.backgroundImage !== '') {
                this.decrementNumColourList(this.extractColourFromGradient(this.currentBall.getDiv().style.backgroundImage));
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

    randomize() { 
        for (let i = 0; i < this.numberOfTubes-2; i++) {
            let balls = this.getBalls(this.tubes[i]);
            for (let x = this.ballsPerTube-1; x >= 0 ; x--) { 
                while (!this.currentBall.hasColour()){
                    let colour = this.ballColours[Math.floor(Math.random() * (this.numberOfTubes-2))];
                    if (parseInt(this.numEachColour[colour]) < parseInt(this.ballsPerTube)) { 
                        this.updateBall(colour);
                    }            
                }
                this.nextBall();
            };
        };
    }

}
