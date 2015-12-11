var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
	{
		id: 1,
		description: "meet mom for lunch",
		completed: false
	},
	{
		id: 2,
		description: "go to market",
		completed: false
	},
	{
		id: 3,
		description: "walk the cat",
		completed: false
	}
];

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

app.listen(PORT, function(){
	console.log("express is listening on "+PORT);
});