// FULLY FUNCTIONING APPLICATION.
var express 	= require('express')
var    app 		= express()
var 	bodyParser 	= require('body-parser')
var	  mongoose 	= require('mongoose')
var    methodOverride = require('method-override')
var 	expressSanitizer = require("express-sanitizer");


//APP CONFIG
mongoose.connect("mongodb://localhost/sch_data_base",{useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
//  app.use(express.static("files"));
// app.use('/static', express.static('public'));
// app.use(express.static(__dirname + 'public')); //Serves resources from public folder
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //has to be after bodyparser
app.use(methodOverride("_method"));


//MONGOOSE / MODEL CONFIG
var datasch = new mongoose.Schema({
	name     : String,
	class    : Number,
	section   : Number,

});

var data = mongoose.model("data", datasch);  // Database Model

//--------RESTful ROUTES--------//

app.get("/", function(req, res){
	res.redirect("/home");                 //Home page
})

//INDEX ROUTE
app.get("/home", function(req, res){

			res.render("index"); // Home page
});

//about us
app.get("/about", function(req, res){
	res.render("about");   //About Us page
});

 // This route is for displaying all the students i.e STUDENTLIST
app.get("/studentlist",function(req,res){
	data.find({},function(err, datas){
			if(err){
				console.log(err);
			} else{
				res.render("studentlist", {datas: datas});
			}
		});
	});

//new student
app.get("/studentlist/new", function(req, res){     // CREATING new student
	res.render("new");
});


// NEW STUDENT DETAILS STORING IN TO DATABSE TAKEN FORM FILLED BY THE USER
app.post("/studentlist2",function(req,res){
	data.create(req.body.datas, function(err, newstudent){
		if(err){
			res.render("new");
		} else {
			//redirect to index
			res.redirect("/studentlist");
		}
	});
});


//SHOW ROUTE      // IT DISPLAYS INFO OF A PARTICULAR STUDENT ,THIS IS DONE BY **STUDENTID**
 app.get("/studentlist/:id", function(req, res){
	data.findById(req.params.id, function(err, data){
		if(err){
			res.redirect("/");
		} else {
			res.render("show", {data: data});
		}
	});
});



//EDIT ROUTE                   //FOR EDITING INFO OF A PARTICULAR STUDENT
app.get("/studentlist/:id/edit", function(req, res){
	data.findById(req.params.id, function(err, data){
		if(err){
			res.redirect("/");
		} else {
			res.render("edit", {data: data});
		}
	});
});

//UPDATE ROUTE         // UPDATING INFO OF A PARTICULAR STUDENT      // FIRST EDIT AND THEN DETAILS ARE UPDATED BY UPDATE ROUTE
app.put("/studentlist/:id", function(req, res){
	req.body.data.body = req.sanitize(req.body.data.body);
	data.findByIdAndUpdate(req.params.id, req.body.data, function(err, data){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/studentlist/" + req.params.id);
		}
	})//id, newdata, callback
});


//DELETE ROUTE      // DELETING INFO OF A PARTICULAR STUDENT FROM DATABASE
app.delete("/studentlist/:id", function(req, res){
	//destroy blog
	data.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/");
		} else{
			res.redirect("/studentlist");
		}
	})
})


app.listen(3000);
console.log("server started");
