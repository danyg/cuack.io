/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	events = require('events'),
	socketIO = require('socket.io')
;

var app = express();

app.configure(function(){
//	app.set('port', process.env.PORT || 80);
	app.set('port', 80);
	app.use(express.compress());
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('sdfg978s9dfg8s9df99g98s'));
	app.use(express.session());
	app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var cuackIO = require('cuack.io');

cuackIO.Room.prototype.options.broadcastEventsAllowed.push('talk', 'iam', 'somebodyHere');

var server = http.createServer(app);
var socketIOServer = new cuackIO.ServerSocket(4040);

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});