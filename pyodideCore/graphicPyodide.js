import {preBuiltCode} from "./boilerplate.js";

// Put these code snippets as part of the preBuiltCode
const importCode = `
import sys, code
from js import p5, window, document
print(sys.version)
`
const enableOutputCode = `
# Redirect output stream
def write(data):
    output_box = document.getElementById('output')
    output_box.value += str(data)
sys.stdout.write = sys.stderr.write = write
`;
const disableOutputCode = `
def write(data):
    pass
sys.stdout.write = sys.stderr.write = write
`
const defineNamespaceCode = `
# Define the default namespace
default_ns = globals().copy()
`;

function GraphicPyodide() {
    let pyodide;
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

    this.setup = async function() {
          // Load pyodide
        const config = {
            indexURL : "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
            fullStdLib: false
        }
        pyodide = await loadPyodide(config);
        await pyodide;
        // await window.pyodide.loadPackage("micropip");
        // const micropip = window.pyodide.runPython("import micropip; micropip");
        // await micropip.install('friendly_traceback');
        runInitialCode();
    }
    function runInitialCode() {
        let code = [
            importCode,
            enableOutputCode,
            preBuiltCode.placeholderCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
            preBuiltCode.graphicPackageCode,
            defineNamespaceCode
        ].join('\n');
        pyodide.runPython(code);
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
        // let trialPassed = runTrial(userCode);
        // if (trialPassed) {
            runUserCode(userCode);
        // }
    }

    function runTrial(userCode) {
        // Run the user's code for 30 frames and see if an error occurs
        // Maybe wait 30 frames before running the tests instead
        let code = [
            disableOutputCode,
            preBuiltCode.clearNamespaceCode,
            preBuiltCode.placeholderCode,
            userCode,
            gameCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
        ].join('\n');
        resetWindow();
        try {
            pyodide.runPython(code);
            pyodide.runPython('noLoop()\nredraw(30)');
            return true;
        } catch(e) {
            let formattedError = formatError(String(e), userCode);
            outputToConsole(formattedError, true);
            return false;
        }
    }

    function runUserCode(userCode) {
        let code = [
            enableOutputCode,
            preBuiltCode.clearNamespaceCode,
            preBuiltCode.placeholderCode,
            userCode,
            gameCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
        ].join('\n');
        resetWindow();
        try {
            pyodide.runPython(code);
        } catch(e) {
            let formattedError = formatError(String(e), userCode);
            outputToConsole(formattedError, true);
        }
    }

    function formatError(traceback, userCode) {
        console.log(traceback);
        const pattern = /File "<exec>".*/s;
        const match = traceback.match(pattern)[0];

        const tracebackLines = match.split("\n");
        tracebackLines.pop();
        let errorLine = tracebackLines.pop();

        const userCodeLines = userCode.split("\n");
        const userCodeOffset = 50;

        let output = "*** Traceback ***\n";
        let linePattern = /line (\d+)/;
        for (let i = 0; i < tracebackLines.length; i ++) {
            let tracebackLine = tracebackLines[i];
            console.log("new line");
            console.log(tracebackLine);
            if (linePattern.test(tracebackLine)) {
                let lineNumber = parseInt(tracebackLine.match(linePattern)[1], 10) - userCodeOffset;
                output += "line "+lineNumber+":\n";
                output += "\t"+userCodeLines[lineNumber-1].trim()+"\n";
            }
        }
        output += errorLine+"\n";
        return output
    }

    function outputToConsole(text, errorOccurred) {
        let outputBox = document.getElementById('output')
        if (errorOccurred) {
            let colouredText = `<span style="color: red;">${text}</span>`;
            outputBox.value += text;
        } else {
            outputBox.value += text;
        }
    }

    function resetWindow() {
        if (window.instance) {
            window.instance.remove();
        }
        if (window.instance) {
            window.instance.remove();
        }
    }

    this.runTests = function(codeToCheck, consoleOutput, jsonFile) {
        pyodide.globals.set("code_to_check", codeToCheck)
        pyodide.globals.set("console_output", consoleOutput)
        pyodide.globals.set("json_file", jsonFile)
        return pyodide.runPython(preBuiltCode.testingCode).toJs();
    }

    this.setGameType = function(gameType) {
        gameCode = gameMapper[gameType][0];
    }
    this.setDefault = function() {
        gameCode = "";
    }
    this.getFunctionSignatureForGame = function(gameType) {
        return gameMapper[gameType][1];
    }
}

export default GraphicPyodide;