var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function(req,res){
	res.send("todo is up");
});

app.get("/todos", function(req, res){
	res.json(todos);
});

app.get("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var flag = true;
	for(var i = 0; i < todos.length; i++){
		if(todos[i].id === todoId){
			flag = false;
			res.json(todos[i]);
			break;
		}
	}
	if(flag){
		res.status(404).send("Todo Item could not be found");
	}
});

app.post("/todos", function(req,res){
	var body = req.body;
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function(){
	console.log("express is listening on "+PORT);
});