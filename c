<!DOCTYPE html>
<html>
<head>
 <title>Canvas</title>
</head>
<body>
<canvas id="canvas" width="200" height="200"></canvas>
 <script>
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillRect(50, 0, 10, 10); 
ctx.fillRect(40, 10, 10, 10); 
ctx.fillRect(30, 20, 10, 10); 
ctx.fillRect(20, 30, 10, 10); 
ctx.fillRect(10, 40, 10, 10); 
ctx.fillRect(10, 50, 10, 10); 
ctx.fillRect(20, 60, 10, 10); 
ctx.fillRect(30, 70, 10, 10); 
ctx.fillRect(40, 80, 10, 10); 
ctx.fillRect(50, 90, 10, 10); 
</script>
</body>
</html>
