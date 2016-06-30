angular
  .module('battleBookies')
  .controller('MainController', MainController)
  .controller('AuthController', AuthController)
  .controller('PickController', ['oddsService', PickController])
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

function AuthController () {
  var vm = this;
}

function PickController (oddsService) {
  var vm = this;
  vm.pick = {};
  vm.MLBLines = {};
  vm.pick.activeGame = {};
  vm.pick.activePick = {};
  vm.pick.activeLine = {};
  vm.pick.activePayout = {};

  vm.submitPick = function() {
    oddsService.submitPick(vm.pick).then(function(){
      vm.pick = {};
      console.log('pick submitted!')
    })
  };

  vm.awaySpread = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = vm.mlFormat(game.PointSpreadAwayLine);
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.PointSpreadAway));
    vm.pick.activePayout = vm.payoutCalc(game.PointSpreadAwayLine);
    vm.pick.pickType = "Away Spread";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.homeSpread = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = vm.mlFormat(game.PointSpreadHomeLine);
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.PointSpreadHome));
    vm.pick.activePayout = vm.payoutCalc(game.PointSpreadHomeLine);
    vm.pick.pickType = "Home Spread";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.awayML = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = vm.mlFormat(game.MoneyLineAway);
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.pick.activeLine);
    vm.pick.activePayout = vm.payoutCalc(game.MoneyLineAway);
    vm.pick.pickType = "Away Moneyline";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.homeML = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = vm.mlFormat(game.MoneyLineHome);
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.pick.activeLine);
    vm.pick.activePayout = vm.payoutCalc(game.MoneyLineHome);
    vm.pick.pickType = "Home Moneyline";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.totalOver = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' O' + game.TotalNumber);
    vm.pick.activeLine = vm.mlFormat(game.OverLine);
    vm.pick.activePayout = vm.payoutCalc(game.OverLine);
    vm.pick.pickType = "Total Over";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.totalUnder = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' U' + game.TotalNumber);
    vm.pick.activeLine = vm.mlFormat(game.UnderLine);
    vm.pick.activePayout = vm.payoutCalc(game.UnderLine);
    vm.pick.pickType = "Total Under";
    game.pick = vm.pick.activePick;
    game.activePayout = vm.pick.activePayout;
  }

  vm.payoutCalc = function(line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line)
    };
    return payout
  };

  vm.mlFormat = function(ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }

  vm.getMLBLines = function() {
    oddsService.getMLBLines().then(function(lines){
      vm.MLBLines = lines;
    })
  };

  vm.getTodayGames = function() {
    oddsService.getTodayGames().then(function(lines){
      vm.MLBLines = lines;
    })
  };

  vm.updateDb = function() {
    oddsService.updateDb().then(function(){
      console.log("db updated")
    })
  };
}
