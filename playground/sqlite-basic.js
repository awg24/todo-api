var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
	"dialect": "sqlite",
	"storage": __dirname + "/basic-sqlite-database.sqlite"
});

var Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING
	},
	completed: {
		type: Sequelize.BOOLEAN
	}
});
sequelize.sync().then(function(){
	console.log("everything is synced");

	Todo.findAll({
		where: {completed: true}
	}).then(function(todo){
		if(todo.length > 0){
			console.log(todo);
		} else {
			console.log("not found!");
		}
	});

	// Todo.create({
	// 	description: "walk the dog",
	// 	completed: false
	// }).then(function(todo){
	// 	console.log(todo);
	// });
});