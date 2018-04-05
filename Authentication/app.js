var express         = require("express");
var app             = express();
var mongoose        = require("mongoose");
var passport        = require("passport");
var bodyParser      = require("body-parser");
var LocalStrategy   = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User            = require("./models/user");
var Students        = require("./models/student");
var Companies       = require("./models/company");
var methodOverride  = require("method-override");
var expressSanitizer= require("express-sanitizer");

// App config 
mongoose.connect("mongodb://localhost/");

// need to tell express to serve public folder cuz by default only views dir served
app.use(express.static("public"));

// remove ejs extension from views
app.set("view engine" , "ejs");

// as only get and posts methods are supported now by http
app.use(methodOverride("_method"));

//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.urlencoded({extended:true}));

app.use(expressSanitizer());

app.use(require("express-session")({
    //A session secret in connect is simply used to compute the hash
    secret : "dewa is haggu",

    //Forces the session to be saved back to the session store, even if the session was never modified during the request. 
    resave : false,
    
    //the session cookie will not be set on the browser unless the session is modified.
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To authenticate login pst
passport.use(new LocalStrategy(User.authenticate()));

//====================
// register routes
//====================

app.get("/register", function(req, res) {
    res.render("register");
})

// handling user sign up
app.post("/register", function(req, res) {
    
    User.register(new User({username : req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secret");
            })   
        }
    })
})

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
})

// ===============
// Login Routes
// ===============

app.get("/login", function(req, res) {
    res.render("login")
})


// middle ware  something before turn back data
// auth waaala is middleware (runs immediately after post login not like callback)
app.post("/login", passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login"
}), function(req, res) {
    
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next) { // next thing to be called
    if (req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

// ===============
// Student Routes
// ===============
app.get('/students' , function(request , response){
        
    Students.find({},function(error , students){
        if(error)
            console.log("Error");
        else    
            response.render("indexstudents" , {students:students}); 
    });
});

// NEW route
app.get('/students/newstudents' , function(request , response){
    response.render("newstudents");
});

// CREATE route
app.post('/students' , function(request , response){
// Create student 
request.body.student.body = request.sanitize(request.body.student.body);

Students.create(request.body.student, function(error , newStudent){
    if(error)
        {
            response.render("newstudents");
            console.log(error);
        }
    else    
        response.redirect("/students");
    })
});

//SHOW route
app.get('/students/:id' , function(request , response){
    Students.findById(request.params.id , function(error , foundStudent){
        if(error)
            response.redirect("/students");
        else    
            response.render("showstudents" , {student: foundStudent});
        })
});

//EDIT route
app.get('/students/:id/edit' , function(request , response){
    Students.findById(request.params.id , function(error , foundStudent){
        if(error)
            response.redirect("/students");
        else    
            response.render("edit" , {student: foundStudent});
        })
});

//UPDATE route
app.put('/students/:id' , function(request , response){
    // response.send("UPDATED"); 
    // Students.findByIdAndUpdate(id, newData, callback)
    Students.findByIdAndUpdate(request.params.id, request.body.student, function(error , updatedStudent)
    {
        if(error)
            response.redirect("/students");
        else
            response.redirect("/students/" + request.params.id);
    })
});

//DELETE route
app.delete('/students/:id' , function(request , response){
    // response.send("UPDATED"); 
    // Students.findByIdAndRemove(id, callback)
    Students.findByIdAndRemove(request.params.id,  function(error , deletedStudent)
    {
        if(error)
            response.redirect("/students");
        else
            response.redirect("/students");
    })
});

// ===============
// Company Routes
// ===============
app.get('/companies' , function(request , response){
        
    Companies.find({},function(error , companies){
        if(error)
            console.log("Error");
        else    
            response.render("indexcompanies" , {companies:companies}); 
    });
});

// NEW route
app.get('/companies/newcompanies' , function(request , response){
    response.render("newcompanies");
});

// CREATE route
app.post('/companies' , function(request , response){
// Create student 
request.body.company.body = request.sanitize(request.body.company.body);

Companies.create(request.body.company, function(error , newCompany){
    if(error)
        {
            response.render("newcompanies");
            console.log(error);
        }
    else    
        response.redirect("/companies");
    })
});

//SHOW route
app.get('/companies/:id' , function(request , response){
    Companies.findById(request.params.id , function(error , foundCompany){
        if(error)
            response.redirect("/companies");
        else    
            response.render("showcompanies" , {company: foundCompany});
        })
});

//EDIT route
app.get('/companies/:id/edit' , function(request , response){
    Companies.findById(request.params.id , function(error , foundCompany){
        if(error)
            {
                response.redirect("/companies");
                console.log(error);
            }
        else    
            response.render("editcompanies" , {company: foundCompany});
        })
});

//UPDATE route
app.put('/companies/:id' , function(request , response){
    // response.send("UPDATED"); 
    // companies.findByIdAndUpdate(id, newData, callback)
    Companies.findByIdAndUpdate(request.params.id, request.body.company, function(error , updatedCompany)
    {
        if(error)
            {
                response.redirect("/companies");
                console.log(error);
            }
        else
            response.redirect("/companies/" + request.params.id);
    })
});

//DELETE route
app.delete('/companies/:id' , function(request , response){
    // response.send("UPDATED"); 
    // companies.findByIdAndRemove(id, callback)
    Companies.findByIdAndRemove(request.params.id,  function(error , deletedCompany)
    {
        if(error)
            response.redirect("/companies");
        else
            response.redirect("/companies");
    })
});

app.listen(3000, function(){
    console.log("server has started...");
})