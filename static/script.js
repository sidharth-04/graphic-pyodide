import GraphicPyodide from "./pyodideCore/graphicPyodide.js";
import Console from "./console.js"

let editor;
let consoleElement = new Console("console");
let graphicPyodide = new GraphicPyodide(consoleElement);
let programCurrentlyRunning = false;
let testingTimeout = null;
let userCode;

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

const executeBtn = document.getElementById("executeBtn");
const stopBtn = document.getElementById("stopBtn");
const sendInputBtn = document.getElementById("send-input-button");
const inputBox = document.getElementById("console-input-box");

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
  await graphicPyodide.setup();
  graphicPyodide.setOnErrorCallback(() => {
    programCompletedRunning();
  });

  $("#spinner").hide();
  $("#control-panel").show();
  stopBtn.disabled = true;
  sendInputBtn.disabled = true;

  executeBtn.addEventListener("click", () => {
    if (programCurrentlyRunning) return;
    programRunning();
    consoleElement.clear();
    userCode = editor.getValue();
    graphicPyodide.runCode(userCode);
  });

  stopBtn.addEventListener("click", () => {
    if (!programCurrentlyRunning) return;
    graphicPyodide.stopExecution();
  });

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      sendInputBtn.disabled = true;
      handleInput(inputBox);
    }
  });
  inputBox.addEventListener("input", (event) => {
    if (inputBox.value.trim() === "") {
      sendInputBtn.disabled = true;
    } else {
      sendInputBtn.disabled = false;
    }
  });
  sendInputBtn.addEventListener("click", () => {
    sendInputBtn.disabled = true;
    handleInput(inputBox);
  });

  const graphicGameSelect = document.getElementById("chooseGameType");
  graphicGameSelect.addEventListener("change", () => {
    let graphicGameText = graphicGameSelect.value;
    if (graphicGameText != "Choose a graphic game") {
      loadGame(graphicGameText);
    } else {
      setToDefault();
    }
  });
  const clearConsoleBtn = document.getElementById("clear-console-btn");
  clearConsoleBtn.addEventListener('click', () => {
    consoleElement.clear();
  });
}

await setup();

function setToDefault() {
  initialUserCode = defaultCode;
  editor.setValue(initialUserCode);
  if (graphicPyodide) graphicPyodide.setDefaultGameType();
}

function loadGame(gameType) {
  graphicPyodide.setGameType(gameType);
  let functionSignature = graphicPyodide.getFunctionSignatureForGame(gameType);
  initialUserCode = 'def '+functionSignature+':\n\t# Write your code below this line\n\tpass';
  editor.setValue(initialUserCode);
}
function programRunning() {
  testingTimeout = setTimeout(() => {
    // runTests(userCode, consoleElement.fetchOutput());
  }, 3000)
  stopBtn.disabled = false;
  executeBtn.disabled = true;
  sendInputBtn.disabled = true;
  inputBox.disabled = true;
  programCurrentlyRunning = true;
}
function programCompletedRunning() {
  clearTimeout(testingTimeout);
  testingTimeout = null;
  stopBtn.disabled = true;
  executeBtn.disabled = false;
  if (inputBox.value.trim() === "") sendInputBtn.disabled = true;
  else sendInputBtn.disabled = false;
  inputBox.disabled = false;
  programCurrentlyRunning = false;
}

function handleInput(inputElement) {
  if (programCurrentlyRunning) return;
  let command = inputElement.value;
  if (command.trim() === "") return;
  inputElement.value = "";
  if (command == "") return;
  consoleElement.addCommand(command);
  graphicPyodide.evaluateConsoleCode(command);
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
    },
    {
      "name": "sum 5 function test",
      "type": "function",
      "feedback": "Check the sum function",
      "info": {
          "function": "sum5",
          "cases": [
            {"args": [12], "expected_return_value": 17},
            {"args": [1], "expected_return_value": 6},
            {"args": [10], "expected_return_value": 15}
          ]
      }
    }
  ]};
  let testResults = graphicPyodide.runTests(codeToCheck, consoleOutput, jsonFile);
  console.log(testResults);
}