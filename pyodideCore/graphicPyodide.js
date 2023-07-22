import {preBuiltCode} from "./boilerplate.js";

// Put these code snippets as part of the preBuiltCode
const importCode = `
import sys, code, traceback
from js import p5, window, document, log_error_to_console
print(sys.version)
`
const defineNamespaceCode = `
# Define the default namespace
default_ns = globals().copy()
`;
const setInput = `
def input():
    raise Exception('The input function is disabled in graphic mode')
`;
const setInterrupt = `
import signal

def custom_interrupt_handler(signum, frame):
    raise Exception('The program was interrupted')

signal.signal(signal.SIGINT, custom_interrupt_handler)
`

function GraphicPyodide(consoleObj) {
    let pyodide;
    let gameCode = "";
    let userCode = "";
    let defaultNamespace = {};
    let consoleElement = consoleObj;
    let interruptBuffer = new Uint8Array(new ArrayBuffer(1));

    const gameMapper = {
        "clicker": [preBuiltCode.graphicClickerCode, 'change_colour(colour)'],
        "bouncer": [preBuiltCode.graphicBouncerCode, 'at_edge(x)'],
        "growingsun": [preBuiltCode.graphicGrowingsunCode, 'get_new_size(size)'],
        "speedball": [preBuiltCode.graphicSpeedballCode, 'get_new_speed(speed)'],
        "rockboat": [preBuiltCode.graphicRockboatCode, 'change_direction(angle)'],
        "button": [preBuiltCode.graphicButtonCode, 'check_clicked(x, y, w, h)'],
    }

    this.setup = async function() {
        const config = {
            stdout: (text) => {
                consoleElement.addToConsole(text);
            }
        }
        pyodide = await loadPyodide(config);
        await pyodide;
        pyodide.setInterruptBuffer(interruptBuffer);
        // await window.pyodide.loadPackage("micropip");
        // const micropip = window.pyodide.runPython("import micropip; micropip");
        // await micropip.install('friendly_traceback');
        runInitialCode();
        consoleElement.enable();
    }
    function runInitialCode() {
        window.log_error_to_console = function(err) {
            let formattedError = formatError(String(err));
            outputToConsole(formattedError, true);
            resetWindow();
        }
        let code = [
            importCode,
            setInput,
            setInterrupt,
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
        console.log(defaultNamespace);
    }
    this.getGlobals = function() {
        return defaultNamespace;
    }

    this.runCode = function(code) {
        // let trialPassed = runTrial();
        // if (trialPassed) {
            userCode = code;
            let errorOccurred = runUserCode();
            return errorOccurred;
        // }
    }

    function runTrial() {
        // Run the user's code for 30 frames and see if an error occurs
        // Maybe wait 30 frames before running the tests instead
        consoleElement.disable();
        let code = [
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
        } catch(error) {
            let formattedError = formatError(String(error), userCode);
            outputToConsole(formattedError, true);
            return false;
        }
    }

    function runUserCode() {
        interruptBuffer[0] = 0;
        resetWindow();
        let code = [
            preBuiltCode.clearNamespaceCode,
            preBuiltCode.placeholderCode,
            userCode,
            gameCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
        ].join('\n');
        try {
            pyodide.runPython(code);
            return false;
        } catch(error) {
            let formattedError = formatError(String(error.message));
            outputToConsole(formattedError, true);
            return true;
        }
    }

    function formatError(traceback) {
        console.log(traceback);
        const pattern = /File "<exec>".*/s;
        const match = traceback.match(pattern)[0];

        const tracebackLines = match.split("\n");
        tracebackLines.pop();
        let errorLine = tracebackLines.pop();

        const userCodeLines = userCode.split("\n");
        const userCodeOffset = 43;

        let output = "*** Traceback ***\n";
        let linePattern = /line (\d+)/;
        for (let i = 0; i < tracebackLines.length; i ++) {
            let tracebackLine = tracebackLines[i];
            if (linePattern.test(tracebackLine)) {
                let lineNumber = parseInt(tracebackLine.match(linePattern)[1], 10) - userCodeOffset;
                if (lineNumber >= 1 && lineNumber <= userCodeLines.length) {
                    output += "line "+lineNumber+":\n";
                    output += "\t"+userCodeLines[lineNumber-1].trim()+"\n";
                }
            }
        }
        output += errorLine+"\n";
        return output
    }

    function outputToConsole(text, errorOccurred) {
        if (errorOccurred) {
            consoleElement.addToConsole(text);
        } else {
            consoleElement.addToConsole(text);
        }
    }

    function resetWindow() {
        if (window.instance) {
            window.instance.remove();
        }
    }

    this.stopExecution = function() {
        interruptBuffer[0] = 2;
        console.log('execution stopped!');
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