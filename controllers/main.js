var bodyParser = require('body-parser');
var urlencondedParser = bodyParser.urlencoded({extended: false});
var crypto = require('crypto');
const request = require('request');
const key = "14789a43-3855-435c-8ed0-e8e67ea56914";


module.exports = function(app, server){

    //Sets up session use
    const ONE_HOURS = 1000 * 60 * 60 * 1;
    const {
        PORT = 3000,
        NODE_ENV = 'development',
        SESS_NAME = 'sid',
        SESS_SECRET = 'xde',
        SESS_LIFETIME= ONE_HOURS
    }   =     process.env
    const IN_PROD = NODE_ENV === 'production'
    const session = require('express-session');

    app.use(session({
        name: SESS_NAME,
        resave: false,
        saveUninitialized: false,
        secret: SESS_SECRET,
        cookie:{
            maxAge: SESS_LIFETIME,
            sameSite: true,
            secure: IN_PROD
        }
    }));

    //Function to call Apex Legends API. Returns the body of the API call.
    const apiCall = (playerName) => {
        return new Promise((resolve, reject) => {
            var url = 'https://public-api.tracker.gg/v1/apex/standard/profile/origin/' + playerName;
            //console.log(url);
            var options = {
                url: url,
                method: 'GET',
                json: true,
                headers: {
                    'TRN-Api-Key': key  
                }
              };
          request.get(options, function(error, res, body) {
                if(error) reject(error);
                resolve(body);
          });
        });
    }

    var generate_key = function() {
        var sha = crypto.createHash('sha256');
        sha.update(Math.random().toString());
        return sha.digest('hex');
    };

  
    //Renders home page
    app.get('/', urlencondedParser, async (req, res) =>{
        if(req.session.userID){
            req.session.destroy(err =>{
                if(err) throw err;
            });
            res.clearCookie(SESS_NAME);
        }
        res.render('home');
    });


    //Get method for direct playerName search in URL
    app.get('/search/:playerName', urlencondedParser, async (req, res) =>{
        const x = await apiCall(req.params.playerName);
        var didVisit = 1;

        //Checks if user is found in API
        if(x.errors !== undefined && x.errors[0].code == "CollectorResultStatus::NotFound"){
            var error = 1;
            res.render('home', {error: error});
            return;
        }
        //If no session render search with animation else render page with no animation
        if(!req.session.userID){
            req.session.userID = generate_key();
            didVisit = 0;
            res.render('search', {data: x, didVisit: didVisit});
            return;
        }
        res.render('search', {data: x, didVisit: didVisit});

    });


    //Post method to find player name from api to render search page with player data
    app.post('/search', urlencondedParser, async (req, res) =>{
        //Redirects to get method for search/:playerName
        res.redirect('search/'+ req.body.playerName);
    });

}