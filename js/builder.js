let inputBalls = document.getElementById('numBalls');
let inputColours = document.getElementById('numColours');
const builderTubeDisplay = document.getElementById('builderTubeDisplay');
const builderSelectorDisplay = document.getElementById('builderSelectorDisplay');
let ballSelector = document.getElementById('ballSelect');
let currentBallPosition = [0,0];
let currentBall;

let builderBallsPerTube;
let builderNumberOfTubes;
let builderGrid;
let full = false;

// function createGrid() {
//     let newGrid = {}
//     for (let i=0; i < (builderNumberOfTubes); i++) {
//         newGrid[i] = {};
//         for (let b=0; b < builderBallsPerTube; b++) {
//             if (i < (builderNumberOfTubes-2)) {    
//                 newGrid[i][b] = '';
//             }
//         }
//     }
//     console.log(newGrid);
//     return newGrid;
// }

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

ballSelector.addEventListener('click', (e) => {
    if (!full) {
        if(e.path[1].className == 'ball') {
            console.log('before update')
            updateBall(e.path[1].style.backgroundColor)
            console.log('after update')
            nextBall();
            console.log('after next')
        }
    } else {
        console.log('I do believe you\'re done')
    }
});

function getInputs() {
    builderNumberOfTubes = (parseInt(inputColours.value) + 2);
    builderBallsPerTube = inputBalls.value;
}

function prepareToDraw() {
    builderTubeDisplay.innerHTML='';
    getInputs();
    // builderGrid = createGrid();
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
    setBall();
    selectBall();
    // nextBall();
    // for(let i = 0; i < builderNumberOfTubes; i++) {
        // for (let x = 0; x < builderBallsPerTube; x++) {
            //ignore the last 2 empty tubes
    // if(currentBall[0] < builderNumberOfTubes-2) {
    // }
}

function resetBorder() {
    currentBall.style.border = 'border: 1px solid grey';
}

function setBall() {
    balls = getBalls();
    currentBall = balls[currentBallPosition[1]]
}

function getBalls() {
    tubes = getTubes();
    tube = tubes[currentBallPosition[0]]
    return tube.querySelectorAll('.ball');
}

function getTubes() {
    return  document.querySelectorAll('.tube');
}

function selectBall() {
    currentBall.style.border = '2px solid red'
}

function updateBall(newColour) {
    currentBall.style.backgroundColor = newColour;
}

function nextBall() {
    let tube = currentBallPosition[0];
    let ball = currentBallPosition[1];
    // if not done in tube, next ball
    if (ball < builderBallsPerTube-1) {
        currentBallPosition[1]++
    // if last tube is done, next tube, back to place 0         
    } else if (tube < builderNumberOfTubes-3) {
        currentBallPosition[1] = 0;
        currentBallPosition[0]++;
    } else {
        console.log(currentBallPosition);
        console.log(full);
        //else all have been filled
        full = true;
    }
    setBall();
    selectBall();
}

function main() {
    prepareToDraw();
    startBuild();
}

main();