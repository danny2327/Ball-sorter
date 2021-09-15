const http = new EasyHTTP;
const display = document.getElementById('display');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let grid;

function prepareToDraw() {
    ballsPerTube = grid[0][0].length//getTubeSize()
    numberOfTubes = grid[0].length

    for (let currentStage = 0;currentStage < grid.length;currentStage++) {
        drawTubes(currentStage);
        display.appendChild(document.createElement("p"));
        delay(currentStage);
    }
}

function delay(currentStage){
    setTimeout(() => {
            display.innerText='..';
            console.log(currentStage);
            drawTubes(currentStage);
        }, 2500);
}

function drawTubes(currentStage){
    //displays the tubes
    for(let i = 0; i < numberOfTubes; i++) {
        let tubeDiv =  document.createElement('div');
        tubeDiv.className = 'tube';
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = grid[currentStage][i].length-1; x >= 0 ; x--) {
            // console.log(grid[currentStage][i][x]);
            //create ball (div), set class and color
            let ball = document.createElement('div');
            ball.className = "ball";
            ball.style.backgroundColor = grid[currentStage][i][x];
            // add the ball to the tube
            tubeDiv.appendChild(ball);
        }
        // console.log('----');            
        
        display.appendChild(tubeDiv)
    }
}
    
http.get('ballsortSolved.json')
.then(data => displayData(data))
.catch(err => console.log(err)) 

function displayData(data) {
    grid = Object.values(data);
    prepareToDraw()
}