import GraphicPyodide from "./pyodideCore/graphicPyodide.js";

let editor;
let graphicPyodide;
let consoleElement;

// Standard default code
const defaultCode = 
`x = 0
def setup():
    createCanvas(400, 400)

def draw():
    global x
    background(0)
    ellipse(x, 200, 100, 100)
    x += 1
`;
let initialUserCode = defaultCode;

async function setup() {
  // Ace editor window
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.session.setMode("ace/mode/python");

  // Load GraphicPyodide object
  consoleElement = new Console("output")
  graphicPyodide = new GraphicPyodide(consoleElement);
  await graphicPyodide.setup();

  // Set initial code in editor
  setToDefault();

  const executeBtn = document.getElementById("executeBtn");
  executeBtn.addEventListener("click", () => {
    document.getElementById("sketch-holder").innerHTML = "";
    consoleElement.clear();
    let userCode = editor.getValue();
    let errorOccurred = graphicPyodide.runCode(userCode);
    if (!errorOccurred) {
      runTests(userCode, consoleElement.fetchOutput());
    }
  });

  const stopBtn = document.getElementById("stopBtn");
  stopBtn.addEventListener("click", () => {
    graphicPyodide.stopExecution();
    // document.getElementById("sketch-holder").innerHTML = "";
    // consoleElement.clear();
  });

  // Loading a graphic game, comment out if not needed
  const graphicGameSelect = document.getElementById("chooseGameType");
  graphicGameSelect.addEventListener("change", () => {
    let graphicGameText = graphicGameSelect.value;
    if (graphicGameText != "Choose a graphic game") {
      loadGame(graphicGameText);
    } else {
      setToDefault();
    }
  });
}
setup();

function loadGame(gameType) {
  graphicPyodide.setGameType(gameType);
  let functionSignature = graphicPyodide.getFunctionSignatureForGame(gameType);
  initialUserCode = 'def '+functionSignature+':\n\t# Write your code below this line\n\tpass';
  editor.setValue(initialUserCode);
}
function setToDefault() {
  initialUserCode = defaultCode;
  editor.setValue(initialUserCode);
  graphicPyodide.setDefault();
}

function runTests(codeToCheck, consoleOutput) {
  let jsonFile = {"tests": [
      {
        "name": "print function used",
        "type": "regex",
        "feedback": "Check if you used the print function.",
        "info": {
            "string": "print\\s*\\(\\s*.*\\)"
        }
    }
  ]};
  let testResults = graphicPyodide.runTests(codeToCheck, consoleOutput, jsonFile);
  console.log(testResults);
}

function Console(outputElementID) {
  let outputBox = document.getElementById(outputElementID);
  let enabled = false;

  this.enable = function() {
    enabled = true;
  }
  this.disable = function() {
    enabled = false;
  }

  this.addToConsole = function(msg) {
    if (!enabled) {
      return;
    }
    outputBox.value += msg+"\n";
  }

  this.fetchOutput = function() {
    return outputBox.value;
  }

  this.clear = function() {
    console.log("cleared");
    outputBox.value = "";
  }
}