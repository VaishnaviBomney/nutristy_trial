const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      //passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./user");
//Connecting database
mongoose.connect("mongodb://localhost/auth_demo");
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("db connection succeeded"); 
});
//
app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());
//=======================
//      R O U T E S
//=======================
app.get("/", (req,res) =>{
    res.render("home");
})
app.get("/userprofile",isLoggedIn ,(req,res) =>{
    res.render("userprofile");
})
//Auth Routes
var router=express.Router();
app.get("/login",(req,res)=>{
    res.render("login");
});

// var sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/userprofile');
//     } else {
//         next();
//     }    
// };

// app.route('/login')
//     .get(sessionChecker, (req, res) => {
//         res.sendFile(__dirname + '/views/login.ejs');
//     })
//     .post((req, res) => {
//         var username = req.body.username,
//             password = req.body.password;

//         User.findOne({ where: { username: username } }).then(function (user) {
//             if (!user) {
//                 res.redirect('/login');
//             } else if (!user.validPassword(password)) {
//                 res.redirect('/login');
//             } else {
//                 req.session.user = user.dataValues;
//                 res.redirect('/userprofile');
//             }
//         });
//     });

// app.post('/login', function (req, res, next) {
//     // confirm that user typed same password twice
//     if (req.body.password != req.body.passwordConf) {
//       var err = new Error('Passwords do not match.');
//       err.status = 400;
//       res.send("passwords do not match");
//       return next(err);
//     }
  
//     if (req.body.email &&
//       req.body.username &&
//       req.body.password &&
//       req.body.passwordConf) {
  
//       var userData = {
//         email: req.body.email,
//         username: req.body.username,
//         password: req.body.password,
//       }
  
//       User.create(userData, function (error, user) {
//         if (error) {
//           return next(error);
//         } else {
//           req.session.userId = user._id;
//           return res.redirect('/userprofile');
//         }
//       });
  
//     } else if (req.body.logemail && req.body.logpassword) {
//       User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//         if (error || !user) {
//           var err = new Error('Wrong email or password.');
//           err.status = 401;
//           return next(err);
//         } else {
//           req.session.userId = user._id;
//           return res.redirect('/userprofile');
//         }
//       });
//     } else {
//       var err = new Error('All fields required.');
//       err.status = 400;
//       return next(err);
//     }
//     return res.redirect('/userprofile');
//   })

app.post('/login',function(req,res){
    User.findOne({
        username: req.body.username,
        password: req.body.password
    }, function(err,docs){
        if(docs){
            console.log("Log in worked");
            res.redirect('/views/userprofile');
            }
        else{
            console.log("Login failed");
            res.redirect('/views/userprofile');
            }
        });
});

// app.post("/login",passport.authenticate("local",{//Main issue
//     //successRedirect:"/userprofile.ejs",
//     failureRedirect:"/login"
// }),function (req, res){
// res.redirect("/userprofile");});

//app.post("/login",(req,res)=> {passport.authenticate("local")(req,res,function () {
  //res.succuessRedirect("/userprofile");
  //res.failureRedirect("/login");
//  res.redirect("/userprofile");
//})
//});

app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,phone:req.body.phone,email: req.body.email}) ,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/userprofile");
    })    
    })
})
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/userprofile");//change here
}
//Listen On Server
app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});