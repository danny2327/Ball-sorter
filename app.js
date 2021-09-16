const http = new EasyHTTP;
const display = document.getElementById('display');
const prev = document.getElementById('prev');
const stage = document.createElement('span');

const next = document.getElementById('next');
var currentStage = 0;

let grid;

function prepareToDraw() {
    ballsPerTube = grid[0][0].length//getTubeSize()
    numberOfTubes = grid[0].length
    //disabled prev at start because it's 0
    prev.disabled = "true";
    display.before(stage);
    // for (currentStage;currentStage < grid.length;currentStage++) {
    drawTubes();

        // delay(currentStage);
}

// function delay(currentStage){
//     setTimeout(() => {
//             display.innerText='..';
//             console.log(currentStage);
//             drawTubes(currentStage);
//         }, 2500);
// }

function drawTubes(){
    //displays the tubes
    stage.innerText = `Stage ${currentStage+1} of ${grid.length}`;
    for(let i = 0; i < numberOfTubes; i++) {
        let tubeDiv =  document.createElement('div');
        tubeDiv.className = 'tube';
        newTubeDivLocation = 30 + (60*i);
        tubeDiv.style.left = newTubeDivLocation + "px";
        tubeDiv.style.top = 100 + "px";
        display.appendChild(tubeDiv);        
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = grid[currentStage][i].length-1; x >= 0 ; x--) {
            //create ball (div), set class and color
            let ball = document.createElement('div');
            ball.className = "ball";
            ball.style.backgroundColor = grid[currentStage][i][x];
            // add the ball to the tube
            //stack balls from the bottom
            tubeDiv.appendChild(ball);

            ballBottom = 0 + (x * 32)
            ball.style.bottom = ballBottom + "px";
        }        
    }
    display.appendChild(document.createElement("p"));
}

document.querySelectorAll(".actionButton").forEach(button => 
    button.addEventListener('click', (e) => {
        console.log(currentStage);
        switch(e.target.id) {
            case 'beginning':
                currentStage = 0;
                prev.disabled = true;
                next.disabled = false;
                display.innerHTML = '';
                drawTubes();
                break;
            case 'prev':
                if(currentStage > 0) currentStage--;
                if(currentStage == 0) prev.disabled = true;
                next.disabled = false;
                display.innerHTML = '';
                drawTubes();
                break;
            case 'next':
                if(currentStage < grid.length-1) currentStage++;
                if(currentStage == grid.length-1) next.disabled = true;
                prev.disabled = false;
                display.innerHTML = '';
                drawTubes();
                break;
            case 'last':
                currentStage = grid.length-1
                next.disabled = true;
                prev.disabled = false;
                display.innerHTML = '';
                drawTubes();
                break;
        }
}));
    
http.get('ballsortSolved.json')
.then(data => displayData(data))
.catch(err => console.log(err)); 

function displayData(data) {
    grid = Object.values(data);
    prepareToDraw();
}

