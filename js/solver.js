// This is not my code, it's way too good.  I just rewrote it from Python to JS.
class Solver {
    constructor() {
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
        console.log(unSolvedPuzzle)
        this.output = []
        const grid = unSolvedPuzzle['tubes']
        this.tubeHeight = grid[0].length;
        let solved = this.solveGrid(grid, visitedPositions);

        if (solved) {
            this.output.push(grid)
            console.log('Final Output: ', this.output.reverse())
            this.JSONOutput = this.toJson();
        } else {
            console.log("There is no solution")            
        }
    }
    
    loadGrid() {
        return {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","YELLOW"],["LIME","LIME","LIME"],[],[]]}
        // return {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["YELLOW","YELLOW","RED"],["LIME","LIME","LIME"],[],[]]}
        // return {"tubes":[["RED","RED","RED"],["BLUE","BLUE","BLUE"],["LIME","LIME","YELLOW"],["YELLOW","YELLOW","LIME"],[],[]]}
        // return  {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","LIME"],["LIME","LIME","YELLOW"],[],[]]}
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
                        let solved = this.solveGrid(grid2, JSON.parse(JSON.stringify(visitedPositions)));
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
                let aa = 0
                return false;
            }   
            // elements in tube don't all match first elem
        }
        let a=0
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

