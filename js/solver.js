// This is not my code, it's way too good.  I just rewrote it from Python to JS.
//***TO DO***
//Show time to solve
// handle if it can't solve 
class Solver {
    constructor() {
        this.counter = 0;
    }

    useSample() {
        let unSolvedPuzzle = this.loadGrid()
        this.solve(unSolvedPuzzle);
    }

        // SEPARATE OUT OF CONSTRUCTOR
    getJSON() {
        if(this.JSONOutput) return this.JSONOutput;
        else {
            console.log('No solution found')
        }
    }


    solve(unSolvedPuzzle) {
        let visitedPositions = []
        this.output = []
        console.log(typeof unSolvedPuzzle)
        let grid
        if(unSolvedPuzzle['tubes']) {
            grid = unSolvedPuzzle['tubes']
        } else {
            grid = JSON.parse(unSolvedPuzzle)['tubes']
        }
        
        this.tubeHeight = grid[0].length;
        let solved = this.solveGrid(grid, visitedPositions);


        if (solved) {
            this.output.push(grid)
            this.output.reverse()
            // console.log('Final Output: ', this.output.reverse())
            this.JSONOutput = this.toJson();
        } else {
            console.log("There is no solution")            
        }
    }
    
    loadGrid() {

        //Works
        return {"tubes":[["YELLOW","GREEN","BLUE","LIME","LIME"],["ORANGE","PURPLE","YELLOW","ORANGE","WHITE"],["WHITE","YELLOW","ORANGE","PURPLE","LIME"],["TEAL","ORANGE","PURPLE","BLUE","AQUA"],["GREEN","TEAL","AQUA","GREEN","TEAL"],["GREEN","AQUA","PURPLE","ORANGE","AQUA"],["BLUE","BLUE","LIME","RED","AQUA"],["TEAL","YELLOW","RED","LIME","YELLOW"],["WHITE","GREEN","WHITE","TEAL","PURPLE"],["RED","BLUE","RED","RED","WHITE"],[],[]]}

        //Does't work
        // return {"tubes":[["RED","TEAL","GREEN","LIME","RED"],["AQUA","LIGHTPINK","RED","PURPLE","FUCHSIA"],["YELLOW","TEAL","PURPLE","PURPLE","LIGHTPINK"],["BLUE","YELLOW","WHITE","LIGHTPINK","FUCHSIA"],["LIME","WHITE","GREEN","TEAL","LIME"],["AQUA","ORANGE","RED","BLUE","FUCHSIA"],["LIME","ORANGE","YELLOW","WHITE","RED"],["AQUA","FUCHSIA","LIME","GREEN","FUCHSIA"],["GREEN","TEAL","YELLOW","WHITE","GREEN"],["AQUA","ORANGE","BLUE","TEAL","YELLOW"],["PURPLE","BLUE","AQUA","WHITE","LIGHTPINK"],["LIGHTPINK","ORANGE","ORANGE","PURPLE","BLUE"],[],[]]}

        // return {"tubes":[["FUCHSIA","LIME","YELLOW","FUCHSIA","YELLOW"],["YELLOW","YELLOW","GREEN","BLUE","LIGHTPINK"],["ORANGE","ORANGE","YELLOW","BLUE","WHITE"],["FUCHSIA","ORANGE","RED","WHITE","WHITE"],["LIME","LIME","PURPLE","TEAL","BLUE"],["FUCHSIA","PURPLE","WHITE","PURPLE","LIGHTPINK"],["LIME","FUCHSIA","LIME","BLUE","RED"],["RED","GREEN","AQUA","BLUE","AQUA"],["GREEN","BROWN","PURPLE","RED","ORANGE"],["TEAL","TEAL","LIGHTPINK","LIGHTPINK","PURPLE"],["LIGHTPINK","ORANGE","BROWN","RED","TEAL"],["GREEN","BROWN","AQUA","GREEN","TEAL"],["BROWN","AQUA","BROWN","WHITE","AQUA"],[],[]]}
        // return {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","YELLOW"],["LIME","LIME","LIME"],[],[]]}
        // return {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["YELLOW","YELLOW","RED"],["LIME","LIME","LIME"],[],[]]}
        // return {"tubes":[["RED","RED","RED"],["BLUE","BLUE","BLUE"],["LIME","LIME","YELLOW"],["YELLOW","YELLOW","LIME"],[],[]]}
        //return  {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","LIME"],["LIME","LIME","YELLOW"],[],[]]}
        // return  {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","YELLOW"],[],[]]} 
        // return  {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","YELLOW"],[],[]]} 
        // return  {"tubes":[["RED","BLUE"],["BLUE","RED"],[],[]]} 

    }

