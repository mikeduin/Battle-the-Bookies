angular
  .module('battleBookies')
  .controller('MainController', MainController)
  .filter('mlFormat', mlFormat)
  .filter('payoutFilter', payoutFilter)

function mlFormat () {
  return function (ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }
}

function payoutFilter () {
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
