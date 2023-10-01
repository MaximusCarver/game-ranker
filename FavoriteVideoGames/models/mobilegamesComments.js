var mongoose = require("mongoose");

var mobilegamesCommentSchema = new mongoose.Schema({
	comment: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		username: String
	}
});	
	
module.exports = mongoose.model("mobilegamesComments", mobilegamesCommentSchema);