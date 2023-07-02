import GraphicPyodide from "./pyodideCore/graphicPyodide.js";

let editor;
let graphicPyodide;

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

  // Load pyodide
  const config = {
    indexURL : "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
    fullStdLib: false
  }
  window.pyodide = await loadPyodide(config);

  // Load GraphicPyodide object
  graphicPyodide = new GraphicPyodide(window.pyodide);
  graphicPyodide.setup();

  // Set initial code in editor
  setToDefault();

  const executeBtn = document.getElementById("executeBtn");
  executeBtn.addEventListener("click", () => {
    document.getElementById("sketch-holder").innerHTML = "";
    document.getElementById('output').value = "";
    let userCode = editor.getValue();
    graphicPyodide.runCode(userCode);
    // runTests(userCode);
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

function runTests(codeToCheck) {
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
  graphicPyodide.runTests(codeToCheck, "", jsonFile);
}