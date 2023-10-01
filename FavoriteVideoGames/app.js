var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");
var User = require("./models/users");
var videogames = require("./models/videogames");
var mobilegames = require("./models/mobilegames");
var videogamesComments = require("./models/videogamesComments");
var mobilegamesComments = require("./models/mobilegamesComments");
var seedFunc = require("./seeds");

// seedFunc();

const connectionString = "mongodb+srv://Andy2436:Terraria2436@favoritevideogames.1kwwq.mongodb.net/FavoriteVideoGames?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


app.use(express.static("views"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


// Passport


app.use(require("express-session")({
	secret: "Favorite Mobile Games is Mario Kart Tour",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.successMessage = req.flash("success");
	res.locals.errorMessage = req.flash("error");
	res.locals.updateMessage = req.flash("update");
	res.locals.warningMessage = req.flash("warning");
	next();
});

passport.use(new LocalStrategy(User.authenticate()));



// Routes

app.get("/", function(req, res){
	res.render("home");
});

app.get("/videogames", function(req, res){
	User.find({}).populate("videogames").exec(function(err, users){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("VideoGames/videogames", {users: users});
		}
	})
});

app.get("/videogames/:id", function(req, res){
	User.findById(req.params.id).populate("videogames").exec(function(err, user){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			User.findById(req.params.id).populate("videogamesComments").exec(function(err, updatedUser){
				if(err){
					console.log(err)
					res.redirect("back");
				}
				else {
					res.render("VideoGames/show", {user: user, userComments: updatedUser});
				}
			})
		}
	})
});

app.post("/videogames/:id/comments", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			videogamesComments.create({
				comment: req.body.comment,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			}, function(err, createdComment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					foundUser.videogamesComments.push(createdComment);
					foundUser.save();
					req.flash("success", "Posted Comment");
					res.redirect("/videogames/" + req.params.id);
				}
			})
		}
	})
});

app.get("/videogames/:id/new", isAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("VideoGames/new", {user: foundUser});
		}
	})
});

app.post("/videogames/:id", isAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			videogames.create(req.body.videogames, function(err, createdVideogames){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					foundUser.videogames.push(createdVideogames);
					foundUser.save();
					req.flash("success", "Posted Videogames");
					res.redirect("/videogames/" + req.params.id);
				}
			})
		}
	})
});


app.get("/videogames/:id/comments/new", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("Comments/new", {user: foundUser});
		}
	})
});

app.get("/videogames/:id/comments/:commentId/edit", videogamesCommentAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err)
			res.redirect("back");
		}
		else {
			videogamesComments.findById(req.params.commentId, function(err, foundComment){
				if(err){
					console.log(err)
					res.redirect("back");
				}
				else {
					res.render("Comments/videogamesCommentsEdit", {user: foundUser, comment: foundComment});
				}
			})
		}
	})
});

app.put("/videogames/:id/comments/:commentId", videogamesCommentAuthenticated, function(req, res){
	videogamesComments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("update", "Edited Comment");
			res.redirect("/videogames/" + req.params.id);
		}
	})
});

app.delete("/videogames/:id/comments/:commentId", videogamesCommentAuthenticated, function(req, res){
	videogamesComments.findByIdAndRemove(req.params.commentId, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("warning", "Deleted Comment");
			res.redirect("/videogames/" + req.params.id);
		}
	});
});

app.get("/videogames/:id/games/:gameId/edit", isAuthenticated,  function(req, res){
	videogames.findById(req.params.gameId, function(err, foundVideogames){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			User.findById(req.params.id, function(err, foundUser){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					res.render("VideoGames/edit", {videogames: foundVideogames, user: foundUser});
				}
			});
		}
	})	
});

app.put("/videogames/:id/games/:gameId", isAuthenticated, function(req, res){
	videogames.findByIdAndUpdate(req.params.gameId, req.body.videogames, function(err, foundVideogames){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("update", "Edited Videogames");
			res.redirect("/videogames/" + req.params.id);
		}
	})
});

app.delete("/videogames/:id/games/:gameId", isAuthenticated, function(req, res){
	videogames.findByIdAndRemove(req.params.gameId, function(err, deletedVideogames){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("warning", "Deleted Videogames");
			res.redirect("/videogames/" + req.params.id);
		}
	})
});



// Mobilegames Routes


app.get("/mobilegames", function(req, res){
	User.find({}).populate("mobilegames").exec(function(err, foundUsers){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("MobileGames/mobilegames", {users: foundUsers});
		}
	})
});


app.get("/mobilegames/:id", function(req, res){
	User.findById(req.params.id).populate("mobilegames").exec(function(err, user){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			User.findById(req.params.id).populate("mobilegamesComments").exec(function(err, updatedUser){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					res.render("MobileGames/show.ejs", {user: user, userComments: updatedUser});
				}
			})
		}
	})
});

