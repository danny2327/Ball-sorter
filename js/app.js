


class App{
    constructor() {
        this.solver = new Solver();
        this.builder = new Builder();
    }
}


class Solver {
    constructor() {
        
    }
}

class Builder {
    constructor() {
        
    }
}

class SolverUI {
    constructor() {
        prev.disabled = "true";
        determineDisplaySize();
    }     

    determineDisplaySize() {
        // newTubeHeight = 30+(32*this.ballsPerTube);
        // display.style.width = (60+(32*ballsPerTube)) + "px";
    }
}

class BuilderUI {
    constructor() {
        
    }
}

class Ball {
    constructor(colour = null, position = null, tube = null) {
        this.colour = colour;
        this.position = position;
        this.tube = tube;
    }

    get colour() {}
    
    changeColour() { }

    clearColour() { }
}

class Tube {
    constructor() {
        this.balls = [];
    }
}

// class grid {
//     constructor(numberOfColours, numberOfBalls) {
//         this.numberOfColours = numberOfColours;
//         this.numberOfBalls = numberOfBalls;

//     }
// }



const http = new EasyHTTP;
const ballColours = {
    0: 'RED',
    1: 'BLUE',
    2: 'YELLOW',
    3: 'LIME',
    4: 'PURPLE',
    5: 'ORANGE',
    6: 'AQUA',
    7: 'TEAL',
    8: 'GREEN',
    9: 'WHITE',
    10: 'FUCHSIA',
    11: 'LIGHTPINK',
    12: 'BROWN',
    13: 'MIDNIGHTBLUE'
};

// BLUE
// RED
// YELLOW
// ORANGE
// PURPLE
// WHITE
// TEAL
// BROWN
// LIGHT PINK = LIGHTPINK
// DARK BLUE = NAVY
// DARK GREEN = GREEN
// LIGHT GREEN = LIME
// DARK PINK = FUCHSIA
// LIGHT BLUE = AQUA

// Make this project in this JS, and some framewords like angular, react, vue
let solverTab = document.getElementById('solver');
let builderTab = document.getElementById('builder');
let lnkSolver = document.getElementById('lnkSolver');
let lnkBuilder = document.getElementById('lnkBuilder');


// Hides Builder initially
// hideSolver();
hideBuilder();

lnkSolver.addEventListener('click', () => {
    hideBuilder();
    showSolver();
});

lnkBuilder.addEventListener('click', () => {
    hideSolver();
    showBuilder();
});

function showSolver() {
    solverTab.style.display = 'block';
}

function showBuilder() {
    builderTab.style.display = 'block';
}

function hideSolver() {
    solverTab.style.display = 'none';
}

function hideBuilder() {
    builderTab.style.display = 'none';
}

function createBall(colour = null) {
    //create ball (div), set class 
    let ball = document.createElement('div');
    ball.className = "ball";
    if (colour) ball.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${colour} 80%)`;
    ball.style.backgroundRepeat = "no-repeat";
    return ball;
}
