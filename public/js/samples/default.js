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

	$(document).ready(function(){

		var room = new RoomClient({port: 4040});
		
		room.on('connect', function(){
			console.log('I\'m connected', arguments);
			room.broadcast('talk', 'Hi I\'m Connected');
			addChatLine('MySelf', 'Hi I\'m Connected');
		});

		room.on('talk', function(fromId, msg){
			console.log('talk IN:', arguments);
			addChatLine(fromId, msg);
		});

		$('#input').keydown(function(e){
			if(e.keyCode === 13){
				var elm = $(this);
				room.broadcast('talk', elm.val());
				addChatLine('MySelf', elm.val());
				elm.val('');

				e.preventDefault();
			}
		});
	});

}(jQuery));
