var hostingButton = document.getElementById("hosting");
var myConn = null;

document.getElementById("messages").disabled = true;

var previousMessageAuthor = "";
var isHosting = function () {
  console.log(document.getElementById('lname').value, "is hosting");
  var peer = new Peer(document.getElementById('lname').value);
  peer.on('connection', function (conn) {
    document.getElementById("messages").disabled = false;
    myConn = conn;
    myConn.on('data', function (data) {
      if (previousMessageAuthor == "me" || previousMessageAuthor == "") {
        var iDiv = document.createElement('div');
        iDiv.id = 'block';
        iDiv.className = 'him';
        iDiv.innerHTML = "HIM";
        document.getElementById('border').appendChild(iDiv);
      }
      var iDiv = document.createElement('div');
      iDiv.id = 'block';
      iDiv.className = 'messageIn';
      iDiv.innerHTML = data;
      document.getElementById('border').appendChild(iDiv);        previousMessageAuthor = "him";
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
        if (previousMessageAuthor == "me" || previousMessageAuthor == "") {
          var iDiv = document.createElement('div');
          iDiv.id = 'block';
          iDiv.className = 'him';
          iDiv.innerHTML = "HIM";
          document.getElementById('border').appendChild(iDiv);
        }
        var iDiv = document.createElement('div');
        iDiv.id = 'block';
        iDiv.className = 'messageIn';
        iDiv.innerHTML = data;
        document.getElementById('border').appendChild(iDiv);
        previousMessageAuthor = "him";
      })
    })
  });
};
joiningButton.addEventListener("click", isJoining);

var chattingButton = document.getElementById("messages");
var chatting = function () {
   previousMessageAuthor
  if (previousMessageAuthor == "him" || previousMessageAuthor == "") {
    var iDiv = document.createElement('div');
    iDiv.id = 'block';
    iDiv.className = 'me';
    iDiv.innerHTML = "ME";
    document.getElementById('border').appendChild(iDiv);
  }
  myConn.send(document.getElementById('message').value);
  var iDiv = document.createElement('div');
  iDiv.id = 'block';
  iDiv.className = 'messageOut';
  iDiv.innerHTML = document.getElementById('message').value;
  document.getElementById('border').appendChild(iDiv);
  document.getElementById('message').value = '';
  previousMessageAuthor = "me";
};

var input = document.getElementById("message");

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("messages").click();
  }
})
chattingButton.addEventListener("click", chatting);

