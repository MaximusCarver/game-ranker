var mongoose = require("mongoose");

var videogamesCommentSchema = new mongoose.Schema({
	comment: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		username: String
	}
});	
	
module.exports = mongoose.model("videogamesComments", videogamesCommentSchema);