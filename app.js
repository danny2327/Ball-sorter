const http = new EasyHTTP;
const display = document.getElementById('display');
let grid;

function drawTubes() {
    ballsPerTube = grid[0][0].length//getTubeSize()
    numberOfTubes = grid[0].length
    // console.log(`ballsPerTube: ${ballsPerTube}, numberOfTubes: ${numberOfTubes}`);
    //for each tube in the game (the length of any one of grid[x])
    // draw a tube
    // for each ball in this tube, draw that many balls. 
    // and in that tube draw the correct number of balls. 

    

    for (let currentStage = 0;currentStage < grid.length;currentStage++) {
        console.log(currentStage);
        //displays the tubes
        for(let i = 0; i < numberOfTubes; i++) {
            let tubeDiv =  document.createElement('div');
            tubeDiv.className = 'tube';
            // displays the balls
            //done in reverse so we're effectively drawing from the bottom up
            for (let x = grid[currentStage][i].length-1; x > -1 ; x--) {
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
        display.appendChild(document.createElement("p"));
        setTimeout(
            function() { 
                console.log(display);
                // alert("going away now");
                display.innerText='..';
            },
            2500);
    }
}
    
    http.get('ballsortSolved.json')
.then(data => displayData(data))
.catch(err => console.log(err)) 

function displayData(data) {
    grid = Object.values(data);
    // console.log(grid);
    drawTubes()
}