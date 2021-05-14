var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var hostingButton = document.getElementById("hosting");
var myConn = null;

var text = 15;

var isHosting = function () {
    console.log(document.getElementById('lname').value, "is hosting");
    var peer = new Peer(document.getElementById('lname').value);
    peer.on('connection', function (conn) {
        myConn = conn;
        conn.on('data', function (data) {
          text += 20; 
          ctx.font = "20px Arial";
          ctx.fillText(data, 300, text);
          
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
            myConn = conn;
        })
    });
};
joiningButton.addEventListener("click", isJoining);

var chattingButton = document.getElementById("messages");
var chatting = function () {
    myConn.send(document.getElementById('message').value);
    ctx.font = "20px Arial";
    ctx.fillText(document.getElementById('message').value, 5, text);
    text += 20;
};
chattingButton.addEventListener("click", chatting);


/*window.addEventListener('keydown', this.check, false);
window.setInterval(this.everySecond, 1);
const context = canvas.getContext('2d');
var carX = 0;
var carY = 0;
var speedX = 0;
var speedY = 0;
var drawCar = function (x, y) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillRect(30 + x, 0 + y, 70, 10);
    ctx.fillRect(20 + x, 10 + y, 10, 10);
    ctx.fillRect(10 + x, 20 + y, 10, 30);
    ctx.fillRect(20 + x, 50 + y, 20, 10);
    ctx.fillRect(40 + x, 40 + y, 10, 10);
    ctx.fillRect(40 + x, 60 + y, 10, 10);
    ctx.fillRect(50 + x, 50 + y, 50, 10);
    ctx.fillRect(100 + x, 40 + y, 10, 10);
    ctx.fillRect(100 + x, 60 + y, 10, 10);
    ctx.fillRect(110 + x, 50 + y, 40, 10);
    ctx.fillRect(150 + x, 30 + y, 10, 20);
    ctx.fillRect(110 + x, 20 + y, 40, 10);
    ctx.fillRect(100 + x, 10 + y, 10, 10);
    ctx.fillRect(30 + x, 0 + y, 10, 10);
}
function check(e) {
    var code = e.keyCode;
    switch (code) {
        case 39:
            if (speedX > 0) {
                        speedX = +speedX;
            }
            else {
                        speedX += 1;
            }
            break;
        case 37:
            if (speedX < 0) {
                        speedX = -speedX;
            }
            else {
                        speedX -= 1;
            }
            break;
        case 40:
        if (speedY < 0) {
                        speedY = +speedY;
            }
            else {
                        speedY += 1;
            }
            break;
        case 38:
        if (speedY > 0) {
                        speedY = -speedY;
            }
            else {
                        speedY -= 1;
            }
            break;
        case 32: carX = 0, carY = 0;
    }

    //console.log("speedX is", speedX, "speedY is", speedY, "coords:", carX, carY);
    //console.log("coords", carX, carY);
    //carRight(530, 380);
}
function everySecond() {
                        context.clearRect(0, 0, canvas.width, canvas.height);
    drawCar(carX, carY);
    carX += speedX;
    carY += speedY;
};
//ctx.fillRect(left-right, 0, 10, 10);
//ctx.fillRect(0, top-down, 10, 10);
//ctx.fillRect(0, 0, left-rightsize, 10);
//ctx.fillRect(0, 0, 10, top-down size);
*/