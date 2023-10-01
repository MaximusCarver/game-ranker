var mongoose = require("mongoose");

var mobilegamesSchema = new mongoose.Schema({
	firstPlace: String,
	secondPlace: String,
	thirdPlace: String,
	image: String,
	description: String,
	year: String
});

module.exports = mongoose.model("mobilegames", mobilegamesSchema);
