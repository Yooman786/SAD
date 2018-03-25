var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
express        = require("express"),
mongoose       = require("mongoose"),
passport       = require("passport"),
Admin          = require("./models/admin"),
LocalStrategy  = require("passport-local").Strategy,
passportLocalMongoose = require("passport-local-mongoose");

app = express();

var studentSchema = new mongoose.Schema({
    name: String,
    id: Number,
    branch: String,
    cpi: Number
});



//studentSchema.plugin(passportLocalMongoose);
// Students.create({
//     name: "Harshal",
//     id: 151080021,
//     branch: "IT",
//     cpi: 8.11
// });  

Students =  mongoose.model("Students",studentSchema);

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

app.use(require("express-session")({
    secret: "Dewa is haggu",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// to authentoicate login post
passport.use(new LocalStrategy(Admin.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
   

//Restful routes

    //index route
    app.get('/' , function(request , response){
        response.render("home");
    });

    // app.get('/secret' , isLoggedIn (request , response , next) , function(request , response){
    //     response.render("secret");
    // });
    
    //register routes
    app.get('/register' , function(request , response){
        response.render("register");
    });

    app.post('/register' , function(request , response){
        request.body.username
        request.body.password
        Admin.register(new Admin({username: request.body.username}), request.body.password , function(err, admin)
        {
        if(err)
            console.log(err);
        else // if fb or twitter then non local
            passport.authenticate("local")(request , response , function(){
                response.redirect("/secret");
            }) 
        });    
    });

    //login routes

    app.get('/login' , function(request , response){
        response.render("login")
    });
    // auth waaala is middleware (runs immediately after post login not like callback)
    app.post('/login' , passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }), function(request , response){
        Admin.register(new Admin({username: request.body.username}), request.body.password , function(err, admin)
        {
        if(err)
            console.log(err);
        else // if fb or twitter then non local
            passport.authenticate("local")(request , response , function(){
                response.redirect("/secret");
            }) 
        });    
    });    

    app.get('/logout' , function(request , response){
        request.logout();
        response.redirect("/");
    });

    function isLoggedIn(request , response , next){
        if(request.isAuthenticated())
            return next();
        response.redirect("/login");
    }

    app.get('/students' , function(request , response){
        
        Students.find({},function(error , students){
            if(error)
                console.log("Error");
            else    
                response.render("index" , {students:students}); 
        });
    });

    // NEW route
    app.get('/students/newstudents' , function(request , response){
        response.render("newstudents");
    });

    //CREATE route
    app.post('/students' , function(request , response){
    // Create student 
    Students.create(request.body.student, function(error , newStudent){
        if(error)
            response.render("newstudents");
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
                response.render("show" , {student: foundStudent});
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

app.get('*' , function(request , response){
    response.send("page not error occured");
  });


app.listen(3000,function () {
    console.log("Server started");
  });