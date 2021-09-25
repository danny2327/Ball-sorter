const http = new EasyHTTP;

// Make this project in this JS, and some framewords like angular, react, vue
let solver = document.getElementById('solver');
let builder = document.getElementById('builder');
let lnkSolver = document.getElementById('lnkSolver');
let lnkBuilder = document.getElementById('lnkBuilder');
let solverData = solver.innerHTML;
let builderData = builder.innerHTML;

// Hides Builder initially
hideSolver();
// hideBuilder();

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
    // solver.innerText = '';
}

function hideBuilder() {
    builder.style.display = 'none';
}

