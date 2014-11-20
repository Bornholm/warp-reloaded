
exports.executeTurn = function() {

  log('Bilibip!');

  var enemies = scan();

  if(enemies) {

    enemies.forEach(function(botName) {
      attack(botName);
    });

  }

};
