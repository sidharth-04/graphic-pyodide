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
  $("#control-panel").hide();
  $("#spinner").show();

  // Ace editor window
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.session.setMode("ace/mode/python");

  // Set initial code in editor
  setToDefault();

  // Load GraphicPyodide object
  consoleElement = new Console("output")
  graphicPyodide = new GraphicPyodide(consoleElement);
  await graphicPyodide.setup();
  graphicPyodide.setOnErrorCallback(() => {
    stopBtn.disabled = true;
  });

  $("#spinner").hide();
  $("#control-panel").show();

  const executeBtn = document.getElementById("executeBtn");
  const stopBtn = document.getElementById("stopBtn");
  stopBtn.disabled = true;

  executeBtn.addEventListener("click", () => {
    stopBtn.disabled = false;
    consoleElement.clear();
    let userCode = editor.getValue();
    // Find a way to check for runtime errors, only syntax errors are recorded now
    // Maybe run for 30 frames and see if an error shows up
    let errorOccurred = graphicPyodide.runCode(userCode);
    if (!errorOccurred) {
      runTests(userCode, consoleElement.fetchOutput());
    }
  });

  stopBtn.addEventListener("click", () => {
    graphicPyodide.stopExecution();
    stopBtn.disabled = true;
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
  if (graphicPyodide) graphicPyodide.setDefault();
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
    // console.log('logged');
  }

  this.fetchOutput = function() {
    return outputBox.value;
  }

  this.clear = function() {
    console.log("cleared");
    outputBox.value = "";
  }
}