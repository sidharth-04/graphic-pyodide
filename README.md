# Graphic Pyodide
Using P5 with Pyodide for writing interactive python programs in the browser.

## Set Up
 - Run the build_boilerplate.py script, which will build the python code into a boilerplate.js file under pyodideCore
 - Run index.html on a live server
 - In script.js, if a game is to be loaded, loadGame(gameType) can be passed the following values: "bouncer", "growingsun", "speedball", "rockboat", "button". Comment out loadGame(gameType) if only the basic drawing functionality is required.