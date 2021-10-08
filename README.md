# Ball-sorter
Ball sort puzzle solver visualizer and puzzle builder

I recently started playing one of those ball sort puzzle games on my phone.  This led tme to looking for a solver once I got into the 600s, which is when I found <a href="https://github.com/tjwood100/ball-sort-puzzle-solver" target="_blank">this solver</a>. It worked but was very hard to use to actually solve larger puzzles due to it being terminal based. 

Here are two tools that I built using plain JavaScript and CSS (as a good refresher) related to puzzles from games like <a href="https://play.google.com/store/apps/details?id=com.spicags.ballsort&hl=en_US&gl=US" target="_blank">Ball Sort Puzzle </a> and all of the similar games.  

Ideally you would build the grid you want to solve, solve it using that solver and then send it to my animator. As the original only outputs text, I had to modify it to make it output a JSON file I could work with.  So because there is no way to do it yourself **right now**, I have included several solved puzzles you can see in the Solver, and you can build and generate JSON for any puzzle you like.  

Currently you must copy the JSON and save it, as I am not using Node on this project.

Both tools are fairly complete, and polished. 

**Solver**
This is the first one I made.  You can move using the buttons or the keyboard arrows:
- Up: Go to beginning
- Down: Go to end
- Left: Back one stage
- Right: Forward one stage

You can play the animation.  Additional controls appear when you start it.  Default time between frames is 1 second.  Each speed adjustment changes the cadence by 200ms, between 200 and infinity.  




**Builder**

