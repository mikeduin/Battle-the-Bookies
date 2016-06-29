angular
  .module('battleBookies')
  .controller('MainController', MainController)
  .controller('AuthController', AuthController)
  .controller('PickController', ['oddsService', PickController])
  .filter('mlFormat', mlFormat)
  .filter('payout', payout)

function mlFormat () {
  return function (ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }
}

function payout () {
  return function (line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line)
    };
    return payout
  }
}


function MainController () {
  var vm = this;
  vm.name = 'mike';
}

function AuthController () {
  var vm = this;
}

function PickController (oddsService) {
  var vm = this;
  vm.MLBLines = {};

  vm.payoutCalc = function(vig) {
    var payout;
    if (vig < 0) {
      payout = (100 / vig)
    } else {
      payout = (100 * vig)
    };
    return payout
  };

  vm.getMLBLines = function() {
    oddsService.getMLBLines().then(function(lines){
      vm.MLBLines = lines;
    })
  }
}
