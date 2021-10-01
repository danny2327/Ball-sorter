let inputBalls = document.getElementById('numBalls');
let inputColours = document.getElementById('numColours');

//Where the tubes and balls are shown
const builderTubeDisplay = document.getElementById('builderTubeDisplay');

//The parent of the ball selector. Used for showing messages. 
const builderSelectorDisplay = document.getElementById('builderSelectorDisplay');

//Where the ball selector is shown. 
const ballSelector = document.getElementById('ballSelect');

const output = document.getElementById('output');

// tube and ball position of current ball
let currentBallPosition = [0,0];
//the current ball (div)
let currentBall;

//Keeps track of how many of each colour are assigned. 
const numEachColour = {};

//How many balls per tube
let builderBallsPerTube;
//How many tubes (number of colours will be 2 less)
let builderNumberOfTubes;
let builderGrid = {};

//Full is whether or not the entire grid is full.  Checked when gen JSON is clicked 
let full = false;

function resetCurrentBallPosition() {
    currentBallPosition = [0,0];
}

document.getElementById('updateGrid').addEventListener('click', (e) => {
    if (confirm('Are you sure you want to change the size and reset?')) {
        //redraw
        builderPrepareToDraw();
        resetCurrentBallPosition();
        setBall();
        selectBall();
        zeroNumColourList();
      } else {
        // Do nothing!
        console.log('No Change');
        //undoes the change
        inputColours.value = builderNumberOfTubes-2;
        inputBalls.value = builderBallsPerTube;
      }
});


//Ball in selector click listener
ballSelector.addEventListener('click', (e) => {
    if (!full) {
        console.log(e.composedPath()[0])
        let ball = e.composedPath()[0]
        if(ball.className == 'ball') {
            let bg = extractColourFromGradient(ball.style.backgroundImage);
            //If max number of chosen colour is not reached
            if(!isColourFull(bg)) {
                updateBall(bg);
                nextBall();
            } else {
                //max number of this colour already exists.
                displayMessage(`Max number of ${bg} balls (${builderBallsPerTube}) already exist`);
            }
        }
    } else {
        console.log('I do believe you\'re done');
    }
});

//Ball in tube click listener
builderTubeDisplay.addEventListener('click', (e) => {
    // There must be a better way to do this than have to loop through every 'ball' div comparing them.  
    if (e.composedPath()[0].className == 'ball') {
        let clickedBall = e.composedPath()[0];
        //look through each ball in each tube until I find the one that is the same as the one that was clicked.  I do this because the ball doesn't know where it is in which tube. 
        tubes = getTubes();
        for(let i = 0; i < tubes.length; i++) {
            balls = getBalls(tubes[i]);
            for (let x = builderBallsPerTube-1; x >= 0 ; x--) { 
                ball = balls[x];                
                if (ball == clickedBall) {
                    resetBorder();
                    currentBallPosition = [i,x];
                    setBall();
                    selectBall();
                }
            }
        }
    }
});

function isColourFull(colour) {
    if (numEachColour[colour.toUpperCase()] == builderBallsPerTube) {
        return true;
    }
    return false;
}

function getInputs() {
    builderNumberOfTubes = (parseInt(inputColours.value) + 2);
    builderBallsPerTube = inputBalls.value;
}

function builderPrepareToDraw() {    
    builderTubeDisplay.innerHTML='';
    getInputs();
    drawBuilderTubes();
    drawBallSelector();
}

function createTube(i) {
    tubeDiv = document.createElement('div');
    tubeDiv.className = 'tube';
    newTubeDivLocation = 30 + (60*i);
    newTubeHeight = 30+(32*builderBallsPerTube);
    tubeDiv.style.height = newTubeHeight + "px";
    tubeDiv.style.left = newTubeDivLocation + "px";
    tubeDiv.style.top = 100 + "px";
    return tubeDiv;
}


function drawBuilderTubes(){
    //displays the tubes
    for(let i = 0; i < builderNumberOfTubes; i++) {
        createTube();
        let tubeDiv = createTube(i);
        builderTubeDisplay.appendChild(tubeDiv);        
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = builderBallsPerTube-1; x >= 0 ; x--) {            
            if(i < builderNumberOfTubes-2) {
                let ball = createBall();
                // add the ball to the tube
                tubeDiv.appendChild(ball);
                // ball.style.backgroundColor = grid[currentStage][i][x];
                ballBottom = 0 + (x * 34)
                ball.style.bottom = ballBottom + "px";
            }
        }        
    }
    builderTubeDisplay.appendChild(document.createElement("p"));
}

function drawBallSelector() {
    ballSelector.innerHTML = '';
    ballSelector.style.width = parseInt(inputColours.value)*65;
    ballSelector.style.height = 35;
    ballSelector.style.top = 80+(32*builderBallsPerTube)+"px";
    for (let i = 0; i < parseInt(inputColours.value); i++) {
        let ball = createBall(ballColours[i])
        // ball.style.backgroundColor = ballColours[i];
        // ball.style.display = 'inline';
        ballSelector.appendChild(ball);
        ballLeft = 0 + (i * 32)
        ball.style.left = ballLeft + "px";
    }
}

