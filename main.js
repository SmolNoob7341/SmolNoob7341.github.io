var handleMessage = function () {
  myConn.on('data', function (data) {
    if (data.type == "sendMessage") {
      if (previousMessageAuthor != "him") {
        addDivToBorder("him", peerUsername);
      }
      addDivToBorder("messageIn", data.message);
      previousMessageAuthor = "him";
    } else if (data.type == "setUsername") {
      peerUsername = data.username;
    }
  })
}
var addDivToBorder = function (className, text) {
  var iDiv = document.createElement('div');
  iDiv.id = 'block';
  iDiv.className = className;
  iDiv.innerHTML = text;
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

var sending = function(){
  if(previousMessageAuthor != "me"){
    addDivToBorder("me", username.value);
  }
  myConn.send({'type': 'sendMessage', 'message': msgInput.value});
  addDivToBorder("messageOut", msgInput.value);
  msgInput.value = '';
  previousMessageAuthor = "me";
}


msgInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("messages").click();
  }
})
sendButton.addEventListener("click", sending);

function updateScroll(){
    var element = document.getElementById("border");
    element.scrollTop = element.scrollHeight;
}
setInterval(updateScroll,1);

