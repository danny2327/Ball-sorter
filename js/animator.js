class Animator {
    constructor(ballColours) {
        
        this.display = document.getElementById('display');

        this.sideLoadedPuzzle// = JSON.parse('{"0":[["RED","BLUE"],["BLUE","RED"],[],[]],"1":[["RED"],["BLUE","RED"],["BLUE"],[]],"2":[["RED","RED"],["BLUE"],["BLUE"],[]],"3":[["RED","RED"],[],["BLUE","BLUE"],[]]}');
        ;
        
        this.prev = document.getElementById('prev');
        this.next = document.getElementById('next');

        this.stage = document.createElement('span');

        this.puzzleDD = document.getElementById('puzzle');

        this.addEventListeners();

        this.prev.disabled = "true";
        
        
        // **Variables**
        this.tubes = {}
        this.numberOfTubes;
        this.ballsPerTube;
        this.http = new EasyHTTP;
        this.grid;
        this.ballColours = ballColours;
        this.currentStage = 0;
        this.playing = false;
        //this.player = new Player();
        this.timeoutHandle;
        //default play speed in ms
        this.playSpeed = 1000;
        this.loadedPuzzle = '';
        
        this.populatePuzzleSelect();

    } //End of Constructor

    showCustomPuzzle(solvedPuzzle) {
        this.sideLoadedPuzzle = JSON.parse(solvedPuzzle);
        this.setLoadedPuzzle('Custom');
    }

    populatePuzzleSelect() {
        // load list of presolved puzzles
        let solvedPuzzles = [
            'Solved_2x2',
            'Solved_3x3',
            'Solved_3x4',
            'Solved_7x4',
            'Solved_12x5',
            'Solved_14x5'
        ];

        //set current puzzle to load
        
        for (let puzzle in solvedPuzzles) {
            let option = document.createElement('option');
            option.value = solvedPuzzles[puzzle];
            option.text = solvedPuzzles[puzzle]//.slice(0, -5);
            this.puzzleDD.appendChild(option);
        }
        
        let option = document.createElement('option');
        option.value = 'Custom';
        option.text = 'Custom';
        this.puzzleDD.appendChild(option);

        this.puzzleToDisplay();
        // this.puzzleToDisplay('Custom');
    }

    puzzleToDisplay(puzzle = "Solved_14x5") {
        this.setLoadedPuzzle(puzzle);
        this.puzzleDD.value = puzzle;
    }

    getLoadedPuzzle() {
        return this.loadedPuzzle;
    }

    setLoadedPuzzle(newPuzzle) {
        if (newPuzzle !== this.getLoadedPuzzle()) {
            if(newPuzzle === 'Custom') {
                // this.loadedPuzzle = this.sideLoadedPuzzle
                this.resetPage();
                this.solve(this.sideLoadedPuzzle)
            } else {
                this.loadedPuzzle = newPuzzle;
                this.loadPuzzleFromDisk(newPuzzle);
            }
        }
    }

    addEventListeners() {

        document.getElementById('puzzle').addEventListener('change', () => {
            if(document.getElementById('puzzle').value == 'Custom') {
                alert("Use the builder to create a puzzle to display");
                this.puzzleDD.value = this.loadedPuzzle;
            } else {
                this.setLoadedPuzzle(document.getElementById('puzzle').value);
            }
        })

        document.querySelectorAll(".actionButton").forEach(button => 
            button.addEventListener('click', (e) => {
                switch(e.target.id) {
                    case 'beginning':
                        this.firstStage();
                        break;
                    case 'prev':
                        this.prevStage();
                        break;
                    case 'next':
                        this.nextStage();
                        break;
                    case 'last':
                        this.lastStage();
                        break;
                    case 'play':
                        this.play();
                        break;
                    case 'playFromStart':
                        this.playFromStart();
                        break;
                    case 'pause':
                        this.pause();
                        break;
                    case 'slower':
                        this.slower();
                        break;
                    case 'faster':
                        this.faster();
                        break;
                    case 'reset':
                        this.reset();
                        break;
                }
        }));
        
        document.addEventListener('keydown', (e) => {
            const key = e.code
            switch(key) {
                case "ArrowLeft": {
                    this.prevStage();
                    break;
                }
                case "ArrowRight": {
                    this.nextStage();
                    break;
                }
                case "ArrowUp": {
                    this.firstStage();
                    break;
                }
                case "ArrowDown": {
                    this.lastStage();
                    break;
                }
                case "Space": {
                    this.playPause();
                    break;
                }
            }
        });
    }

    loadPuzzleFromDisk(loadPuzzle) {
        this.resetPage();
        this.http.get(`../Examples/${loadPuzzle}.json`) 
        .then(data => this.solve(data))
        .catch(err => console.log(err)); 
    }

    resetPage() {
        this.tubes = {};
        this.display.innerHTML = '';
        this.currentStage = 0;
        this.ifPlayingPause();
    }

    solve(data) {
        this.grid = Object.values(data);
        //look at the number of tubes in the first grid
        this.numberOfTubes = this.grid[0].length
        //look at the number of balls in the first tube in the first grid.
        this.ballsPerTube = this.grid[0][0].length;//getTubeSize()
        this.prepareToDraw();
    }


    prepareToDraw() {
        this.display.before(this.stage);
        this.setDisplaySize();
        this.drawTubes();
    }

    setDisplaySize() {
        this.display.style.width = (60+(32*this.ballsPerTube)) + "px";
    }

    drawTubes(){
        // displays the stage
        this.stage.innerText = `Stage ${this.currentStage+1} of ${this.grid.length}`;
        // this.display.appendChild(this.stage);
        // this.display.appendChild(document.createElement("p"));
        //reset Tubes
        this.tubes = {};
        //displays the tubes
        for(let i = 0; i < this.numberOfTubes; i++) {
            let tube = new Tube(this.ballsPerTube)
            tube.setLeft(i);
            tube.setTop(100);
            this.tubes[i] = tube;
            
            //want to add - make the from and destination tubes change colour or highlight in some way
            this.display.appendChild(tube.getDiv());        
            // displays the balls
            //done in reverse so we're effectively drawing from the bottom up
            for (let x = this.grid[this.currentStage][i].length-1; x >= 0 ; x--) {
                //create ball (div), set class and color
                let ball = new Ball(this.grid[this.currentStage][i][x]);  
                ball.setBottom(x * 32)
                tube.addBall(ball);
            }        
        }
        this.display.appendChild(document.createElement("p"));
    }

    prevStage() {
        if(this.currentStage > 0) this.currentStage--;
        if(this.currentStage == 0) this.prev.disabled = true;
        this.next.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }

    nextStage() {
        if(this.currentStage < this.grid.length-1) this.currentStage++;
        if(this.currentStage == this.grid.length-1) this.next.disabled = true;
        this.prev.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    firstStage() {
        this.currentStage = 0;
        this.prev.disabled = true;
        this.next.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    lastStage() {
        this.currentStage = this.grid.length-1
        this.next.disabled = true;
        this.prev.disabled = false;
        this.display.innerHTML = '';
        this.drawTubes();
    }
    
    async play() {
        this.resetTimeout();
        const wait = (timeToDelay) => new Promise((resolve) => this.timeoutHandle = setTimeout(resolve, timeToDelay));
        
        this.showPlayControls();
        while (this.currentStage < this.grid.length-1) {
            await wait(this.playSpeed);
            this.nextStage();
        }
        this.hidePlayControls();
    }
    
    playPause() {
        //if playing, pauses, if not, starts 
        if (this.isPlaying()) this.pause();
        else this.play();
    }
    
    isPlaying() {
        if (document.querySelector('.playControls').style.visibility == 'hidden') {
            return false; 
        } else {
            return true;
        }
    }

    //When you want it to stop if it's playing
    ifPlayingPause() {
        if (this.isPlaying()) this.pause();
    }
    
    playFromStart() {
        this.resetTimeout();
        this.currentStage = -1;
        this.play();
    }
    
    pause() {
        this.resetTimeout();
        this.hidePlayControls();
    }
    
    resetTimeout() {
        clearTimeout(this.timeoutHandle);
    }
    
    faster() {
        // don't want to be able to stop it
        if (this.playSpeed > 200) this.playSpeed-=200;
        console.log(this.playSpeed);
    }
    
    slower() {
        this.playSpeed+=200;
        console.log(this.playSpeed);
    }
    
    reset() {
        this.playSpeed = 1000;
        console.log(this.playSpeed);
    }
    
    showPlayControls() {
        document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'visible');  
    }
    
    hidePlayControls() {
        document.querySelectorAll('.playControls').forEach((el) => el.style.visibility = 'hidden');
    }
    
}
