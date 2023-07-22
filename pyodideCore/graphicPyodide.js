import {preBuiltCode} from "./boilerplate.js";

// Put these code snippets as part of the preBuiltCode
const importCode = `
import sys, code, traceback
from js import p5, window, document, log_error_to_console
print(sys.version)
`
const setInput = `
def input(*args, **kwargs):
    raise Exception('The input function is disabled in graphic mode')
`;
const interruptExecutionMessage = "The program was interrupted";
const setInterrupt = `
import signal

def custom_interrupt_handler(signum, frame):
    raise Exception('${interruptExecutionMessage}')

signal.signal(signal.SIGINT, custom_interrupt_handler)
`
const defineNamespaceCode = `
# Define the default namespace
default_ns = globals().copy()
`;

function GraphicPyodide(consoleObj) {
    let pyodide;
    let gameCode = "";
    let userCode = "";
    let defaultNamespace = {};
    let consoleElement = consoleObj;
    let interruptBuffer = new Uint8Array(new ArrayBuffer(1));
    let onErrorCallback = () => {};

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
        window.log_error_to_console = function(error) {
            handleError(error);
        }
        let code = [
            importCode,
            setInput,
            setInterrupt,
            preBuiltCode.placeholderCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode,
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

    this.setOnErrorCallback = function(callback) {
        onErrorCallback = callback;
    }

    this.runCode = function(code) {
        userCode = code;
        let errorOccurred = runUserCode();
        return errorOccurred;
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
            handleError(error)
            return true;
        }
    }

    function handleError(err) {
        let formattedError = formatError(String(err));
        outputToConsole(formattedError, true);
        onErrorCallback();
        resetWindow();
    }

    function formatError(traceback) {
        console.log(traceback);
        const pattern = /File "<exec>".*/s;
        const match = traceback.match(pattern)[0];

        const tracebackLines = match.split("\n");
        tracebackLines.pop();
        let errorLine = tracebackLines.pop();
        let interruptExecutionError = false;
        if (errorLine.startsWith('Exception: '+interruptExecutionMessage)) {
            interruptExecutionError = true;
        }

        const userCodeLines = userCode.split("\n");
        const userCodeOffset = 43;

        let output = "*** Traceback ***\n";
        let linePattern = /line (\d+)/;
        for (let i = 0; i < tracebackLines.length; i ++) {
            if (interruptExecutionError) break;
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
        document.getElementById("sketch-holder").innerHTML = "";
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