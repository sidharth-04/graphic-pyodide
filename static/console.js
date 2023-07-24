function Console(outputElementID) {
    let outputBox = document.getElementById(outputElementID);
    let enabled = false;
  
    this.enable = function() {
      enabled = true;
    }
    this.disable = function() {
      enabled = false;
    }
  
    this.addToConsole = function(msg) {
      if (!enabled) {
        return;
      }
      outputBox.value += msg+"\n";
      updated();
    }
  
    this.addCommand = function(cmd) {
      outputBox.value += "=> "+cmd+"\n";
      updated();
    }
  
    function updated() {
      outputBox.scrollTop = outputBox.scrollHeight;
    }
  
    this.fetchOutput = function() {
      return outputBox.value;
    }
  
    this.clear = function() {
      outputBox.value = "";
    }
}
export default Console;