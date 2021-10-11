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

function  determineDisplaySize() {
    newTubeHeight = 30+(32*this.ballsPerTube);
    display.style.width = (60+(32*ballsPerTube)) + "px";
}

function prepareToDraw() {
    numberOfTubes = grid[0].length
    //disabled prev at start because it's 0
    
    display.before(stage);
    determineDisplaySize();
    drawTubes();
}

// function determineDisplaySize() {
//     newTubeHeight = 30+(32*ballsPerTube);
//     display.style.width = (60+(32*ballsPerTube)) + "px";
// }

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
            ball.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${grid[currentStage][i][x]} 80%)`;
            // ball.style.backgroundPosition = "55% 55%";
            ball.style.backgroundRepeat = "no-repeat";
            // let ballbg = document.createElement('img');
            // ballbg.src='../images/ballbg.png';
            // ballbg.className='ballbg';
            // background-image:  radial-gradient(at bottom left, white 10%, rgba(30, 75, 115, 1) 40%);
            // background-position: 55% 55%;
            // background-repeat: no-repeat;

            // ball.appendChild(ballbg);
            // ball.style.backgroundColor = grid[currentStage][i][x];
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
    const key = e.code
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
        case "Space": {
            playPause();
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

function playPause() {
    //if playing, pauses, if not, starts 
    if (isPlaying()) pause();
    else play();
}

function isPlaying() {
    if (document.querySelector('.playControls').style.visibility == 'hidden') {
        return false; 
    } else {
        return true;
    }
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
    // don't want to be able to stop it
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
// http.get('../Examples Solved/ball_sort_616_solved.json') //  14 colours x 5, puzzle 616 
// http.get('../Examples Solved/ballsortSolved.json') //   3 colours x 3
// http.get('../Examples Solved/ballSortSolved7x4.json') //   7 colours x 4
// http.get('../Examples Solved/ballSortSolved3x4.json') //   3 colours x 4
http.get('../Examples Solved/ballSortSolved12x5.json') //   3 colours x 4
.then(data => mainSolve(data))
.catch(err => console.log(err)); 

function mainSolve(data) {
    grid = Object.values(data);
    ballsPerTube = grid[0][0].length;//getTubeSize()
    prepareToDraw();
}

