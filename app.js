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

//creating articles table
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

function savedArticles(title, url){
  this.title = title;
  this.url = url;
}

var savedArticle=[];
savedArticle.push(new savedArticle("45 year old baby", "www.newborn.net/simplelife"));
savedArticle.push(new savedArticle("Cat turns grey", "www.newcat.com"));
savedArticle.push(new savedArticle("Dad turns 12", "www.cnn/lifestyle.com"));
savedArtcile.push(new savedArticle("Highschool diploma fakes", "www.cnbc/education"));


//creating user logins table
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


//creating user profiles table
function profile(uid, firstName, lastName, email, profileText){
  this.uid = uid;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.profileText = profileText;
}
var profiles = [];
profiles.push(new profile("bobby5", "Robert", "Smith", "bobby5@hotmail.com", "I like to skateboard and rate news articles."));
profiles.push(new profile("jj3", "Johnny", "Jenkins", "jj@hotmail.com", "Takin care of business"));
profiles.push(new profile("jimbo", "James", "McDougal", "jimbo@aol.com", "West Philadelphia born and raised"));
profiles.push(new profile("karen23", "Karen", "Williams", "kw@comcast.net", "News Junky"));
profiles.push(new profile("repo22", "Donald", "Trumpkins", "repo22@hotmail.com", "Dog walker, article rater"));





//ROUTES

//home page with links to other parts
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

//GET route for saved artciles
//Displays list of saved articles
app.get('/article-saved', function(req, res){
  var context = {};
  context.savedArticle = savedArticle;
  res.render('article-saved', context);
});

//This route displays login form
//form submit posts to verify-login route
app.get('/login', function(req, res){
  var context = {};

  res.render('login-form', context);
});

//POST route login forms sends uid/password here to be verified
app.post('/verify-login', function(req, res){
  var context = {};
  uid = req.body.uid;
  password = req.body.password;

  console.log(uid + "," + password);

  // check request uid and password versus logins array
  // If is valid, redirect to somewhere
  // If invalid, do something else, maybe redirect back to login form with error
  for(var i=0; i<logins.length; i++){
	if (uid == "jimbo" && password == "password123"){
	  res.redirect('/jimbo');
	}
    else if(uid == logins[i].uid && password == logins[i].password){
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

app.get('/jimbo', function(req,res){
	res.redirect('/jimbo');
}


//user profile update form
//query string needs to have user id, displays pre-filled form for update
app.get('/update-profile', function(req, res){
  var context = {};
  var uid = req.query.uid;

  //if there was a user id submitted, try to find in table
  if(uid){
    for(var i=0; i<profiles.length; i++){
      if(profiles[i].uid == uid){
        context.uid = uid;
        context.firstName = profiles[i].firstName;
        context.lastName = profiles[i].lastName;
        context.email = profiles[i].email;
        context.profileText = profiles[i].profileText;

        res.render('update-profile-form', context);
        return;
      }
    }

  }
  
  //unable to find a profile to update, display error page
  context.status = 'Error: Unable to find profile for user id: ' + uid;
  res.render('update-profile-status', context);

});


//post route for any updates to user profile
//updated data is sent in post body
app.post('/update-profile-post', function(req, res){
  var context = {};
  uid = req.body.uid;

  for(let i=0; i<profiles.length; i++){
    //find matching profile and write new values
    if(profiles[i].uid = uid){
      profiles[i].firstName = req.body.firstName;
      profiles[i].lastName = req.body.lastName;
      profiles[i].email = req.body.email;
      profiles[i].profileText = req.body.profileText;

      context.status = 'Success: Profile for ' + uid + ' successfully update';
      res.render('update-profile-status', context);
      return;
    }
  }

  //else there was some error 
  context.status = 'Error: unable to update profile';
  res.render('update-profile-status', context);

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
