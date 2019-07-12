var bodyParser = require('body-parser');
var urlencondedParser = bodyParser.urlencoded({extended: false});
const request = require('request');
const key = "14789a43-3855-435c-8ed0-e8e67ea56914";
var socket = require('socket.io');

module.exports = function(app, server){

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
    app.get('/', urlencondedParser, async (req, res) =>{

        //const x = await apiCall();
        //console.log(x.data.metadata.platformUserId);

        res.render('home');
    });

    app.get('/search', urlencondedParser, async (req, res) =>{

        //const x = await apiCall();
        //console.log(x.data.metadata.platformUserId);

        res.render('search');
    });

    //Post method to find player name from api to render search page with player data
    app.post('/search', urlencondedParser, async (req, res) =>{
        const x = await apiCall(req.body.playerName);
        console.log(x);
        res.send(JSON.stringify(x));
        //res.render('search', {data: x});
    });

    //Socket setup
    var io = socket(server);

    io.on('connection', (socket)=>{
        console.log('made socket connection', socket.id)

        socket.on('Data', async (data) =>{
            console.log(data);
            const x = await apiCall(data.message);
            console.log(x);
            socket.emit('Data', x);
        });

    });


}