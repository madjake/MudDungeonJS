  "use strict";

  var modules = {
      helper: require('../helpers').helpers,
      loadPlayerLocation: require('../loadRoom').playerLocation,
      world: {
        valston: require('../../World/valston/prison')
      }
  };

  var  players = [];

  function removeByValue(arr, val) {
    for(var i=0; i < arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

  exports.playerManager = {

	  loadPlayer: function(socket, playerData) {

          var playerData = JSON.parse(playerData);

          modules.helper.send(socket,'Whats your password');

          socket.once('data', function (input) {

              var password = input.toString().trim().toLowerCase();

              if (password === playerData.password) {

                  socket.emit('playerLocation.loadRoom', modules.loadPlayerLocation.loadRoom(socket, playerData));
              } else {
                  modules.helper.send(socket, 'Password is wrong');
                  exports.playerManager.loadPlayer(socket, JSON.stringify(playerData));
              }
          });
      },

			  /**
  * Remove player socket from players array
  * @param player - player socket
  */
  removePlayer: function(player) {
    removeByValue(players, player);
    player.end();
  },

	/**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  addPlayer: function (player)
	{
	 players.push(player);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  addPlayerToRoom: function (player, playerInfo, region, area, areaId)
	{
  var room = modules['world'][region][area][areaId];

	 room.players.push(player, playerInfo);

	},
  /**
	 * Add player socket to players array
	 *  @param player - player socket
	 */
  removePlayerFromRoom: function (player, playerInfo, region, area, areaId)
	{
  var room = modules['world'][region][area][areaId];

  removeByValue(room.players, player);

	},
  /**
  	 * Returns each player socket from players array
  	 * @param callback returns player sockets from array
  	 */
   each: function (callback)
  	{
  		players.forEach(callback);
  	},

	/**
	 * Broadcast a message to every player
	 * @param string message to broadcast to everyone
	 */
	broadcast: function (message)
	{

   exports.playerManager.each(function (player)
		{
            modules.helper.send(player, message);
		});
	},

  /**
   * Broadcast a message to every player
   * @param string message to broadcast to everyone
   */
  broadcastToRoom: function (message)
  {

   exports.playerManager.each(function (player)
    {
            modules.helper.send(player, message);
    });
  }


};
