const http = new EasyHTTP;
const display = document.getElementById('display');
let grid;

function drawTubes() {
    ballsPerTube = grid[0][0].length//getTubeSize()
    numberOfTubes = grid[0].length
    // console.log(`ballsPerTube: ${ballsPerTube}, numberOfTubes: ${numberOfTubes}`);
    let i=0;
    let x=0;
    //for each tube in the game (the length of any one of grid[x])
    // draw a tube
    // for each ball in this tube, draw that many balls. 
    // and in that tube draw the correct number of balls. 

    console.log(grid[0]);
    //displays the tubes
    for(let i = 0; i < numberOfTubes; i++) {
        let tubeSpan =  document.createElement('span');
        tubeSpan.className = 'tube';
        // console.log(grid[0][i].length);
        console.log(grid[0][i].length);
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = grid[0][i].length-1; x > -1 ; x--) {
            console.log(grid[0][i][x]);
            //create ball (div), set class and color
            let ball = document.createElement('div');
            ball.className = "ball";
            ball.style.backgroundColor = grid[0][i][x];
            // add the ball to the tube
            tubeSpan.appendChild(ball);
        }
        console.log('----');            
        
        display.appendChild(tubeSpan)
    }




    // for(let i = 0; i < numberOfTubes; i++) {
    //     let tubeSpan =  document.createElement('span');
    //     tubeSpan.className = 'tube';
    //     for (x = 0; x < ballsPerTube; x++) {
    //         for (y=0;y < grid[0][i][x].length; y++) {
    //             // console.log(y); 
    //             console.log(grid[0][i][x]);
    //             let ball = document.createElement('div');
    //             ball.className = "ball";
    //             ball.style.backgroundColor = grid[0][i][x];
    //             // console.log(tubeSpan);
    //             tubeSpan.appendChild(ball);
    //         }
            // console.log('---');

            // balls += `<div class="ball">X</div>`;    
            // console.log(grid[i][x]);        
        // }
        
        // tubeSpan.innerHTML = balls;
        // display.appendChild(tubeSpan)
        // console.log(tube);
//     }
}

http.get('ballsortSolved.json')
.then(data => displayData(data))
.catch(err => console.log(err)) 

function displayData(data) {
    grid = Object.values(data);
    // console.log(grid);
    drawTubes()
}