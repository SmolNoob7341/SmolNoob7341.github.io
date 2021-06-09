u = new URL(window.location.href)
document.getElementById('lname').value = u.searchParams.get('channel');



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
    }else if(data.type == 'isTyping'){
      usernameIsTyping = peerUsername+' is typing...';
      document.getElementById('span').innerHTML = usernameIsTyping;
    }else if(data.type == 'isntTyping'){
      document.getElementById('span').innerHTML = '';
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
  if(className == 'messageOut') {
    iDiv.addEventListener("click", function() {
      if(editingId != -1){
       document.getElementById(editingId).style.color = 'blue';
     }
      editingId = tmpLastId;
      document.getElementById("message").placeholder = "Editing text";
      document.getElementById('messages').innerHTML = 'EDIT';
      document.getElementById(editingId).style.color = "red";
      msgInput.value = document.getElementById(editingId).innerHTML;
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
msgInput.disabled = true;
var previousMessageAuthor = "";

var hostingButton = document.getElementById("hosting");
var isHosting = function () {
  document.getElementById('status').style.color = "orange";
  console.log(channelInput.value, "is hosting");
  var peer = new Peer(channelInput.value);
  peer.on('connection', function (conn) {
    sendButton.disabled = false;
    msgInput.disabled = false;
    document.getElementById('status').style.color = 'green';
    myConn = conn;
    myConn.on('open', function () {
      myConn.send({ "type": "setUsername", "username": username.value });
      document.getElementById('status').style.color = 'green';
      myConn.on('close', function (conn) {
        sendButton.disabled = true;
        msgInput.disabled = true;
        document.getElementById('status').style.color = 'red';
      });
    }) 
    handleMessage();2

  });
};
hostingButton.addEventListener("click", isHosting);

var joiningButton = document.getElementById("joining");
var isJoining = function () {
  document.getElementById('status').style.color = "orange";
  console.log(channelInput.value, "is joining");
  var peer = new Peer();
  peer.on("open", function () {
    var conn = peer.connect(channelInput.value);
    sendButton.disabled = false;
    msgInput.disabled = false;
    document.getElementById('status').style.color = 'green';
    myConn = conn;
    myConn.on('open', function () {
      myConn.send({ "type": "setUsername", "username": username.value });
      handleMessage();
      document.getElementById('status').style.color = 'green';
      myConn.on('close', function (conn) {
        sendButton.disabled = true;
        msgInput.disabled = true;
        document.getElementById('status').style.color = 'red';
      });
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
    if(editingId != -1){
      document.getElementById(editingId).style.color = "blue";
    }
    event.preventDefault();
    document.getElementById("messages").click();
  }
})
function updateScroll(){
    var element = document.getElementById("border");
    element.scrollTop = element.scrollHeight;
}
setInterval(updateScroll,100);


var myFocus = function (){
  myConn.send({'type': 'isTyping'});
}
var notFocus = function (){
    myConn.send({'type': 'isntTyping'})
}
msgInput.addEventListener("keypress", myFocus);
sendButton.addEventListener("click", notFocus);
msgInput.addEventListener("blur", notFocus);