    // Still to be done****
    isGridValid() {
        // numTubes = len(grid)
        // tubeHeight = max(len(t) for t in grid)
        // numBalls = sum(len(t) for t in grid)
        // numBallsRequired = (numTubes-2)*tubeHeight
        // if (numBalls != numBallsRequired):
        //     print("Grid has incorrect number of balls")
        //     return False
        // freqs = dict()
        // for tube in grid:
        //     for ball in tube:
        //         if ball not in freqs:
        //             freqs[ball] = 1
        //         else:
        //             freqs[ball] += 1
        // for colour,count in freqs.items():
        //     if count != tubeHeight:
        //         print("Expected "+str(tubeHeight)+" "+colour+" balls, found "+str(count))
        //         return False
        // return True
    }

    toJson() {
        let newObject = {}
        for (let i = 0; i < this.output.length; i++) {
            newObject[i] = this.output[i];            
        }    
        return JSON.stringify(newObject);        
    }

    solveGrid(grid, visitedPositions) {
        // visitedPositions keeps track of all the states of the grid we have considered
        // to make sure we don't go round in circles
        // canonical (ordered) string representation of the grid means
        // that two grids that differ only by the order of the tubes are
        // considered as the same position
        visitedPositions.push(this.gridToCanonicalString(grid));

        for (let i = 0; i < grid.length; i++) {
            const tube = grid[i];
            for (let j = 0; j < grid.length; j++) {
                if (i == j) continue;                
                const candidateTube = grid[j];
                
                if (this.isMoveValid(tube, candidateTube)) {

                    let grid2 = JSON.parse(JSON.stringify(grid));

                    grid2[j].push(grid2[i].pop())

                    if(this.isSolved(grid2)) {
                        this.output.push(grid2);
                        return true;
                    }

                    let gridStrings = this.gridToCanonicalString(grid2);
                    if(!visitedPositions.includes(gridStrings)) {
                        //If it gets here, it's NOT already in the visitedPositions

                        // With this one, it works up to about 10-12 balls x 5.  More than that it fails.
                        let solved = this.solveGrid(grid2, JSON.parse(JSON.stringify(visitedPositions)));

                        //With this one, this is the original issue I had, it worked the odd time when maybe there was no backtracking necessary?
                        // let solved = this.solveGrid(grid2, visitedPositions);
                        this.counter++;
                        if (solved) {
                            this.output.push(grid2);
                            return true;
                        }
                    }
                }                
            }            
        } return false;
    }

    gridToCanonicalString(grid) {
        let tubeStrings = []
        grid.forEach(tube => {
            tubeStrings.push(tube.join())
        });
        let sortedTubeStrings = tubeStrings.sort()
        return sortedTubeStrings.join(';');
    }

    isSolved(grid) {
        if (this.tubeHeight == 0) {
            this.tubeHeight = (grid[0].length);
        }

        for(let t = 0; t < grid.length; t++) {
            let howManyOfFirst = Object.values(grid[t]).filter(x => x === grid[t][0]).length
            // if(grid[t].length == 0) return; //This one is blocking it. Going to refactor it.
            if(grid[t].length == 0) continue; 
            // ** When this works, when it gets to the empty tubes, it just goes right past, but when it doesn't. it hits return and goes 
            // ** back up, never hitting true.

            else if (grid[t].length < this.tubeHeight) return false;
            // else if (Object.values(grid[t]).filter(x => x === grid[t][0]).length !== this.tubeHeight) return false;   
            
            if (howManyOfFirst !== this.tubeHeight) 
            {
                return false;
            }   
            // elements in tube don't all match first elem
        }

        return true;
    }

    isMoveValid(tube, candidateTube) {
        // move is valid if the source tube isn't empty,
        // the destination isn't full,
        // and the ball at the end of the source tube is the same as the
        // ball at the end of the destination.
        // But there are also some optimisations to avoid pointless moves.        
        if (tube.length == 0 || candidateTube.length == this.tubeHeight) {
            return false;
        }
        
        let numFirstColour = Object.values(tube).filter(x => x === tube[0]).length;
        
        // # tube is full of one colour, ignore
        if (numFirstColour == this.tubeHeight) { 
            return false
        }
        
        if (candidateTube.length == 0) {
            if (numFirstColour == tube.length) {
                return false
            }
            return true
        }
        
        return candidateTube.concat().pop() === tube.concat().pop()
    }

}

