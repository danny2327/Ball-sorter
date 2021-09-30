
const display = document.getElementById('display');
const prev = document.getElementById('prev');
const stage = document.createElement('span');


const next = document.getElementById('next');
let currentStage = 0;
let grid;
let ballsPerTube;
let playing = false;
let timeoutHandle;
//default play speed in ms
let playSpeed = 1000;

function prepareToDraw() {
    numberOfTubes = grid[0].length
    //disabled prev at start because it's 0
    prev.disabled = "true";
    display.before(stage);
    // for (currentStage;currentStage < grid.length;currentStage++) {
    drawTubes();
}


//Want to fix: extract tubes from every loop
function drawTubes(){
    //displays the tubes
    stage.innerText = `Stage ${currentStage+1} of ${grid.length}`;
    for(let i = 0; i < numberOfTubes; i++) {
        let tubeDiv =  document.createElement('div');
        tubeDiv.className = 'tube';
        newTubeDivLocation = 30 + (60*i);
        newTubeHeight = 30+(32*ballsPerTube);
        tubeDiv.style.height = newTubeHeight + "px";
        tubeDiv.style.left = newTubeDivLocation + "px"; 
        tubeDiv.style.top = 100 + "px";
        //want to add - make the from and destination tubes change colour
        display.appendChild(tubeDiv);        
        // displays the balls
        //done in reverse so we're effectively drawing from the bottom up
        for (let x = grid[currentStage][i].length-1; x >= 0 ; x--) {
            //create ball (div), set class and color
            let ball = document.createElement('div');
            ball.className = "ball";
            let ballbg = document.createElement('img');
            ballbg.src='../images/ballbg.png';
            ballbg.className='ballbg';

            ball.appendChild(ballbg);
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
        switch(e.target.id) {
            case 'beginning':
                firstStage();
                break;
            case 'prev':
                prevStage();
                break;
            case 'next':
                nextStage();
                break;
            case 'last':
                lastStage();
                break;
            case 'play':
                play();
                break;
            case 'playFromStart':
                playFromStart();
                break;
            case 'pause':
                pause();
                break;
            case 'slower':
                slower();
                break;
            case 'faster':
                faster();
                break;
            case 'reset':
                reset();
                break;
        }
}));

document.addEventListener('keydown', (e) => {
    const key = e.key
    switch(key) {
        case "ArrowLeft": {
            prevStage();
            break;
        }
        case "ArrowRight": {
            nextStage();
            break;
        }
        case "ArrowUp": {
            firstStage();
            break;
        }
        case "ArrowDown": {
            lastStage();
            break;
        }
    }
});
    
function prevStage() {
    if(currentStage > 0) currentStage--;
    if(currentStage == 0) prev.disabled = true;
    next.disabled = false;
    display.innerHTML = '';
    drawTubes();
}
function nextStage() {
    if(currentStage < grid.length-1) currentStage++;
    if(currentStage == grid.length-1) next.disabled = true;
    prev.disabled = false;
    display.innerHTML = '';
    drawTubes();
}

function firstStage() {
    currentStage = 0;
    prev.disabled = true;
    next.disabled = false;
    display.innerHTML = '';
    drawTubes();
}

function lastStage() {
    currentStage = grid.length-1
    next.disabled = true;
    prev.disabled = false;
    display.innerHTML = '';
    drawTubes();
}

async function play() {
    resetTimeout();
    const wait = (timeToDelay) => new Promise((resolve) => timeoutHandle = setTimeout(resolve, timeToDelay));

    ShowPlayControls();
    while (currentStage < grid.length-1) {
        await wait(playSpeed);
        nextStage();
    }
    hidePlayControls();
}

function playFromStart() {
    resetTimeout();
    currentStage = -1;
    play();
}

function pause() {
    resetTimeout();
    hidePlayControls();
}

function resetTimeout() {
    clearTimeout(timeoutHandle);
}

function faster() {
    if (playSpeed > 200) playSpeed-=200;
    console.log(playSpeed);
}

function slower() {
    playSpeed+=200;
    console.log(playSpeed);
}

function reset() {
    playSpeed = 1000;
    console.log(playSpeed);
}

function ShowPlayControls() {
    document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'visible');  
}

function hidePlayControls() {
    document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'hidden');
}


// Next step is to be able to pass a created build to this page and show it.  
http.get('../ballsortSolved new 616.json') //  2 colours
// http.get('../ballsortSolved2.json') // small 3 colours
// http.get('ballsortSolved.json') // huge 14 colours, puzzle 616 - Not working well, not my fault the original script
.then(data => displayData(data))
.catch(err => console.log(err)); 

function displayData(data) {
    grid = Object.values(data);
    ballsPerTube = grid[0][0].length//getTubeSize()
    prepareToDraw();
}

