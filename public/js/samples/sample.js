/**
 * @overview 
 * @author Daniel Goberitz <dalgo86@gmail.com>
 */

(function($){

	function addChatLine(from, msg){
		$('<li>')
			.append(
				$('<strong>')
					.text(from + ': ')
			)
			.append(
				$('<span>')
					.text(msg)
			)
			.appendTo('#chat')
		;
	}
	
	function processRPCCommand(str){
		var result = str.match(/\/([\w]*)(\s(.*))?/),
			cmd,
			args = []
		;
		
		if(undefined === result[1]){
			return;
		}
		cmd = result[1];
		if(undefined !== result[3]){
			args = result[3].split(' ');
		}
		
		args.reverse();
		args.push(function(response){
			addChatLine('SERVER', response);
		});
		args.push(cmd);
		args.reverse();
		
		room.rpc.apply(room, args);
	}

	$(document).ready(function(){

		window.room = new RoomClient({port: 4040});
		
		room.on('connect', function(){
			console.log('I\'m connected', arguments);
			room.broadcast('talk', 'Hi I\'m Connected');
			addChatLine('MySelf', 'Hi I\'m Connected');
			
			room.rpc('getOsSystem', function(osString){

				addChatLine('SERVER', osString);

			});

		});

		room.on('talk', function(fromId, msg){
			console.log('talk IN:', arguments);
			addChatLine(fromId, msg);
		});
		
		

		$('#input').keydown(function(e){
			if(e.keyCode === 13){
				var elm = $(this);
				
				if(elm.val().charAt(0) === '/'){
					processRPCCommand(elm.val());
				}else{
					room.broadcast('talk', elm.val());
					addChatLine('MySelf', elm.val());
				}
				elm.val('');

				e.preventDefault();
			}
		});
	});

}(jQuery));
