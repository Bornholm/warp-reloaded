var SandCastle = require('sandcastle').SandCastle;
var async = require('async');
var fs = require('fs');

var CORE_API = fs.readFileSync(__dirname + '/game-api.js', 'utf8');

function GameManager(opts) {
  this._currentTurn = 0;
  this._world = {
    bots: []
  };
}

module.exports = GameManager;

var p = GameManager.prototype;

p.addBot = function(bot) {
  this._world.bots.push(bot);
};

p.nextTurn = function(cb) {

  var self = this;
  var bots = this._world.bots;

  console.log('New turn', this._currentTurn);

  async.forEachSeries(bots, executeBotScript, onTurnEnd);

  function executeBotScript(bot, next) {

    console.log('executing bot script', bot.name);

    var sandcastle = new SandCastle({
      timeout: 2000,
      memoryLimitMB: 20,
      api: self._getBotAPI(bot)
    });

    var sourceCode = bot.sourceCode;
    var script = sandcastle.createScript('"use strict";\n' + sourceCode);

    script.on('error', onError);
    script.on('timeout', onError);
    script.on('exit', onExit);

    script.run('executeTurn();endTurn');

    function clearSandbox() {
      script.removeAllListeners();
      sandcastle.kill();
    }

    function onError(err) {
      clearSandbox();
      console.error('Error:', err.message, err.stack);
      return next();
    }

    function onExit(err, gameContext) {
      clearSandbox();
      if(err) {
        console.error('Error:', err.message, err.stack);
      } else {
        // Si pas d'erreur, on met à jour l'état du "monde" après l'exécution des actions du bot
        self._world = gameContext.world;
      }
      console.log('gameContext after bot actions:', gameContext);
      return next();
    }

  }

  function onTurnEnd(err) {
    console.log('Turn end');
    self._currentTurn++;
    if(typeof cb === 'function') {
      return cb(err);
    }
  }

};

// Retourne l'API accessible au Bot dans son code sous la forme d'une chaine de caratères
p._getBotAPI = function(bot) {
  var gameContext = {
    bot: bot,
    currentTurn: this._currentTurn,
    world: this._world,
    logs: []
  };
  var apiStr = 'var gameContext = ' + JSON.stringify(gameContext) + ';\n';
  apiStr += CORE_API;
  return apiStr;
};
