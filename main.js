var db = new Dexie('myDatabase');
db.version(1).stores({
  myTable: '++id, data',
});

// Variables
var codeEditor = document.querySelector("#codeEditor");
var runButton = document.querySelector('#run');
var addButton = document.querySelector('#addtestcase');
var slider = document.getElementById('timelapseSlider');
var clearButton = document.getElementById('clearHistory');
var codeHistory = [];
var editor;

// Functions
function initializeEditor() {
  editor = CodeMirror.fromTextArea(codeEditor, {
    mode: "javascript",
    lineNumbers: true
  });
}

function run() {
  var code = editor.getValue();
  try {
    var runCode = new Function("input", "console", code);
    var result = "";
    var console = {
      log: function () {
        for (let i = 0; i < arguments.length; i++) {
          result += arguments[i];
          if (i != arguments.length - 1) {
            result += ' ';
          }
        }
      }
    };
    var inputContainers = document.getElementsByClassName("input-container");
    var outputContainers = document.getElementsByClassName("output-container");
    var expectedContainers = document.getElementsByClassName("expected-container");

    for (var i = 0; i < inputContainers.length; i++) {
      var inputValue = inputContainers[i].getElementsByTagName("textarea")[0].value;
      var temp = expectedContainers[i].getElementsByTagName("textarea")[0];
      var all = document.getElementsByClassName("all-container")[i];

      result = "";
      runCode(inputValue, console);
      var outputTextarea = outputContainers[i].getElementsByTagName("textarea")[0];
      outputTextarea.value = result;
      if (result.trim() == temp.value.trim()) {
        all.classList.remove('bg-danger');
        all.classList.add('bg-success');
      } else {
        all.classList.remove('bg-success');
        all.classList.add('bg-danger');
      }
    }
    codeHistory.push(editor.getValue());
    slider.setAttribute('max', codeHistory.length);
    slider.value = codeHistory.length;
  } catch (error) {
    var outputContainers = document.getElementsByClassName("output-container");
    for (var i = 0; i < outputContainers.length; i++) {
      outputContainers[i].getElementsByTagName("textarea")[0].value = error.message;
    }
  }
}

function addTestCase() {
  var allContainer = document.createElement('div');
  allContainer.classList.add("all-container");
  var inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container", "position-relative", "p-2");
  var outputContainer = document.createElement('div');
  outputContainer.classList.add("output-container", "p-2");
  var expectedContainer = document.createElement("div");
  expectedContainer.classList.add("expected-container", "border-bottom", "border-5", "border-dark", "p-2");

  var newInput = document.createElement("textarea");
  newInput.classList.add("form-control");
  newInput.placeholder = "Input Goes Here";

  var newOutput = document.createElement("textarea");
  newOutput.classList.add("form-control");
  newOutput.placeholder = "Output Is Here";

  var newExpected = document.createElement("textarea");
  newExpected.classList.add("form-control");
  newExpected.placeholder = "Put Expected Answer Here";

  var newIcon = document.createElement("i");
  newIcon.classList.add("newIcon", "position-absolute", "top-0", "end-0");
  newIcon.innerHTML = "🗙";

  inputContainer.appendChild(newInput);
  inputContainer.appendChild(newIcon);
  outputContainer.appendChild(newOutput);
  expectedContainer.appendChild(newExpected);

  allContainer.appendChild(inputContainer);
  allContainer.appendChild(outputContainer);
  allContainer.appendChild(expectedContainer);

  newIcon.addEventListener("click", () => allContainer.remove());

  var inputOutput = document.getElementById('inputOutput');

  inputOutput.appendChild(allContainer);
}

function saveEditorState() {
  var editorValue = editor.getValue();
  localStorage.setItem('editorValue', editorValue);
}

function loadEditorState() {
  var editorValue = localStorage.getItem('editorValue');
  editor.setValue(editorValue);
}

function saveTestCases() {
  const testCases = [...document.querySelectorAll('.all-container')].map(container => ({
    input: container.querySelector('.input-container textarea').value,
    output: container.querySelector('.output-container textarea').value,
    expected: container.querySelector('.expected-container textarea').value,
  }));

  localStorage.setItem('testCases', JSON.stringify(testCases));
}

function loadTestCases() {
  var testCases = JSON.parse(localStorage.getItem('testCases'));
  for (var i = 0; i < testCases.length; i++) {
    var testCase = testCases[i];

    var allContainer = document.createElement('div');
    allContainer.classList.add("all-container");
    var inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container", "position-relative", "p-2");
    var outputContainer = document.createElement('div');
    outputContainer.classList.add("output-container", "p-2");
    var expectedContainer = document.createElement("div");
    expectedContainer.classList.add("expected-container", "border-bottom", "border-5", "border-dark", "p-2");

    var newInput = document.createElement("textarea");
    newInput.classList.add("form-control");
    newInput.placeholder = "Input Goes Here";
    newInput.value = testCase.input;

    var newOutput = document.createElement("textarea");
    newOutput.classList.add("form-control");
    newOutput.placeholder = "Output Is Here";
    newOutput.value = testCase.output;

    var newExpected = document.createElement("textarea");
    newExpected.classList.add("form-control");
    newExpected.placeholder = "Put Expected Answer Here";
    newExpected.value = testCase.expected;

    var newIcon = document.createElement("i");
    newIcon.classList.add("newIcon", "position-absolute", "top-0", "end-0");
    newIcon.innerHTML = "🗙";

    inputContainer.appendChild(newInput);
    inputContainer.appendChild(newIcon);
    outputContainer.appendChild(newOutput);
    expectedContainer.appendChild(newExpected);

    allContainer.appendChild(inputContainer);
    allContainer.appendChild(outputContainer);
    allContainer.appendChild(expectedContainer);

    newIcon.addEventListener("click", () => allContainer.remove());

    var inputOutput = document.getElementById('inputOutput');
    inputOutput.appendChild(allContainer);
  }
}

function setCodeVersion() {
  editor.setValue(codeHistory[slider.value - 1]);
  if (slider.value == codeHistory.length) {
    editor.setOption("readOnly", false);
  } else {
    editor.setOption("readOnly", true);
  }
}

function clearCodeHistory() {
  codeHistory.length = 0;
  slider.setAttribute('max', 0);
}

function saveCodeHistory() {
  db.myTable.put({ data: codeHistory });
  console.log(db.myTable);
}

function setSavedCodeHistory() {
  db.myTable.toArray().then((result) => {
    const retrievedArray = result;
    codeHistory = retrievedArray;
    runButton.innerHTML = result;
    console.log(result);
  });
}

// Call the functions when buttons are pressed
runButton.addEventListener('click', () => run());
addButton.addEventListener('click', () => addTestCase());

// Call the functions when the page loads/unloads
window.addEventListener('load', initializeEditor);
window.addEventListener('unload', saveEditorState);
window.addEventListener('load', loadEditorState);
window.addEventListener('unload', saveTestCases);
window.addEventListener('load', loadTestCases);

// Time Lapse slider
slider.addEventListener('input', setCodeVersion);
runButton.addEventListener('click', saveCodeHistory);
runButton.addEventListener('click', setSavedCodeHistory);

// Clear code history
clearButton.addEventListener('click', () => clearCodeHistory());

