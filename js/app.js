
class App{
    constructor() {
        this.ballColours = {
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
                
        this.solverTab = document.getElementById('solver');
        this.builderTab = document.getElementById('builder');
        this.lnkSolver = document.getElementById('lnkSolver');
        this.lnkBuilder = document.getElementById('lnkBuilder');
        
        this.lnkSolver.addEventListener('click', () => {
            this.hideBuilder();
            this.showSolver();
        });
        
        this.lnkBuilder.addEventListener('click', () => {
            //Feel like this shouldn't be here, but I would have to create an 'exiting' func and call that.  Probably should for both tools. 
            this.solver.ifPlayingPause();
            this.hideSolver();
            this.showBuilder();            
        });
        
        this.solver = new Solver(this.ballColours);
        this.builder = new Builder(this.ballColours);

        // Hides Builder initially
        // this.hideSolver();
        this.hideBuilder();
    }
    showSolver() {
        this.solverTab.style.display = 'block';
    }

    showBuilder() {
        this.builderTab.style.display = 'block';
    }

    hideSolver() {
        this.solverTab.style.display = 'none';
        this.showBuilder();
    }

    hideBuilder() {
        this.builderTab.style.display = 'none';
        this.showSolver();
    }
}

app = new App();

