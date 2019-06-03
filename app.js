var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

// this will allow us to use JavaScript and CSS..in the public directory
var serveStatic = require('serve-static');
var path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 15100);


//GLOBAL VARIABLE ARRAYS SIMULATING DATABASE TABLES
function article(title, url){
  this.title = title;
  this.url = url;
}

var articles=[];
articles.push(new article("New Taco Shop Opening", "www.tacotracker.net/mrtaco-23421"));
articles.push(new article("3 Ways to Cut Your Own Hair", "www.nytimes.com/haircutting-tips-261"));
articles.push(new article("Are You Harry Potter?", "www.potter.net/harrypottertest-34231"));
articles.push(new article("NBA goes bankrupt", "www.nba/financeleague.com"));
articles.push(new article("50% of American die of lung disease", "www.cnn/health/stats22.com"));
articles.push(new article("See more wine country for improved lifestyle", "www.winehealth/lifestyle.com"));


function login(uid, password){
  this.uid = uid;
  this.password = password;
}

var logins=[];
logins.push(new login("bobby5", "mygoodpassword"));
logins.push(new login("jj3", "myevenbetterpassword"));
logins.push(new login("jimbo", "password123"));
logins.push(new login("karen23", "usa123"));
logins.push(new login("repo22", "catch22"));

//ROUTES

//TODO: home page with links to other parts
app.get('/',function(req,res){
  res.render('home');
});

// route to siteAdminPage
app.get('/siteAdmin', function(req, res){
	var context = {};
	
	res.render('siteAdmin');
});

//GET route for browse articles
//Displays list of articles
app.get('/article-table', function(req, res){
  var context = {};
  context.articles = articles;
  res.render('article-table', context);
});


//This route displays login form
//form submit posts to verify-login route
app.get('/login', function(req, res){
  var context = {};

  res.render('login-form', context);
});

app.get('/logout', function(req,res){
	res.redirect('home');
});

//POST route login forms sends uid/password here to be verified
app.post('/verify-login', function(req, res){
  var context = {};
  uid = req.body.uid;
  password = req.body.password;

  console.log(uid + "," + password);

  //TODO:  check request uid and password versus logins array
  // If is valid, redirect to somewhere
  // If invalid, do something else, maybe redirect back to login form with error
  for(var i=0; i<logins.length; i++){
    if(uid == logins[i].uid && password == logins[i].password){
      //password matches, redirect to article table browse?
      res.redirect('/article-table');
      return;
    }
  }
 
  //no match
  //alert("Error Password and Username does not match.");
  context.error = "Error Password and Username does not match.";
  res.render('login-form', context);

});

//ERROR stuff
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
