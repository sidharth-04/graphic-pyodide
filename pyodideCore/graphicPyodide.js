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

function GraphicPyodide() {
    let gameCode = "";
    let gameMapper = {
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
        window.pyodide.runPython(code);
    }

    this.runCode = function(userCode) {
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
        window.pyodide.runPython(code);
    }

    this.setGameType = function(gameType) {
        gameCode = gameMapper[gameType][0];
    }
    this.getFunctionSignatureForGame = function(gameType) {
        return gameMapper[gameType][1];
    }
}

export default GraphicPyodide;