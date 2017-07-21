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
var pendingPhoneCodes = ['dave123', 'dave321']; //list of phone codes that have not yet been assigned. Includes test phone code.
io.on('connection', function(socket) {
    socket.on('newPhone', function(phone) {
        pendingPhoneCodes.push(phone);
        console.log('PHONES:', pendingPhoneCodes)
    });
    socket.on('moveData', function(moveObj) {
        io.emit('outData', moveObj);
    });
    socket.on('checkPhone', function(phoneObj) {
        console.log('PHONE IS', JSON.stringify(phoneObj))
        if (pendingPhoneCodes.indexOf(phoneObj.code) != -1) {
            phoneObj.valid = true;
        } else {
            phoneObj.valid = false;
        }
        io.emit('phoneCheckResult', phoneObj)
    });
    socket.on('registerPhones', function(p) {
        console.log('REGISTER PHONE SERVER', p)
        if (p.cyc) {
            //this phone is no longer 'available' for use
            pendingPhoneCodes.splice(pendingPhoneCodes.indexOf(p.cyc), 1);
            console.log('registering cyc', p.cyc)
            io.emit('regPhone', {
                u: p.desk,
                name: p.cyc,
                role: 'cyc'
            })
        }
        if (p.col) {
            //this phone is no longer 'available' for use
            pendingPhoneCodes.splice(pendingPhoneCodes.indexOf(p.col), 1);
            console.log('registering col', p.col)
            io.emit('regPhone', {
                u: p.desk,
                name: p.col,
                role: 'col'
            })
        }
        if (p.joy) {
            pendingPhoneCodes.splice(pendingPhoneCodes.indexOf(p.joy), 1);
            io.emit('regPhone', {
                name: p.joy,
                u: p.desk,
                role: 'joy'
            })
        }
    });
    socket.on('pRegisterPhones', function(p) {
        pendingPhoneCodes.splice(pendingPhoneCodes.indexOf(p.joy), 1);
        io.emit('regPhone', {
            name: p.joy,
            u: p.desk,
            role: 'joy'
        })
    })
    socket.on('phoneOri', function(ori) {
        //just pipe thru to front end 
        io.emit('oriToDesk', ori);
    })
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
