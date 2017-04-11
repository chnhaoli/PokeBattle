var express = require('express');
var app = express();

app.use('/js', express.static(__dirname + '/js'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/images', express.static(__dirname + '/images'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname });
});

app.listen(process.env.PORT || 8000); //the port you want to use


// Previous package.json start script:
//"start": "http-server app/ -a 0.0.0.0 -p 8000"
//   "start": "node ./app/server.js"
