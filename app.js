var express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser');

var app = express();
var routes = require('./routes');
var config = require('./.config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//use stuff
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', routes);


var http = require('http').Server(app);
var io = require('socket.io')(http);

/*procedure:
1.) user logs on phone
2.) user logs on desktop
3.) desktop requests phone code.
4.) send phone code + desktop UN to server. 
5.) pipe thru to phone via phone code. Phone registers username of desktop.
*/
var pendingPhoneCodes = ['dave123', 'dave321'],
    ships = [], //list of phone codes that have not yet been assigned. Includes test phone code.
    lazers = []; //list of 'lasers';
io.on('connection', function(socket) {

    //player format: 

    socket.on('newPhone', function(phone) {
        pendingPhoneCodes.push(phone);
        console.log('PHONES:', pendingPhoneCodes)
    });
    socket.on('playerMove', function(p) {
        //update player
        console.log('player movement!', p)
        var foundShip = false,
            i = 0;
        for (i; i < ships.length; i++) {
            if (ships[i].id == p.id) {
                ships[i].vx = p.vx;
                ships[i].vy = p.vy;
                ships[i].vr = p.vr;
                foundShip = true;
                console.log('ship status', ships[i].x, ships[i].y, ships[i].r)
            }
        }
        if (!foundShip) {
            console.log('Was not able to find ship', p.id);
        }
    });
    socket.on('newPlayer', function(p) {
        ships.push(p);
        console.log(p)
    })
    socket.on('checkAndReg', function(phoneObj) {
        console.log('PHONE IS', JSON.stringify(phoneObj))
        if (pendingPhoneCodes.indexOf(phoneObj.code) != -1) {
            phoneObj.valid = true;
            pendingPhoneCodes.slice(pendingPhoneCodes.indexOf(phoneObj.code), 1)
        } else {
            phoneObj.valid = false;
        }
        io.emit('checkAndRegFront', phoneObj)
    });
    var t = setInterval(function() {
        //send out current pos of ships.
        for (var i=0; i<ships.length;i++){
            ships[i].x+=ships[i].vx;
            ships[i].y+=ships[i].vy;
            ships[i].r+=ships[i].vr;
        }
        io.emit('shipPosits', { ships: ships, lazers: lazers });
    }, 100)
});
io.on('error', function(err) {
    console.log("SocketIO error was", err)
});

//set port, or process.env if not local
http.listen(process.env.PORT || 9264);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message,
        error: {}
    });
});
