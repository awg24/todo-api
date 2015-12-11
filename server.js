var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

app.get("/", function(req,res){
	res.send("todo is up");
});

app.listen.(PORT, function(){
	console.log("express is listening on "+PORT);
});