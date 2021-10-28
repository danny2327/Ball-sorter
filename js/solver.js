// This is not my code, it's way too good.  I just rewrote it from Python to JS.
class Solver {
    constructor(unSolvedPuzzle) {
        let visitedPositions = []
        this.jsonOutput = []
        this.unSolvedPuzzle = {"tubes":[["BLUE","YELLOW","RED"],["BLUE","BLUE","RED"],["RED","YELLOW","YELLOW"],[],[]]}; //will load from disk
        const grid = this.unSolvedPuzzle['tubes']
        this.tubeHeight = grid[0].length;
        console.log(grid);
        // Add the isValid checks etc
        let solved = this.solveGrid(grid, visitedPositions);
        // let solved = this.solveGrid(Array.from(grid), Array.from(visitedPositions));
        if (solved) {
            this.jsonOutput.push(grid)
            console.log('Final Output: ',this.jsonOutput)
        } else console.log("There is no solution")
    }
    
    loadGrid() {

    }

    isGridValid() {

    }

    solveGrid(grid, visitedPositions) {

        // let abc = ['a','b','c']
        // let abcd = this.test(abc);
        // console.log('abc',abc)
        // STARTING HERE
        // console.log(grid);

        // visitedPositions keeps track of all the states of the grid we have considered
        // to make sure we don't go round in circles
        // canonical (ordered) string representation of the grid means
        // that two grids that differ only by the order of the tubes are
        // considered as the same position
        visitedPositions.push(this.gridToCanonicalString(grid));
        // console.log(visitedPositions)


        // The problem here is to do with visitedPositions I think - having it set as a global was screwing things up because 
        // it should reflect the current grid - or should it?  A bad path is a bad path regardless of how you go there. 

        // Another issue appears to be with the moves themselves, non-valid moves are getting through
        // 


        for (let i = 0; i < grid.length; i++) {
            const tube = grid[i];
            // const tube = JSON.parse(JSON.stringify(grid[i]));
            for (let j = 0; j < grid.length; j++) {
                if (i == j) continue;                
                // console.log('j',j)
                const candidateTube = grid[j];
                // const candidateTube = Array.from(grid[j]);
                
                //////Why does commenting this out remove but not place the balls it moves. 
                ////////////// It should just return true or false, it should have no effect on anything

                if (this.isMoveValid(tube, candidateTube)) {
                // if(this.tubeHeight<=100) {
                    
                    // console.log(grid)
                    let grid2 = JSON.parse(JSON.stringify(grid));
                    // let grid2 = Array.from(grid);
                    // let grid2 = JSON.parse(JSON.stringify(grid));
                    // console.log(grid2)
                    // console.log(grid2)
                    // These 2 purposefully left not .concat() because they need to change things. 
                    grid2[j].push(grid2[i].pop())
                    // console.log('i',i,'j',j,grid2)

                    // ***  When I go from above to below here, on the i:0, j:4, 6 levels in, tube shows there is a yellow
                    // *** but grid shows tube 0 is empty.  the yellow in tube 0 should be there, it should not have gone back to 
                    // *** tube 4.  I suspect it's because the recursion started reversing and it was referencing an old object of grid.
                    // *** Also when I get here, grid changes when pushing to GRID2! 


                    if(this.isSolved(grid2)) {
                    // if(this.isSolved(Array.from(grid2))) {
                        this.jsonOutput.push(grid2);
                        return true;
                    }

                    let gridStrings = this.gridToCanonicalString(grid2);
                    // console.log(gridStrings)
                    if(!visitedPositions.includes(gridStrings)) {
                        //If it gets here, it's NOT already in the visitedPositions
                        let solved = this.solveGrid(grid2, visitedPositions.concat());
                        // let solved = this.solveGrid(Array.from(grid2), Array.from(visitedPositions));
                        // This is the first time it's backed up after a dead end - I think.  An array is being remembered

                        if (solved) {
                            this.jsonOutput.push(grid2);
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
            // console.log(tubeStrings);
        });
        let sortedTubeStrings = tubeStrings.sort()
        return sortedTubeStrings.join(';');
    }

    isSolved(grid) {
        if (this.tubeHeight == 0) {
            this.tubeHeight = (grid[0].length);
        }
        // for (let tube in grid) {
        // grid.forEach(tube => {
        for(let t = 0; t < grid.length; t++) {
            if(grid[t].length == 0) return;
                else if (grid[t].length < this.tubeHeight) return false;
                else if (Object.values(grid[t]).filter(x => x === grid[t][0]).length !== this.tubeHeight) return false;   // elements in tube don't all match first elem
            return true;
        };
    }

    isMoveValid(tube, candidateTube) {
        // move is valid if the source tube isn't empty,
        // the destination isn't full,
        // and the ball at the end of the source tube is the same as the
        // ball at the end of the destination.
        // But there are also some optimisations to avoid pointless moves.        
        // console.log(tube, candidateTube)
        if (tube.length == 0 || candidateTube.length == this.tubeHeight) {
            
            // console.log('valid?', tube, candidateTube)
            return false;
        }
        
        let numFirstColour = Object.values(tube).filter(x => x === tube[0]).length;
        
        if (numFirstColour == this.tubeHeight) { 
            // console.log('Second return: false', tube, candidateTube)
            return false
        }
        // # tube is full of same colour, ignore
        
        if (candidateTube.length == 0) {
            if (numFirstColour == tube.length) {
                // console.log(numFirstColour, tube.length)
                // console.log('3rd return: false', tube, candidateTube)
                return false
            }
            console.log('4th return: true', tube, candidateTube)
            return true
        }
        
        // console.log('Right before comparing the last 2', tube, candidateTube)
        // let candidateTubeLast = candidateTube[candidateTube.length-1];
        // let tubeLast = tube[tube.length-1]
        // let match = candidateTubeLast === tubeLast
        let match = candidateTube.concat().pop() === tube.concat().pop()
        if (match) console.log('Returns true');//, tube, candidateTube)
        return match
    }

}



// I'm learning a lot about arrays and how modifying a copy of one is ridiculous. 
// 
// 
// 
// 
// 