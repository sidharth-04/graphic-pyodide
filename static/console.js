function Console(outputElementID) {
    let outputBox = $(`#${outputElementID}`);
    let enabled = false;
  
    this.enable = function() {
      enabled = true;
    }
    this.disable = function() {
      enabled = false;
    }
  
    this.addMessage = function(msg, error=false) {
      if (!enabled) {
        return;
      }
      msg += "\n";
      if (error) {
        let errorDiv = $('<div>').addClass('error-message');
        $('<p>').addClass('error-header').text("Traceback").appendTo(errorDiv);
        $('<p>').text(msg).appendTo(errorDiv);
        errorDiv.appendTo(outputBox);
      } else {
        $('<p>').addClass('console-text').text(msg).appendTo(outputBox);
      }
      updated();
    }
  
    this.addCommand = function(cmd) {
      let codeSnippet = $('<code>').addClass('language-python').text("=> "+cmd);
      codeSnippet.appendTo(outputBox);
      Prism.highlightElement(codeSnippet[0]);
      updated();
    }
  
    function updated() {
      outputBox.scrollTop(outputBox[0].scrollHeight);
    }
  
    this.fetchOutput = function() {
      return outputBox.value;
    }
  
    this.clear = function() {
      outputBox.empty();
    }
}
export default Console;