function startBuild() {
    // This is where I'll do the loop of highlighting the next ball, up one row to the next etc.
    // allow clicking on any ball to set/redo. 
    setBall();
    selectBall();
    zeroNumColourList();
}

function zeroNumColourList() {
    // This list keeps track of how many of each ball has been added so only the correct number can be added. 
    for(let i=builderNumberOfTubes-3; i >= 0; i-- ) {
        numEachColour[ballColours[i]] = 0;
    }
}

function incrementNumColourList(colour) {
    numEachColour[colour.toUpperCase()]++;
    ballSelectVisibility();
}

function decrementNumColourList(colour) {
    numEachColour[colour.toUpperCase()]--;
    ballSelectVisibility();    
}

function ballSelectVisibility() {
    //each time a ball is changed, run this to see if any colours are fully selected, or no longer fully selected. 
    ballSelector.querySelectorAll('.ball').forEach((ball) => {
        if (numEachColour[extractColourFromGradient(ball.style.backgroundImage).toUpperCase()] == builderBallsPerTube) {
            ball.style.opacity = "0.5";
        } else {
            ball.style.opacity = "1";
        }
    })
}

//Resets from red to regular border
function resetBorder() {
    currentBall.style.border = '1px solid grey';
}

//Only highlights the current ball with red border. 
function selectBall() {
    currentBall.style.border = '2px solid red'
}

//sets the current ball as the currently selected ball
function setBall() {
    balls = getBalls();
    currentBall = balls[currentBallPosition[1]]
}

// returns all balls
function getBalls(tube = null) {
    //func can now take an optional tube
    if(!tube) {
        tubes = getTubes();
        // console.log('tubes', tubes);
        // console.log('currentBallPosition', currentBallPosition);
        tube = tubes[currentBallPosition[0]]
        // console.log('tube', tube);
    }
    return tube.querySelectorAll('.ball');
}

//returns all tubes
function getTubes() {
    return builderTubeDisplay.querySelectorAll('.tube');
}

//Sets the current ball to a new colour and calls the update colour list
function updateBall(newColour) {
    // If the ball selected has a colour already,it was manually selected and therefore the colour being replaced should be decremented in the colour list
    if (currentBall.style.backgroundImage !== '') {
        decrementNumColourList(extractColourFromGradient(currentBall.style.backgroundImage));
    }
    // currentBall.style.backgroundColor = newColour;
    currentBall.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${newColour} 80%)`;
    currentBall.style.backgroundRepeat = "no-repeat";
    incrementNumColourList(newColour);
}

function extractColourFromGradient(gradient) {
    //Have to use this method because in some cases I rely on the bg color, and need to be able to know it.
    let temp = gradient.split(',')[2];
    return(temp.slice(1,-5));
}

// Move on to the next ball in the tube, or the first ball of the next tube if it's full
function nextBall() {
    let tube = currentBallPosition[0];
    let ball = currentBallPosition[1];
    // if not done in tube, next ball
    if (ball < builderBallsPerTube-1) {
        currentBallPosition[1]++
        resetBorder();
        setBall();
        selectBall();  
    // if one tube is done, next tube, back to place 0         
    } else if (tube < builderNumberOfTubes-3) {
        currentBallPosition[1] = 0;
        currentBallPosition[0]++;
        resetBorder();
        setBall();
        selectBall();  
    } else {
        //else all have been filled
        full = true;
        resetBorder();
        currentBall = null;
    }  
}

document.getElementById('genJSON').addEventListener('click', (e) => {
    if(full) {
        fillGrid();
        outputJSON();
    } else {
        //need to display
        displayMessage('Grid is not complete');
    }
})

//Displays a message in the output field.  Timeoout boolean is optional.  If true, it's not the JSON, and will disappear.
function displayMessage(message, timeout = true) {
    output.innerText = message;
    output.innerHTML += '<p>';
    if (timeout) {
        setTimeout(() => output.innerText = '', 3000)
    }
}

// Clicking on the output copies the text (meant for the JSON but will work on any message) and displays a msg for 3 seconds.
// nav clipboard api is async func  
output.addEventListener('click', async () => {
      await navigator.clipboard.writeText(output.textContent);
      jsonMsg = document.createTextNode('JSON Copied!');
      output.appendChild(jsonMsg);
      setTimeout(() => {
        output.removeChild(jsonMsg);
      }, 3000)
});

// Fills up the grid with the current bg colour of each ball, to be used for output to JSON. 
function fillGrid() {
    tubes = getTubes();
    tubeArray = [];
    tubes.forEach((tube) => {
        let ballsArr = [] 
        tube.querySelectorAll('.ball').forEach((ball) => {
            ballsArr.push(ball.style.backgroundColor.toUpperCase());
        })
        tubeArray.push(ballsArr.reverse()); 
    }) 
    builderGrid = {tubes: tubeArray};        
    console.log(builderGrid);
}

//Outputs the JSON
function outputJSON() {
    displayMessage(JSON.stringify(builderGrid), false);
    output.appendChild(document.createTextNode('Click to Copy'));
    output.innerHTML += '<p>';
}

function mainBuild() {
    builderPrepareToDraw();
    startBuild();
}

mainBuild();