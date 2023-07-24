function TimerHandler() {
    const timerWorker = new Worker(new URL('timerWorker.js', import.meta.url));

    this.initialize = function(interruptBuffer) {
        timerWorker.postMessage({cmd: "SET_BUFFER", interruptBuffer});
        defineUtilityFunctions();
    };

    function defineUtilityFunctions() {
        window.initiate_worker_timer = function(timeLimit=3000) {
            timerWorker.postMessage({cmd: "INITIATE_TIMER", timeLimit});
        }
        window.cancel_worker_timer = function() {
            timerWorker.postMessage({cmd: "CANCEL_TIMER"});
        }
    };

    this.initiateInitializationTimer = function(timeLimit=3000) {
        timerWorker.postMessage({cmd: "INITIATE_INITIALIZATION_TIMER", timeLimit});
    };

    this.cancelInitializationTimer = function() {
        timerWorker.postMessage({cmd: "CANCEL_INITIALIZATION_TIMER"});
    };
}

export default TimerHandler;