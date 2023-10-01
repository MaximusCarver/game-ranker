var mongoose = require("mongoose");
var User = require("./models/users");
var videogames = require("./models/videogames");
var mobilegames = require("./models/mobilegames");
var comments = require("./models/videogamesComments");

// var gameObject = [{
// 	firstPlace: "Super Smash Bros. Ultimate",
// 	secondPlace: "Pokemon Ultra Moon",
// 	thirdPlace: "New Super Mario Bros. U",
// 	image: "https://external-preview.redd.it/_wq5TFnymlf33K6o_hy4NnD1cDzIMB7Vg2SiXVo-dHw.jpg?auto=webp&s=447955d77286e4d4a421121b7fa813abf8bb3b13",
// 	year: "2018"
// }, 
//  {
// 	firstPlace: "Pokemon Y",
// 	secondPlace: "Super Smash Bros. Brawl",
// 	thirdPlace: "Unknown",
// 	image: "https://cdn2.bulbagarden.net/upload/thumb/4/41/Y_EN_boxart.png/250px-Y_EN_boxart.png",
// 	year: "2017"	
// }];

var gameObject = [{
	firstPlace: "Terraria",
	secondPlace: "Fifa Mobile",
	thirdPlace: "Unknown",
	image: "https://www.mobygames.com/images/covers/l/390309-terraria-xbox-one-front-cover.png",
	year: "2018"
}, 
 {
	firstPlace: "Jurassic World: The Game",
	secondPlace: "Terraria",
	thirdPlace: "Unknown",
	image: "https://i.ytimg.com/vi/6vYJwCL3vXE/maxresdefault.jpg",
	year: "2017"	
}];

function seedFunc(){
	// gameObject.forEach(function(item){
	// 	User.findById("6087608ca01eff09a0278d88", function(err, foundUser){
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		else {
	// 			videogames.create(item, function(err, createdVideogames){
	// 				if(err){
	// 					console.log(err);
	// 				}
	// 				else {
	// 					foundUser.videogames.push(createdVideogames);
	// 					foundUser.save();
	// 					console.log(foundUser);
	// 				}
	// 			})
	// 		}
	// 	})
	// });
	gameObject.forEach(function(item){
		User.findById("6087608ca01eff09a0278d88", function(err, foundUser){
			if(err){
				console.log(err);
			}
			else {
				mobilegames.create(item, function(err, createdMobilegames){
					if(err){
						console.log(err);
					}
					else {
						foundUser.mobilegames.push(createdMobilegames);
						foundUser.save();
						console.log(foundUser);
					}
				})
			}
		})
	})
};



module.exports = seedFunc;