Ball-sorter
===============

Ball sort puzzle solver visualizer and puzzle builder
----

I recently started playing one of those ball sort puzzle games on my phone.  This led to me to looking for a solver once I got into the 600s, which is when I found <a href="https://github.com/tjwood100/ball-sort-puzzle-solver" target="_blank">this solver</a>. It worked but was very hard to use to actually solve larger puzzles due to it being terminal based. 

Here are some tools that I built using plain JavaScript and CSS (as a good refresher) for puzzles from games like <a href="https://play.google.com/store/apps/details?id=com.spicags.ballsort&hl=en_US&gl=US" target="_blank">Ball Sort Puzzle </a> and all of the similar games.  

I have now recreated the solver in Javascript, making it a seamless building and solving process.  You can randomly generate a puzzle, and there are also a few pre-solved puzzles included.

**Note** Currently there is an issue where some larger puzzles freeze up while trying to solve.  I'm trying to diagnose.  

Both tools are fairly complete, and polished, but not perfect. 

Solver Animator
-----
![image](images/solver.png)

This is the first part that I made.  

You can select the puzzle to solve from the dropdown list of presolved puzzles.

You can move through the stages using the buttons or the keyboard:
- Up: Go to beginning
- Down: Go to end
- Left: Back one stage
- Right: Forward one stage
- Space: Play/Pause

You can play the animation.  Additional controls appear when you start it.  Default time between frames is 1 second.  Each speed adjustment changes the cadence by 200ms, between 200 and infinity.  

To quote the original author, the solver has: ** a couple of other minor optimisations but otherwise it's pretty naive.**  This means that you'll see it making some 'dumb' moves, so the total number of steps is higher than an optimal solve.  But it works.  Most of the time. 


Builder
----
![image](images/builder.png)

The builder allows you to create an existing puzzle, and solve it, or output it to JSON [since I made the solver, this isn't really relevant].  
1. Select how many colours (there will be 2 more tubes than this number for the 2 empty tubes) and how many balls per tube. Click Update Grid to apply the changes to the size.
2. Fill in the highlighted ball by clicking on the corresponding colour on the bottom row.  The selection will automatically move to the next one. 
3. Once the grid is complete, click Solve Puzzle.

You can click on any ball in the tubes at any time to select it and assign it a colour.  If you want to remove the colour from a ball, because, say you mixed two colours up but the grid is complete, click the 'clear' ball - the one at the far right, and then you can reassign them. 

When you have used the maximum number of one colour, the ball to select it will be greyed out - and you will get a message saying it's been maxed out. 


Solver
----
For this part, I recreated the solver mentioned above in JavaScript from the python in which it was originally written.  It's a recursive depth-first backtracking algo.  That means it checks every possible move to see if it's legal, and then if it is, if it solved the puzzle.  If it doesn't, it continues doing this until it's solved or a dead end is reached.  If it's a dead end, it will backtrack and try the next move.  It keeps track of each position it legally visits, ignoring the order of the actual tubes, so it doesn't get stuck in a loop.  It's not meant to be a perfect solver, so you'll see some pretty niave moves, but it will get there eventually... usually. 

Currently there is an issue with some larger puzzles running endlessly, which I'm working on.  Usually under 10 balls you're fine, 11 or 12 it's hit or miss, and more than that it will rarely solve it.  

Currently it takes well under a second, at least on my computer, for any puzzle it can solve. 

