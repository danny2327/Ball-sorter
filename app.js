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

    for(let i = 0; i < numberOfTubes; i++) {
        let tubeSpan =  document.createElement('span');
        tubeSpan.className = 'tube';
        let balls = ''
        for (x = 0; x < ballsPerTube; x++) {
            for (y=0;y < grid[i][x].length; y++) {
                // console.log(y); 
                // console.log(grid[i][x][y]);
                let ball = document.createElement('div');
                ball.className = "ball";
                ball.innerText = "X";
                ball.style.backgroundColor = grid[0][x][y];
                console.log(ball);
                tubeSpan.appendChild(ball);
            }
            // console.log('---');

            // balls += `<div class="ball">X</div>`;    
            // console.log(grid[i][x]);        
        }
        // tubeSpan.innerHTML = balls;
        display.appendChild(tubeSpan)
        // console.log(tube);
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