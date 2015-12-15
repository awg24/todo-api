var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function(req,res){
	res.send("todo is up");
});

app.get("/todos", function(req, res){
	var query = req.query;
	var where = {};
	var flag = (query.completed === "true");

	// if(!_.isEmpty(query)){
	// 	if(query.hasOwnProperty("completed") && query.hasOwnProperty("q")){
	// 		var sentinal = query.completed;
	// 		var filtered = todos.filter(function(el){
	// 			var stringed = el.completed.toString();
	// 			if(stringed === sentinal && el.description.indexOf(query.q) > -1){
	// 				return el;
	// 			}
	// 		});
	// 		res.json(filtered);
	// 	} else if(query.hasOwnProperty("completed")){
	// 		var completed = (query.completed === "true");
	// 		var completedArray = _.where(todos, {completed: completed})
	// 		res.json(completedArray);
	// 	} else if(query.hasOwnProperty("q") && query.q.length > 0){
	// 		var searched = _.filter(todos, function(el){
	// 			return el.description.indexOf(query.q) > -1;
	// 		});
	// 		res.json(searched);
	// 	}
	// } else {
	// 	res.json(todos);
	// }
	if(query.hasOwnProperty("completed") && query.hasOwnProperty("q")){
		where.completed = flag;
		where.description = {
			$like: "%"+query.q+"%"
		}
	} else if(query.hasOwnProperty("completed")){
		where.completed = flag;
	} else if(query.hasOwnProperty("q") && query.q.length > 0){
		where.description = {
			$like: "%"+query.q+"%"
		}
	}

	db.todo.findAll({where: where}).then(function(allTodos){
		if(allTodos.length > 0){
			var todos = [];
			allTodos.forEach(function(todo){
				todos.push(todo.toJSON());
			});
			res.send(todos);
		} else {
			res.send("No Todos Found");
		}
	});
});

app.get("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos,{id: todoId});

	// if(matchedTodo){
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send("Todo Item could not be found");
	// }

	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON())
		} else {
			res.status(404).send("Item Not Found, idiot")
		}
		
	}, function(e){
		res.status(500).send(e);
	});

});

app.post("/todos", function(req,res){
	var body = req.body;
	// if(!_.isBoolean(body.completed)){
	// 	return res.status(400).send("Completed Field must be true or false");
	// } else if(!_.isString(body.description)){
	// 	return res.status(400).send("description must be a string");
	// } else if(!body.description.trim()){
	// 	return res.status(400).send("there must be text present!");
	// }
	// body.description = body.description.trim();
	// var santizedObject = _.pick(body, "description", "completed");
	// santizedObject.id = todoNextId++;
	// todos.push(santizedObject);
	// res.json(santizedObject);

	db.todo.create(body).then(function(todo){
		res.send(todo.toJSON());
	});
});

app.delete("/todos/:id", function(req, res){
	var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos,{id: todoId});
	// if(!matchedTodo){
	// 	res.status(404).send({error: "Item could not be found"});
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	res.send(matchedTodo);
	// }
	db.todo.destroy({where: {id: todoId}}).then(function(){
		res.send("deleted");
	}, function(e){
		res.status(500).send(e);
	});
	
});

app.put("/todos/:id", function(req, res){
	//var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});
	var todoId = parseInt(req.params.id, 10);
	var body = req.body;
	var toUpdate = {};
	// if(!matchedTodo){
	// 	res.status(404).send({error: "item not found"});
	// } else {
	// 	body = _.pick(body, "description", "completed");
	// 	if(body.hasOwnProperty("completed")){
	// 		if(!_.isBoolean(body.completed)){
	// 			 return res.status(400).send("Completed must be eithe true or false");
	// 		}
	// 		matchedTodo.completed = body.completed;
	// 	}
	// 	if(body.hasOwnProperty("description")){
	// 		if(!_.isString(body.description)){
	// 			return res.status(400).send("description must be of type string");
	// 		} else if(!body.description.trim()){
	// 			return res.status(400).send("must not be empty");
	// 		}
	// 		matchedTodo.description = body.description;
	// 	}
	// 	var index = todos.indexOf(matchedTodo);
	// 	todos.splice(index, 1, matchedTodo);
	// 	res.send(matchedTodo);
	// }
	if(body.hasOwnProperty("description") && body.hasOwnProperty("completed")){
		toUpdate.description = body.description;
		toUpdate.completed = body.completed;
	} else if(body.hasOwnProperty("description")){
		toUpdate.description = body.description;
	} else if(body.hasOwnProperty("completed")){
		toUpdate.completed = body.completed;
	}
	db.todo.findById(todoId).then(function(todo){
		if(todo){
			db.todo.update(toUpdate, {where:{id: todoId}}).then(function(){
				res.send("updated!");
			});
		} else {
			res.status(404).send("item not found!");
		}
	}).catch(function(){
		res.status(400).send("update failed");
	});

});

app.post("/users", function(req, res){
	var newUser = _.pick(req.body, "email","password");
	db.user.create(newUser).then(function(user){
		var publicUser = user.toPublicJSON();
		res.send(publicUser);
	}, function(e){
		res.status(400).send(e);
	});
});

db.sequelize.sync({force: true}).then(function(){
	app.listen(PORT, function(){
		console.log("express is listening on " + PORT);
	});
});

