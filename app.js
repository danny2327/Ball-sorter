const http = new EasyHTTP;
const display = document.getElementById('display');
let grid;

function drawTubes() {
    ballsPerTube = grid[0][0].length//getTubeSize()
    numberOfTubes = grid[0].length
    // console.log(`ballsPerTube: ${ballsPerTube}, numberOfTubes: ${numberOfTubes}`);
    let i=0;
    let x=0;
    for(tube in grid){
        console.log(grid[tube]);
        let tubeSpan =  document.createElement('span');
        tubeSpan.className = 'tube';
        let balls = ''
        for (balls in grid[tube]) {
            balls += `<div class="ball">X</div>`;            
        }
        tube.innerHTML = balls;
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