app.post("/mobilegames/:id", isAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			mobilegames.create(req.body.mobilegames, function(err, createdMobilegames){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					foundUser.mobilegames.push(createdMobilegames);
					foundUser.save();
					req.flash("success", "Posted Mobilegames");
					res.redirect("/mobilegames/" + req.params.id);
				}
			})
		}
	})
});

app.get("/mobilegames/:id/new", isAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("MobileGames/new", {user: foundUser});
		}
	})
});

app.post("/mobilegames/:id/comments", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			mobilegamesComments.create({
				comment: req.body.comment,
				author: {
					id: req.user._id,
					username: req.user.username
				}
			}, function(err, createdComment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					foundUser.mobilegamesComments.push(createdComment);
					foundUser.save();
					req.flash("success", "Posted Comment");
					res.redirect("/mobilegames/" + req.params.id);
				}
			})
		}
	})
});


app.get("/mobilegames/:id/comments/new", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.render("Comments/mobilegamesCommentsNew", {user: foundUser});
		}
	})
});

app.get("/mobilegames/:id/comments/:commentId/edit", mobilegamesCommentAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			mobilegamesComments.findById(req.params.commentId, function(err, foundComment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					res.render("Comments/mobilegamesCommentsEdit", {user: foundUser, comment: foundComment});
				}
			})
		}
	})
});

app.put("/mobilegames/:id/comments/:commentId", mobilegamesCommentAuthenticated, function(req, res){
	mobilegamesComments.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("update", "Edited Comment");
			res.redirect("/mobilegames/" + req.params.id);
		}
	})
});

app.delete("/mobilegames/:id/comments/:commentId", mobilegamesCommentAuthenticated, function(req, res){
	mobilegamesComments.findByIdAndRemove(req.params.commentId, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("warning", "Deleted Comment");
			res.redirect("/mobilegames/" + req.params.id);
		}
	});
});

app.get("/mobilegames/:id/games/:gameId/edit", isAuthenticated, function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			mobilegames.findById(req.params.gameId, function(err, foundMobilegames){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else {
					res.render("MobileGames/edit", {user: foundUser, mobilegames: foundMobilegames});
				}
			})		
		}
	});
});

app.put("/mobilegames/:id/games/:gameId", isAuthenticated, function(req, res){
	mobilegames.findByIdAndUpdate(req.params.gameId, req.body.mobilegames, function(err, foundMobileGames){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("edit", "Edited Mobilegames");
			res.redirect("/mobilegames/" + req.params.id);
		}
	})
});

app.delete("/mobilegames/:id/games/:gameId", isAuthenticated, function(req, res){
	mobilegames.findByIdAndRemove(req.params.gameId, function(err, deletedMobilegames){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else {
			req.flash("warning", "Deleted Mobilegames");
			res.redirect("/mobilegames/" + req.params.id);
		}
	})
});




// Passport Routes

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, createdUser){
		if(err){
			console.log(err);
			res.render("register");
		}
		else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to the Favorite Videogames App " + req.body.username);
				res.redirect("/videogames");
			})
		}
	});
})

app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/videogames",
	failureRedirect: "/login"
}));

app.get("/logout", isLoggedIn, function(req, res){
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/videogames");
});



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You Must Login First");
	res.redirect("/login");
};

function isAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		User.findById(req.params.id, function(err, foundUser){
			if(err){
				res.redirect("back");
				req.flash("error", "This Must be Your Post to Do That");
			}
			else {
				if(foundUser._id.equals(req.user._id)){
					next();
				}
				else {
					req.flash("error", "This Must be Your Post to Do That");
					res.redirect("back");
				}
				
			}
		})
	}
		else {
			req.flash("error", "This Must be Your Post to Do That");
			res.redirect("back");
		}
};


function videogamesCommentAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		videogamesComments.findById(req.params.commentId, function(err, foundComment){
			if(err){
				res.redirect("back");
				req.flash("error", "This Must be Your Post to Do That");
			}
			else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else {
					req.flash("error", "This Must be Your Post to Do That");
					res.redirect("back");
				}
				
			}
		})
	}
		else {
			req.flash("error", "This Must be Your Post to Do That");
			res.redirect("back");
		}
};

function mobilegamesCommentAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		mobilegamesComments.findById(req.params.commentId, function(err, foundComment){
			if(err){
				res.redirect("back");
				req.flash("error", "This Must be Your Post to Do That");
			}
			else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else {
					req.flash("error", "This Must be Your Post to Do That");
					res.redirect("back");
				}
				
			}
		})
	}
		else {
			req.flash("error", "This Must be Your Post to Do That");
			res.redirect("back");
		}
};


app.listen(process.env.PORT || 3000, function(err, success){
	if(err){
		console.log(err);
	}
	else {
		console.log("The server has started");
	}
});