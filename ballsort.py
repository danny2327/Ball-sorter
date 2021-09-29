#!/usr/bin/env python3

import argparse
import copy
import json
import time
import pprint as pp
from collections import OrderedDict


def isValidGrid(grid):
    numTubes = len(grid)
    tubeHeight = max(len(t) for t in grid)
    numBalls = sum(len(t) for t in grid)
    numBallsRequired = (numTubes-2)*tubeHeight
    if (numBalls != numBallsRequired):
        print("Grid has incorrect number of balls")
        return False
    freqs = dict()
    for tube in grid:
        for ball in tube:
            if ball not in freqs:
                freqs[ball] = 1
            else:
                freqs[ball] += 1
    for colour,count in freqs.items():
        if count != tubeHeight:
            print("Expected "+str(tubeHeight)+" "+colour+" balls, found "+str(count))
            return False
    return True

def isSolved(grid, tubeHeight=None):
    if tubeHeight is None:
        tubeHeight = max(len(t) for t in grid)
    for tube in grid:
        if(len(tube) == 0):
            continue
        elif(len(tube) < tubeHeight):
            return False
        elif(tube.count(tube[0]) != tubeHeight): # elements in tube don't all match first elem
            return False
    return True

def loadGrid():
# def loadGrid(fileName):
    # 2 colours, 4x4 tubes (2 empty)
    # with open(filename) as json_file: 
    # 12 colours, 14x5 tubes (2 empty)
    # with open('exampleeasy.json') as json_file: #2 colours
    # with open('exampleeasy2.json') as json_file: #3 colours
    # with open('exampleeasy3.json') as json_file: #5 colours
    # with open('exampleeasy4.json') as json_file: #9 colours
    with open('example.json') as json_file: #14 colours
        data = json.load(json_file)
        grid = data['tubes']
        return grid

def writeJson(data, f='ballsortSolved new 616.json'):
    jsonObj = json.dumps(data, indent=4)
    with open(f, 'w') as outfile:
        outfile.write(jsonObj)
    print(f + " successfully written")

def printGridToString(grid):
    lines = []
    for tube in grid:
        #print(tube)
        lines.append(''.join(tube))
    return("\n".join(lines))

def isMoveValid(tubeHeight, fromTube, candidateTube):
    # move is valid if the source tube isn't empty,
    # the destination isn't full,
    # and the ball at the end of the source tube is the same as the
    # ball at the end of the destination.
    # But there are also some optimisations to avoid pointless moves.
    
    if len(fromTube) == 0 or len(candidateTube) == tubeHeight:
        return False
    numFirstColour = fromTube.count(fromTube[0])
    if numFirstColour == tubeHeight: # tube is full of same colour, don't touch it
        return False
    if len(candidateTube) == 0:
        if numFirstColour == len(fromTube): # source tube all the same colour, so pointless moving to empty tube
            return False
        return True
    return fromTube[-1] == candidateTube[-1]

def gridToCanonicalString(grid):
    tubeStrings = []
    for tube in grid:
        tubeStrings.append(','.join(tube))
    sortedTubeStrings = sorted(tubeStrings)
    return ';'.join(sortedTubeStrings)

def solveGrid(grid, jsonOutput, tubeHeight=None, visitedPositions=set(), answer=[]):
    if tubeHeight is None:
        tubeHeight = max(len(t) for t in grid)

    # visitedPositions keeps track of all the states of the grid we have considered
    # to make sure we don't go round in circles
    # canonical (ordered) string representation of the grid means
    # that two grids that differ only by the order of the tubes are
    # considered as the same position
    visitedPositions.add(gridToCanonicalString(grid))
    for i in range(len(grid)):
        tube = grid[i]
        for j in range(len(grid)):
            if i == j:
                continue
            candidateTube = grid[j]
            if isMoveValid(tubeHeight, tube, candidateTube):
                # answer.append(printGridToString(grid)) if len(answer) == 0 else ''
                # if len(answer) == 0:
                #     answer.append(printGridToString(grid))
                grid2 = copy.deepcopy(grid)
                grid2[j].append(grid2[i].pop())
                if(isSolved(grid2, tubeHeight)):
                    answer.append(printGridToString(grid2))
                    jsonOutput.append(grid2)
                    return True
                if(gridToCanonicalString(grid2) not in visitedPositions):
                    solved = solveGrid(grid2, jsonOutput, tubeHeight, visitedPositions, answer)
                    if solved:
                        answer.append(printGridToString(grid2))    
                        jsonOutput.append(grid2)
                        return True        
    return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="(Attempt to) solve a ball sort puzzle")
    # parser.add_argument("json",help="filename of input file (in JSON format)")
    parser.add_argument("--show-working", dest="working", help="Print out the steps to the solution", action='store_true')
    args = parser.parse_args()
    # grid = loadGrid(args.json)
    grid = loadGrid()
    start = time.time()
    if not isValidGrid(grid):
        exit("Invalid grid")
    if isSolved(grid):
        print("Grid is already solved")
        exit()
    print(printGridToString(grid))
    print("--")
    answer = []
    jsonOutput = []
    jsonOutput.append(grid)
    visitedPositions = set()
    solved = solveGrid(grid, jsonOutput=jsonOutput,visitedPositions=visitedPositions, answer=answer)
    end = time.time()
    print("Visited "+str(len(visitedPositions))+" positions in "+str(round(end-start, 3))+" seconds")
    if not solved:
        print("No solution")
    else:
        print("Solved in "+str(len(answer))+" moves")
        jsonOutput.append(jsonOutput.pop(0))
        jsonOutput.reverse()
        writeJson(jsonOutput)
        if(args.working):
            answer.reverse()
            for step in answer:
                print(step)
                print('--')
