var handleMessage = function () {
  myConn.on('data', function (data) {
    if(data.type == 'sendMessage'){
      if(previousMessageAuthor != 'him'){
        addDivToBorder('him', peerUsername, '');
        previousMessageAuthor = 'him';
      }
      addDivToBorder('messageIn', data.message, lastId); 
      lastId += 1;
    }else if(data.type == 'setUsername'){
      peerUsername = data.username;
    }else if(data.type == 'updateMessage'){
      document.getElementById(data.msgId).innerHTML = data.text;
    }
  })
}
var lastId = 0;
var editingId = -1;
var addDivToBorder = function (className, text, id) {
  var iDiv = document.createElement('div');
  iDiv.id = id;
  iDiv.className = className;
  iDiv.innerHTML = text;
  var tmpLastId = lastId;
  if(className != 'me'){
  iDiv.addEventListener("click", function() {
    editingId = tmpLastId;
    document.getElementById("message").placeholder = "Editing text";
    document.getElementById('messages').innerHTML = 'EDIT';
    document.getElementById(editingId).style.color = "red";
    iDiv.addEventListener("dblclick", function() {
      document.getElementById(editingId).style.color = "blue";
    })
  });
  }
  document.getElementById('border').appendChild(iDiv);
}

var peerUsername = "Him";
var msgInput = document.getElementById("message");
var sendButton = document.getElementById("messages");
var channelInput = document.getElementById('lname');
var myConn = null;

sendButton.disabled = true;
var previousMessageAuthor = "";

var hostingButton = document.getElementById("hosting");
var isHosting = function () {
  console.log(channelInput.value, "is hosting");
  var peer = new Peer(channelInput.value);
  peer.on('connection', function (conn) {
    sendButton.disabled = false;
    myConn = conn;
    myConn.on('open', function () {
      myConn.send({ "type": "setUsername", "username": username.value });
    }) 
    handleMessage();

  });
};
hostingButton.addEventListener("click", isHosting);

var joiningButton = document.getElementById("joining");
var isJoining = function () {
  console.log(channelInput.value, "is joining");
  var peer = new Peer();
  peer.on("open", function () {
    var conn = peer.connect(channelInput.value);
    sendButton.disabled = false;
    myConn = conn;
    myConn.on('open', function () {
      myConn.send({ "type": "setUsername", "username": username.value });
      handleMessage();
    })
  });
};
joiningButton.addEventListener("click", isJoining);

var isSending = function(){
  document.getElementById("message").placeholder = "Enter text";
  document.getElementById('messages').innerHTML = 'SEND';
  if(editingId < 0){
    if(previousMessageAuthor != "me"){
      addDivToBorder("me", username.value, '');
    }
    myConn.send({'type': 'sendMessage', 'message': msgInput.value});
    addDivToBorder("messageOut", msgInput.value, lastId);
    lastId += 1;
    msgInput.value = '';
    previousMessageAuthor = "me";
  }else{
    myConn.send({'type': 'updateMessage', 'text': msgInput.value, 'msgId': editingId});
    document.getElementById(editingId).
    innerHTML = msgInput.value;
    if(msgInput.value == ''){
      document.getElementById(editingId).style.fontFamily = "cursive";
      document.getElementById(editingId).innerHTML = 'Deleted Message';
    }
    msgInput.value = '';
    editingId = -1;
  }
}
sendButton.addEventListener("click", isSending);

msgInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("messages").click();
  }
  if(editingId != -1){
    document.getElementById(editingId).style.color = "blue";
  }
})
function updateScroll(){
    var element = document.getElementById("border");
    element.scrollTop = element.scrollHeight;
}
setInterval(updateScroll,1);

