import {preBuiltCode} from "./boilerplate.js";

// Put these code snippets as part of the preBuiltCode
const importCode = `
import traceback
from js import p5, window, log_error_to_console, initiate_worker_timer, cancel_worker_timer
`
const interruptExecutionMessage = "The program was interrupted";
const timeoutMessage = "The program took too long to run";
const defineExceptions = `
import signal

def input(*args, **kwargs):
    raise Exception('The input function is disabled in graphic mode')

def custom_interrupt_handler(signum, frame):
    raise Exception('${interruptExecutionMessage}')

def custom_timeout_handler(signum, frame):
    raise Exception('${timeoutMessage}')

signal.signal(signal.SIGINT, custom_interrupt_handler)
signal.signal(3, custom_timeout_handler)
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
    let interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
    let programCompletedCallback = () => {};

    const timerWorker = new Worker(new URL('timerWorker.js', import.meta.url));

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
        timerWorker.postMessage({cmd: "SET_BUFFER", interruptBuffer});
        defineUtilityFunctions();
        runInitialCode();
        consoleElement.enable();
    }

    function defineUtilityFunctions() {
        window.log_error_to_console = function(error) {
            handleError(error);
        }
        window.initiate_worker_timer = function(timeLimit=3000) {
            timerWorker.postMessage({cmd: "INITIATE_TIMER", timeLimit});
        }
        window.cancel_worker_timer = function() {
            timerWorker.postMessage({cmd: "CANCEL_TIMER"});
        }
    }
    function initiate_initialization_timer(timeLimit=3000) {
        timerWorker.postMessage({cmd: "INITIATE_INITIALIZATION_TIMER", timeLimit});
    }
    function cancel_initialization_timer() {
        timerWorker.postMessage({cmd: "CANCEL_INITIALIZATION_TIMER"});
    }

    function runInitialCode() {
        let code = [
            importCode,
            defineExceptions,
            preBuiltCode.placeholderCode,
            preBuiltCode.wrapperCode,
            defineNamespaceCode
        ].join('\n');
        pyodide.runPython(code);
        setDefaultNamespace();
    }
    function setDefaultNamespace() {
        let globalsMap = pyodide.globals.get("default_ns").toJs();
        defaultNamespace = Array.from(globalsMap.keys());
    }

    this.setProgramCompletedCallback = function(callback) {
        programCompletedCallback = callback;
    }

    this.runCode = function(code) {
        userCode = code;
        runUserCode();
        console.log('***ran code***');
    }

    function runUserCode() {
        // Disable run while program is running
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
            initiate_initialization_timer();
            pyodide.runPython(code);
            cancel_initialization_timer();
        } catch(error) {
            cancel_initialization_timer();
            handleError(error);
        }
    }

    function handleError(err) {
        programCompletedCallback(true);
        let formattedError = formatError(String(err));
        outputToConsole(formattedError, true);
        resetWindow();
    }

    function formatError(traceback) {
        const pattern = /File "<exec>".*/s;
        const match = traceback.match(pattern)[0];

        const tracebackLines = match.split("\n");
        tracebackLines.pop();
        let errorLine = tracebackLines.pop();
        let skipTraceback = false;
        if (errorLine.startsWith('Exception: '+interruptExecutionMessage) || errorLine.startsWith('Exception: '+timeoutMessage)) {
            skipTraceback = true;
        }

        const userCodeLines = userCode.split("\n");
        const userCodeOffset = 43;

        let output = "*** Traceback ***\n";
        let linePattern = /line (\d+)/;
        for (let i = 0; i < tracebackLines.length; i ++) {
            if (skipTraceback) break;
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