let inputBalls = document.getElementById('numBalls');
let inputColours = document.getElementById('numColours');
const builderTubeDisplay = document.getElementById('builderTubeDisplay');
const builderSelectorDisplay = document.getElementById('builderSelectorDisplay');

let builderBallsPerTube;
let builderNumberOfTubes;
let builderGrid;

function createGrid() {
    let newGrid = {}
    for (let i=0; i < (builderNumberOfTubes); i++) {
        newGrid[i] = {};
        for (let b=0; b < builderBallsPerTube; b++) {
            if (i < (builderNumberOfTubes-2)) {    
                newGrid[i][b] = '';
            }
        }
    }
    console.log(newGrid);
    return newGrid;
}

document.getElementById('updateGrid').addEventListener('click', (e) => {
    if (confirm('Are you sure you want to change the size and reset?')) {
        //redraw
        prepareToDraw();
      } else {
        // Do nothing!
        console.log('No Change');
        //undoes the change
        inputColours.value = builderNumberOfTubes-2;
        inputBalls.value = builderBallsPerTube;
      }
});

function getInputs() {
    builderNumberOfTubes = (parseInt(inputColours.value) + 2);
    builderBallsPerTube = inputBalls.value;
}

function prepareToDraw() {
    builderTubeDisplay.innerHTML='';
    getInputs();
    builderGrid = createGrid();
    drawTubes();
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

function createBall() {
    //create ball (div), set class and color
    let ball = document.createElement('div');
    ball.className = "ball";
    let ballbg = document.createElement('img');
    ballbg.src='../images/ballbg.png';
    ballbg.className='ballbg';    
    ball.appendChild(ballbg);
    return ball;
}

function drawTubes(){
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
                ballBottom = 0 + (x * 32)
                ball.style.bottom = ballBottom + "px";
            }
        }        
    }
    builderTubeDisplay.appendChild(document.createElement("p"));
}

function drawBallSelector() {
    let ballSelector = document.getElementById('ballSelect');
    ballSelector.innerHTML = '';
    ballSelector.style.width = parseInt(inputColours.value)*65;
    ballSelector.style.height = 35;
    console.log(50+(32*builderBallsPerTube));
    ballSelector.style.top = 80+(32*builderBallsPerTube)+"px";
    for (let i = 0; i < parseInt(inputColours.value); i++) {
        let ball = createBall()
        ball.style.backgroundColor = ballColours[i];
        // ball.style.display = 'inline';
        ballSelector.appendChild(ball);
        ballLeft = 0 + (i * 32)
        ball.style.left = ballLeft + "px";
    }
}

function startBuild() {
    // This is where I'll do the loop of highlighting the next ball, up one row to the next etc.
    // allow clicking on any ball to set/redo. 

}


function displayTubes() {
    prepareToDraw();
    startBuild();
}

displayTubes();