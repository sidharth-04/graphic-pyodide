import preBuiltCode from "./boilerplate.js";
import TimerHandler from "./timerHandler.js";

// Put these code snippets as part of the preBuiltCode
const inputDisabledMessage = "The input function is disabled in graphic mode";
const interruptExecutionMessage = "The program was interrupted";
const timeoutMessage = "The program took too long to run";
const defineExceptions = `
def input(*args, **kwargs):
    raise Exception('${inputDisabledMessage}')

def custom_interrupt_handler(signum, frame):
    raise Exception('${interruptExecutionMessage}')

def custom_timeout_handler(signum, frame):
    raise Exception('${timeoutMessage}')

signal.signal(2, custom_interrupt_handler)
signal.signal(3, custom_timeout_handler)
`

function GraphicPyodide(consoleObj) {
    let pyodide;
    let gameType = "default";
    let userCode = "";
    let consoleElement = consoleObj;
    let currentProgramConsoleOutput = "";
    let interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
    let checkForInterruptInterval = null;
    let onErrorCallback = () => {};
    let timerHandler;

    const gameMapper = {
        "clicker": [preBuiltCode.graphicClickerCode, 'change_colour(colour)', 'Clicker'],
        "bouncer": [preBuiltCode.graphicBouncerCode, 'at_edge(x)', 'Bouncer'],
        "growingsun": [preBuiltCode.graphicGrowingsunCode, 'get_new_size(size)', 'GrowingSun'],
        "speedball": [preBuiltCode.graphicSpeedballCode, 'get_new_speed(speed)', 'SpeedBall'],
        "rockboat": [preBuiltCode.graphicRockboatCode, 'change_direction(angle)', 'RockBoat'],
    }

    this.setup = async function() {
        timerHandler = new TimerHandler();
        timerHandler.initialize(interruptBuffer);
        const config = {
            stdout: (output) => {
                currentProgramConsoleOutput += output+"\n";
                outputToConsole(output, false);
            }
        }
        pyodide = await loadPyodide(config);
        await pyodide;
        pyodide.setInterruptBuffer(interruptBuffer);
        runInitialCode();
        consoleElement.enable();
    }

    function runInitialCode() {
        window.log_error_to_console = function(error) {
            handleError(error);
        }
        let code = buildCode(
            preBuiltCode.importCode,
            defineExceptions,
            preBuiltCode.placeholderCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.defineNamespaceCode
        );
        pyodide.runPython(code);
    }

    this.setOnErrorCallback = function(callback) {
        onErrorCallback = callback;
    }

    this.evaluateConsoleCode = function(codeLine) {
        try {
            timerHandler.initiateInitializationTimer();
            let programOutput = pyodide.runPython(codeLine);
            timerHandler.cancelInitializationTimer();
            if (programOutput !== undefined) outputToConsole(programOutput, false);
        } catch(error) {
            timerHandler.cancelInitializationTimer();
            let formattedError = formatError(String(error), true);
            outputToConsole(formattedError, true);
        }
    }

    this.runCode = function(code) {
        userCode = code;
        currentProgramConsoleOutput = "";
        interruptBuffer[0] = 0;
        resetWindow();
        let initializeCode = buildCode(
            preBuiltCode.clearNamespaceCode,
            preBuiltCode.placeholderCode,
        )
        let gameCode = "";
        if (gameType != "default") {
            gameCode = gameMapper[gameType][0];
            outputToConsole(`<< ${gameMapper[gameType][2]} Game Loaded >>`, false);
        }
        let mainCode = buildCode(
            userCode,
            gameCode,
            preBuiltCode.wrapperCode,
            preBuiltCode.startCode
        )
        try {
            pyodide.runPython(initializeCode);
            timerHandler.initiateInitializationTimer();
            setCheckForInterruptInterval();
            pyodide.runPython(mainCode);
            timerHandler.cancelInitializationTimer();
        } catch(error) {
            timerHandler.cancelInitializationTimer();
            handleError(error);
        }
    }

    function setCheckForInterruptInterval() {
        if (checkForInterruptInterval != null) return;
        checkForInterruptInterval = setInterval(() => {
            if (interruptBuffer[0] == 2) {
                interruptBuffer[0] = 0;
                pyodide.runPython(`
                try:
                    raise Exception('${interruptExecutionMessage}')
                except:
                    cancel_worker_timer()
                    traceback_str = traceback.format_exc()
                    log_error_to_console(traceback_str)
                `);
            }
        }, 500);
    }
    function clearCheckForInterruptInterval() {
        clearInterval(checkForInterruptInterval);
        checkForInterruptInterval = null;
    }

    function handleError(err) {
        console.log(currentProgramConsoleOutput);
        resetWindow();
        clearCheckForInterruptInterval();
        let formattedError = formatError(String(err), false);
        let errList = formattedError.split('\n');
        onErrorCallback(errList[errList.length-1]);
        outputToConsole(formattedError, true);
    }

    function formatError(traceback, consoleMode) {
        console.log(traceback);
        const pattern = /File "<exec>".*/s;
        const match = traceback.match(pattern)[0];

        const tracebackLines = match.split("\n");
        tracebackLines.pop();
        let errorLine = tracebackLines.pop();

        let skipTraceback = false;
        if (errorLine.startsWith('Exception: '+interruptExecutionMessage) || errorLine.startsWith('Exception: '+timeoutMessage)) {
            skipTraceback = true;
        }
        let skipLastLine = false;
        if (errorLine.startsWith('Exception: '+inputDisabledMessage)) {
            skipLastLine = true;
        }

        const userCodeLines = userCode.split("\n");

        let output = "";
        let linePattern = /line (\d+)/;
        for (let i = 0; i < tracebackLines.length; i ++) {
            if (skipTraceback || consoleMode) break;
            if (i == tracebackLines.length-1 && skipLastLine) break;
            let tracebackLine = tracebackLines[i];
            if (linePattern.test(tracebackLine)) {
                let lineNumber = parseInt(tracebackLine.match(linePattern)[1], 10);
                if (lineNumber >= 1 && lineNumber <= userCodeLines.length) {
                    output += "line "+lineNumber+":\n";
                    output += "\t"+userCodeLines[lineNumber-1].trim()+"\n";
                }
            }
        }
        output += errorLine;
        return output
    }

    function outputToConsole(output, errorOccurred) {
        consoleElement.addMessage(output+"\n", errorOccurred);
    }

    function resetWindow() {
        if (window.instance) {
            window.instance.remove();
        }
        document.getElementById("sketch-holder").innerHTML = "";
    }

    function buildCode() {
        let result = []
        for (let i = 0; i < arguments.length; i ++) {
            result.push(arguments[i]);
        }
        return result.join('\n');
    }

    this.stopExecution = function() {
        interruptBuffer[0] = 2;
    }

    this.runTests = function(codeToCheck, jsonFile) {
        consoleElement.disable();
        timerHandler.initiateInitializationTimer();
        let testResults = getTestResults(codeToCheck, jsonFile);
        timerHandler.cancelInitializationTimer();
        consoleElement.enable();
        if (testResults[0].has("ErrorEncountered")) {
            outputToConsole("We got the following error while testing:", false);
            outputToConsole(testResults[0].get("ErrorEncountered"), true);
        }
        return testResults;
    }
    function getTestResults(codeToCheck, jsonFile) {
        let consoleOutput = currentProgramConsoleOutput;
        pyodide.globals.set("code_to_check", codeToCheck)
        pyodide.globals.set("console_output", consoleOutput)
        pyodide.globals.set("json_file", jsonFile)
        return pyodide.runPython(preBuiltCode.testingCode).toJs();
    }

    this.setGameType = function(type) {
        if (!(type in gameMapper)) return;
        gameType = type;
    }
    this.setDefaultGameType = function() {
        gameType = "default";
    }
    this.getFunctionSignatureForGame = function() {
        return gameMapper[gameType][1];
    }
    this.clearNamespace = function() {
        pyodide.runPython(preBuiltCode.clearNamespaceCode);
    }
}

export default GraphicPyodide;