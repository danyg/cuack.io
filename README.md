cuack.io
========

Socket.IO Friendly Wrapper

An easy module to create socket.io servers

##Features
- Broadcast events directly from client-side
- Easy way to implement RPC (Remote Procedure Call)
- An confortable and intituive way to make eventListeners and RPC

##How to Allow an specific event to be broadcasted directly from the client-side
An example of how to allow the event ```talk``` to be broadcasted directly from the client-side.
You can use ```talk``` or whatever you want and the quantity what you want

###Client-Side
connection to http:// location.host : 4040 /

	<script src="socket.io.min.js"></script>
	<script src="cuack.io-client.js"></script> <!-- node-modules/cuack.io/cuack.io-client/cuack.io-client.js -->
	
	<script>
		var room = new RoomClient({port:4040});
		room.on('connect', function(){
			room.broadcast('talk', 'Hello everybody!');
		});

		room.on('talk', function(fromId, arg0){ // receives at the first parameter, 
												// the socket.id of the sender, and 
												// after that all parameters sended 
												// to the method broadcast except 
												// the eventName

			console.log(fromId + ' says: ' + arg0);
		});
	</script>

###Server-Side

	var cuackIO = require('cuack.io');
	var socketIOServer = new cuackIO.ServerSocket(
		4040,  // on port 4040
		{
			roomOptions: {
				broadcastEventsAllowed: ['talk'] // you can add more than one
			}
		}
	);

##How to add a custom eventListener or RPC

###Server-Side

	var cuackIO = require('cuack.io'),
		util = require('util')
	;
		

	function MyRoomHandler(serverInstance, options){
		cuackIO.Room.apply(this, arguments);
	}

	util.inherits(MyRoomHandler, cuackIO.Room);

Add talk event to emit directly to broadcast from clientSide (another way)

	MyRoomHandler.prototype.options.broadcastEventsAllowed.push('talk');

All methods prefixed by **on** are EventListeners, and receives 1 parameter 
allways, socket, is a reference to the client socket object, socket.io 
Socket
to emit this from client you must call ```room.emit('talkWithFriend', friendID);```
denotes the difference between case in the first character of the eventName

	MyRoomHandler.prototype.onTalkWithFriend = function(socket, friendID, msg){
		this.getClient(friendID).emit('privateTalk', {
			from: socket.id,
			msg: msg
		});
	}

All methods prefixed by **rpc** are RPC methods, and receives 2 parameters 
allways, the socket and response, response is a callback where you must 
return a some value and this value will be returned to a callback in 
client-side. To call this method from the client-side you must call 
```room.rpc('setUserName', function(response){}, 'myUserName');```

	MyRoomHandler.prototype.rpcSetUserName = function(socket, response, userName){
		socket.set('username', userName, function(){
			response(true);
		});
	}

To call this method from the client-side you must call 
```room.rpc('getUserName', function(name){ console.log('my name is: ' + name); });```

	MyRoomHandler.prototype.rpcGetUserName = function(socket, response){
		socket.get('username', function(err, name){
			if(err){
				response(false);
			}else{
				response(name);
			}
		});
	}
	
With that code, you have a new class named ```MyRoomHandler``` You can use this 
class to handle all new rooms in your application, an example below

	var socketIOServer = new cuackIO.ServerSocket(
		4040,  // on port 4040
		{
			roomOptions: {
				roomHandlerConstructor: MyRoomHandler
			}
		}
	);

Now you server will use the ```MyRoomHandler``` to handle the new rooms

##How to create a room

	var socketIOServer = new cuackIO.ServerSocket(port,options);

	socketIOServer.createRoom( Room, {name: 'myChatRoom'});

###Another Examples

	socketIOServer.createRoom( SignalRoom, {name: 'mobilesSignals', signals: ['kill', 'open', 'close', 'connect']});
	socketIOServer.createRoom( NotificationsRoom, {name: 'Notifications', refreshRate: 60});
	socketIOServer.createRoom( ServerStatsRoom, {name: 'serverStats', refreshRate: 10});
	socketIOServer.createRoom( ChatRoom, {name: 'MobilesRoom'});
	socketIOServer.createRoom( ChatRoom, {name: 'GamesRoom'});
	socketIOServer.createRoom( ChatRoom, {name: 'AllTopicsRoom', allowPrivateMessages: false});

###You can create a new Room from a Room Object via RPC

	MyRoomHandler.prototype.**rpc**CreatePrivateRoom = function(socket, response, friendID){
		var created, name;

		created = this.server.createRoom(ChatRoom, {
			name: (name = 'privRoom_' + socket.id + '_' + friendID)
		});

		response({
			created: created,
			name: name
		});

		this.getClient(friendID).emit('joinTo', name); // tells to the other user the name of the new room to join it
	}

## How to use the samples in this repository
clone the repository... and...
```npm install```
```node app```
go to the browser, and types localhost/default.html

OR

```node sample```
go to the browser, and types localhost/sample.html

**default**, use the Room class, this class is very simple and it's maded to be 
extended, is not abstract because you can allow a events to be broadcasted if 
you want, and leave the complexity of your application only to the client-side 
(take care of the security in this case)

**sample**, creates an ChatRoom that allow the event ```talk``` to be broadcasted 
and adds some rpcCalls, you can call any RPC from client UI in this example with 
the below sintax
```/rPCName arg0 arg1 arg2 argN``` and enter key

both examples are a "chat client" or an intent of that, with a log panel and a 
input text zone, to send messages o RPC/commands you must press Enter with the 
textarea focused.

## RoadMap
- **Learn to write in english**
- Establish a way to inform a client to the rpc an event availables in the Room 
to advice to the programmer when emit or call an invalid event o rpc and prevents 
hacks or Floods
- documentation, documentation, documentation
- API Reference
- more samples
- drink a beer (or two)


[![Analytics](https://ga-beacon.appspot.com/UA-47717226-1/cuack.io/home)](https://github.com/igrigorik/ga-beacon)
