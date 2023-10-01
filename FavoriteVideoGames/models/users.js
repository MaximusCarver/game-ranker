var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	videogames: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "videogames"
		}
	],
	mobilegames: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "mobilegames"
		}
	],
	videogamesComments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "videogamesComments"
		}
	],
	mobilegamesComments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "mobilegamesComments"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", userSchema);
