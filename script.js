import GraphicPyodide from "./pyodideCore/graphicPyodide.js";
import {asyncRun} from "./workerUtil/py-worker.js";

let editor;
let graphicPyodide;

// Standard default code
let initialUserCode = 
`x = 0
def setup():
    createCanvas(400, 400)

def draw():
    global x
    background(0)
    ellipse(x, 200, 100, 100)
    x += 1
`;

async function setup() {
  // Ace editor window
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.session.setMode("ace/mode/python");

  // Load GraphicPyodide object
  graphicPyodide = new GraphicPyodide(asyncRun, p5);
  graphicPyodide.setup();

  // Loading a graphic game, comment out if not needed
  loadGame("bouncer");

  // Set initial code in editor
  editor.setValue(initialUserCode);

  const executeBtn = document.getElementById("executeBtn");
  executeBtn.addEventListener("click", () => {
    document.getElementById("sketch-holder").innerHTML = "";
    document.getElementById('output').value = "";
    let userCode = editor.getValue();
    graphicPyodide.runCode(userCode);
  });
}
setup();

function loadGame(gameType) {
  graphicPyodide.setGameType(gameType);
  let functionSignature = graphicPyodide.getFunctionSignatureForGame(gameType);
  initialUserCode = 'def '+functionSignature+':\n\t# Write your code below this line\n\tpass';
}