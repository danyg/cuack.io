/**
 * @overview 
 * @author Daniel Goberitz <dalgo86@gmail.com>
 */

(function(){

	if(undefined === window){
		var io = require('socket.io-client');
	}

	var genUIDCounter=0,
		RoomClient = function(options){
			var url = this._getUrl(options);
			this.socket = (undefined === io ? window.io : io).connect(url);
		};
	
	RoomClient.prototype._genUID = function(){
		return ++genUIDCounter;
	}

	RoomClient.prototype._getUrl = function(options){
		var url='';

		if(undefined !== window){
			if(undefined === options.https){
				url = window.location.protocol + '//';
			}else if(options.https === true){
				url = 'https://';
			}else{
				url = 'http://';			
			}

			if(undefined === options.host){
				url += window.location.host
			}else{
				url += options.host;
			}

			if(undefined !== options.port){
				url += ':' + options.port
			}

			url += '/';
		}else{
			if(options.https === true){
				url = 'https://';
			}else{
				url = 'http://';			
			}

			if(undefined !== options.host){
				url += options.host;
			}else{
				throw 'You must set host in RoomClient options';
			}

			if(undefined !== options.port){
				url += ':' + options.port
			}

			url += '/';
		}

		if(undefined !== options.roomName){
			url += options.roomName
		}

		return url;
	}

	RoomClient.prototype.on = function(){
		return this.socket.on.apply(this.socket, arguments);
	}

	RoomClient.prototype.emit = function(){
		return this.socket.emit.apply(this.socket, arguments);
	}

	RoomClient.prototype.broadcast = function(){
		var args = Array.prototype.slice.call(arguments,0);
		args.reverse();
		args.push('broadcast');
		args.reverse();

		return this.socket.emit.apply(this.socket, args);
	}

	/**
	 * @desc Makes a rpc Callback, receives the server response via callback
	 * 
	 * @param {String} rpcName Name of the rpcMethod defined
	 * @param {Function} callback, the callback where the call will receives, 
	 *					function(response){}
	 * @param {...mix} args Arguments to send to the rpc method
	 * 
	 * @throwable
	 */
	RoomClient.prototype.rpc = function(rpcName, callback){
		var cbkID = this._genUID(),
			args = Array.prototype.slice.call(arguments,2),
			ret
		;
		args.reverse();
		args.push(cbkID);
		args.push(rpcName);
		args.reverse();

		if('function' != typeof(callback)){
			throw 'The callback argument must be a Function';
		}

		this.socket.on(rpcName + '_r_' + cbkID, callback);

		ret = this.socket.emit.apply(this.socket, args);
		
		
		
		return ret;
	}
	
	if(undefined === window){
		module.exports = RoomClient;
	}else{
		window.RoomClient = RoomClient;
	}

}());
