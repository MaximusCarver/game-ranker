var mongoose = require("mongoose");

var videogameSchema = new mongoose.Schema({
	firstPlace: String,
	secondPlace: String,
	thirdPlace: String,
	image: String,
	description: String,
	year: String,
	console: String
});

module.exports = mongoose.model("videogames", videogameSchema);