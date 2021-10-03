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
let solver = document.getElementById('solver');
let builder = document.getElementById('builder');
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
    solver.style.display = 'block';
}

function showBuilder() {
    builder.style.display = 'block';
}

function hideSolver() {
    solver.style.display = 'none';
}

function hideBuilder() {
    builder.style.display = 'none';
}


function createBall(colour = null) {
    //create ball (div), set class 
    let ball = document.createElement('div');
    ball.className = "ball";
    if (colour) ball.style.backgroundImage = `radial-gradient(at bottom right, white 10%, ${colour} 80%)`;
    ball.style.backgroundRepeat = "no-repeat";
    return ball;
}
