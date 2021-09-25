let inputBalls = document.getElementById('numBalls');
let inputColours = document.getElementById('numColours');
const builderDisplay = document.getElementById('builderDisplay');

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
    builderDisplay.innerHTML='';
    getInputs();
    builderGrid = createGrid();
    drawTubes();
}


function drawTubes(){
    //displays the tubes
    for(let i = 0; i < builderNumberOfTubes; i++) {
        let tubeDiv =  document.createElement('div');
        tubeDiv.className = 'tube';
        newTubeDivLocation = 30 + (60*i);
        newTubeHeight = 30+(32*builderBallsPerTube);
        tubeDiv.style.height = newTubeHeight + "px";
        tubeDiv.style.left = newTubeDivLocation + "px";
        tubeDiv.style.top = 100 + "px";
        builderDisplay.appendChild(tubeDiv);        
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = builderBallsPerTube-1; x >= 0 ; x--) {
            
            if(i < builderNumberOfTubes-2) {
                //create ball (div), set class and color
                let ball = document.createElement('div');
                ball.className = "ball";
                let ballbg = document.createElement('img');
                ballbg.src='../images/ballbg.png';
                ballbg.className='ballbg';
                
                ball.appendChild(ballbg);
                // ball.style.backgroundColor = grid[currentStage][i][x];
                // add the ball to the tube
                //stack balls from the bottom
                tubeDiv.appendChild(ball);
                
                ballBottom = 0 + (x * 32)
                ball.style.bottom = ballBottom + "px";
            }
        }        
    }
    builderDisplay.appendChild(document.createElement("p"));
}


function displayTubes() {
    prepareToDraw();
}

displayTubes();