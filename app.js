var fs = require('fs');
var async = require('async');
var GameManager = require('./lib/game-manager');

var gm = new GameManager();

gm.addBot({
  sourceCode: fs.readFileSync(__dirname + '/bots/r2d2.js', 'utf8'),
  name: 'R2D2',
  life: 10
});

gm.addBot({
  sourceCode: fs.readFileSync(__dirname + '/bots/c3po.js', 'utf8'),
  name: 'C3PO',
  life: 10
});

// On fait 10 tours
async.timesSeries(10, function(n, next) {
  return gm.nextTurn(next);
});
