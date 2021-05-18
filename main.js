var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var hostingButton = document.getElementById("hosting");
var myConn = null;

var text = 15;

document.getElementById("messages").disabled = true;

var isHosting = function () {
  console.log(document.getElementById('lname').value, "is hosting");
  var peer = new Peer(document.getElementById('lname').value);
  peer.on('connection', function (conn) {
    document.getElementById("messages").disabled = false;
    myConn = conn;
    conn.on('data', function (data) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#808080";
      ctx.fillText(data, 300, text);
            text += 20;
    });
  });
};
hostingButton.addEventListener("click", isHosting);

var joiningButton = document.getElementById("joining");
var isJoining = function () {
  console.log(document.getElementById('lname').value, "is joining");

  var peer = new Peer();
  peer.on("open", function () {
    var conn = peer.connect(document.getElementById('lname').value); conn.on('open', function () {
      document.getElementById("messages").disabled = false;
      myConn = conn;
      myConn.on('data', function (data) {
        ctx.font = "20px Arial";
        
        ctx.fillStjyle = "#808080";
        ctx.fillText(data, 300, text);
              text += 20;

      })
    })
  });
};
joiningButton.addEventListener("click", isJoining);

var chattingButton = document.getElementById("messages");
var chatting = function () {
  myConn.send(document.getElementById('message').value);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0000ff";
  ctx.fillText(document.getElementById('message').value, 5, text);
  document.getElementById('message').value = '';
        text += 20;

};


var input = document.getElementById("message");

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("messages").click();
  }
});

chattingButton.addEventListener("click", chatting);
