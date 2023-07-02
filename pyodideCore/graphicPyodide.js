import {preBuiltCode} from "./boilerplate.js";

const startupCode = `
import sys, code
from js import p5, window, document
print(sys.version)

# Redirect output stream
def write(data):
    output_box = document.getElementById('output')
    output_box.value += str(data)
sys.stdout.write = sys.stderr.write = write
`;
const defineNamespaceCode = `
# Define the default namespace
default_ns = globals().copy()
`;

function GraphicPyodide(pyodideInstance) {
    let pyodide = pyodideInstance
    let gameCode = "";
    let defaultNamespace = {};

    const gameMapper = {
        "clicker": [preBuiltCode.graphicClickerCode, 'change_colour(colour)'],
        "bouncer": [preBuiltCode.graphicBouncerCode, 'at_edge(x)'],
        "growingsun": [preBuiltCode.graphicGrowingsunCode, 'get_new_size(size)'],
        "speedball": [preBuiltCode.graphicSpeedballCode, 'get_new_speed(speed)'],
        "rockboat": [preBuiltCode.graphicRockboatCode, 'change_direction(angle)'],
        "button": [preBuiltCode.graphicButtonCode, 'check_clicked(x, y, w, h)'],
    }

    this.setup = function() {
        runInitialCode();
    }
    function runInitialCode() {
        let code = [
            startupCode,
            preBuiltCode.placeholderCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
            preBuiltCode.graphicPackageCode,
            defineNamespaceCode
        ].join('\n');
        runPython(code);
        setDefaultNamespace();
    }
    function setDefaultNamespace() {
        let globalsMap = pyodide.globals.get("default_ns").toJs();
        defaultNamespace = Array.from(globalsMap.keys());
    }
    this.getGlobals = function() {
        return defaultNamespace;
    }

    this.runCode = function(userCode) {
        // Run the trial
        let code = [
            preBuiltCode.clearNamespaceCode,
            preBuiltCode.placeholderCode,
            userCode,
            gameCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
        ].join('\n');
        if (window.instance) {
            window.instance.remove();
        }
        runPython(code);
        pyodide.runPython('noLoop()\nredraw(30)')
        // Run the students code once the trial has been run
        if (window.instance) {
            window.instance.remove();
        }
        runPython(code);
    }

    this.runTests = function(codeToCheck, consoleOutput, jsonFile) {
        pyodide.globals.set("code_to_check", codeToCheck)
        pyodide.globals.set("console_output", consoleOutput)
        pyodide.globals.set("json_file", jsonFile)
        runPython(preBuiltCode.testingCode);
    }

    function runPython(code) {
        // Add some try catch here to catch any errors
        pyodide.runPython(code);
    }

    this.setGameType = function(gameType) {
        gameCode = gameMapper[gameType][0];
    }
    this.getFunctionSignatureForGame = function(gameType) {
        return gameMapper[gameType][1];
    }
    this.setDefault = function() {
        gameCode = "";
    }
}

export default GraphicPyodide;