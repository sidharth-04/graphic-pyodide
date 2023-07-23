self.interruptBuffer = null;
self.initializationTimer = null;
self.timer = null;

self.onmessage = function(event) {
    switch(event.data.cmd) {
        case "SET_BUFFER":
            setBuffer(event.data.interruptBuffer);
            break;
        case "INITIATE_INITIALIZATION_TIMER":
            initiateInitializationTimer(event.data.timeLimit)
            break;
        case "CANCEL_INITIALIZATION_TIMER":
            cancelInitializationTimer()
            break;
        case "INITIATE_TIMER":
            initiateTimer(event.data.timeLimit)
            break;
        case "CANCEL_TIMER":
            cancelTimer();
            break;
    }
}

function setBuffer(buffer) {
    self.interruptBuffer = buffer;
}

function initiateInitializationTimer(timeLimit) {
    self.initializationTimer = setTimeout(killProgram, timeLimit);
}
function cancelInitializationTimer() {
    clearTimeout(self.initializationTimer);
    self.initializationTimer = null;
}

function initiateTimer(timeLimit) {
    if (self.timer != null) {
        return;
    }
    self.timer = setTimeout(killProgram, timeLimit);
}
function cancelTimer() {
    clearTimeout(self.timer);
    self.timer = null;
}

function killProgram() {
    self.interruptBuffer[0] = 3;
}