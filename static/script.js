import GraphicPyodide from "./pyodideCore/graphicPyodide.js";
import Console from "./console.js"

// DOM Elements
const executeBtn = document.getElementById("executeBtn");
const stopBtn = document.getElementById("stopBtn");
const sendInputBtn = document.getElementById("send-input-button");
const inputBox = document.getElementById("console-input-box");
const graphicGameSelect = document.getElementById("chooseGameType");
const clearConsoleBtn = document.getElementById("clear-console-btn");

import initialCodeSnippet from "./initialization/startupcode.js";

// Objects
let editor;
let consoleElement = new Console("console");
let graphicPyodide = new GraphicPyodide(consoleElement);

// Runtime Vars
const defaultCode = initialCodeSnippet;
`

`;
let initialUserCode = defaultCode;
let userCode;
let programCurrentlyRunning = false;
let testingTimeout = null;

function showLoading() {
  $("#control-panel").hide();
  $("#spinner").show();
}

function loadEditor() {
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/clouds");
  editor.session.setMode("ace/mode/python");
}

function setToDefault() {
  initialUserCode = defaultCode;
  editor.setValue(initialUserCode);
  if (graphicPyodide) graphicPyodide.setDefaultGameType();
}

async function loadPyodide() {
  await graphicPyodide.setup();
  graphicPyodide.setOnErrorCallback((err) => {
    console.log(err);
    programCompletedRunning();
  });
}

function showControlPanel() {
  $("#spinner").hide();
  $("#control-panel").show();
  stopBtn.disabled = true;
  sendInputBtn.disabled = true;
}

function setupEventListeners() {
  // Run Button
  executeBtn.addEventListener("click", () => {
    if (programCurrentlyRunning) return;
    programRunning();
    consoleElement.clear();
    userCode = editor.getValue();
    graphicPyodide.runCode(userCode);
  });

  // Stop Button
  stopBtn.addEventListener("click", () => {
    if (!programCurrentlyRunning) return;
    graphicPyodide.stopExecution();
  });

  // Sending Input to Console
  inputBox.addEventListener("input", (event) => {
    if (inputBox.value.trim() === "") {
      sendInputBtn.disabled = true;
    } else {
      sendInputBtn.disabled = false;
    }
  });
  inputBox.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      handleInput();
    }
  });
  sendInputBtn.addEventListener("click", () => {
    handleInput();
  });

  // Graphic Games Selection
  graphicGameSelect.addEventListener("change", () => {
    let graphicGameText = graphicGameSelect.value;
    if (graphicGameText != "Choose a graphic game") {
      loadGame(graphicGameText);
    } else {
      setToDefault();
    }
  });

  // Clearing Console
  clearConsoleBtn.addEventListener('click', () => {
    consoleElement.clear();
  });
}

function handleInput() {
  if (programCurrentlyRunning) return;
  let command = inputBox.value;
  if (command.trim() === "") return;
  inputBox.value = "";
  sendInputBtn.disabled = true;
  consoleElement.addCommand(command);
  graphicPyodide.evaluateConsoleCode(command);
}

function loadGame(gameType) {
  graphicPyodide.setGameType(gameType);
  let functionSignature = graphicPyodide.getFunctionSignatureForGame(gameType);
  initialUserCode = 'def '+functionSignature+':\n\t# Write your code below this line\n\tpass';
  editor.setValue(initialUserCode);
}

function programRunning() {
  testingTimeout = setTimeout(runTests, 3000)
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

function runTests() {
  let codeToCheck = userCode;
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
      "name": "hello world in output",
      "type": "output",
      "feedback": "Check if you used the print function to correctly print a msg.",
      "info": {
          "output": "hello world"
      }
    },
    // {
    //   "name": "sum 5 function test",
    //   "type": "function",
    //   "feedback": "Check the sum function",
    //   "info": {
    //       "function": "sum5",
    //       "cases": [
    //         {"args": [12], "expected_return_value": 17},
    //         {"args": [1], "expected_return_value": 6},
    //         {"args": [10], "expected_return_value": 15}
    //       ]
    //   }
    // }
  ]};
  let testResults = graphicPyodide.runTests(codeToCheck, jsonFile);
  console.log(testResults);
}

showLoading();
loadEditor();
setToDefault();
await loadPyodide();
showControlPanel();
setupEventListeners();
