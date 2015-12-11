var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
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
	var matchedTodo = _.findWhere(todos,{id: todoId});

	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send("Todo Item could not be found");
	}

});

app.post("/todos", function(req,res){
	var body = req.body;
	if(!_.isBoolean(body.completed)){
		return res.status(400).send("Completed Field must be true or false");
	} else if(!_.isString(body.description)){
		return res.status(400).send("description must be a string");
	} else if(!body.description.trim()){
		return res.status(400).send("there must be text present!");
	}
	body.description = body.description.trim();
	var santizedObject = _.pick(body, "description", "completed");
	santizedObject.id = todoNextId++;
	todos.push(santizedObject);
	res.json(santizedObject);
});

app.delete("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos,{id: todoId});
	if(!matchedTodo){
		res.status(404).send({error: "Item could not be found"});
	} else {
		todos = _.without(todos, matchedTodo);
		console.log(todos);
		res.send(matchedTodo);
	}
	
});

app.listen(PORT, function(){
	console.log("express is listening on "+PORT);
});