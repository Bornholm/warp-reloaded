var _ = require('lodash');

/* Variable globale "gameContext", voir GameManager._getBotAPI */

exports.api = {

  attack: function(botName) {
    var bot = _.find(gameContext.world.bots, {name: botName});
    if(bot) {
      bot.life -= 1;
    }
  },

  scan: function() {
    return _.pluck(gameContext.world.bots, 'name');
  },

  // Utilitaires

  getCurrentTurn: function() {
    return gameContext.currentTurn;
  },

  // Fonction de "logging"
  log: function() {
    gameContext.logs.push.apply(gameContext.logs, arguments);
  },

  // Overwrite default API

  runTask: null,
  exit: null,

  endTurn: function() {
    connection.write(JSON.stringify(gameContext) + '\u0000\u0000');
  }

};
