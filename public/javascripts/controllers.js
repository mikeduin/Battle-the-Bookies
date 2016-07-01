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
  vm.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  vm.pick = {};
  vm.mlbLines = [];
  vm.daysOfGames = [];
  vm.pick.activeGame = {};
  vm.pick.activePick = {};
  vm.pick.activeLine = {};
  vm.pick.activePayout = {};
  vm.pick.username = "mikeduin";
  vm.sortOrder = "-MatchTime";

  vm.getMlbLines = function() {
    oddsService.getMlbLines().then(function(lines){
      vm.mlbLines = lines;
    })
  };

  vm.getTodayGames = function() {
    oddsService.getTodayGames().then(function(lines){
      vm.mlbLines = lines;
    })
  };

  vm.getDates = function() {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

  vm.updateDb = function() {
    oddsService.updateDb().then(function(){
      console.log("db updated")
    })
  };

  vm.submitPick = function() {
    oddsService.submitPick(vm.pick).then(function(){
      console.log('pick submitted!');
      vm.pick.activeGame = {};
    });
  };

  vm.timeCheck = function(game) {
    if(moment(game.MatchTime).isBefore(moment())) {
      game.locked = true;
    }
  }

  vm.awaySpread = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.PointSpreadAwayLine;
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.PointSpreadAway));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadAwayLine);
    vm.pick.pickType = "Away Spread";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadAwayLine);
  }

  vm.homeSpread = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.PointSpreadHomeLine;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.PointSpreadHome));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadHomeLine);
    vm.pick.pickType = "Home Spread";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadHomeLine);
  }

  vm.awayML = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineAway;
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.MoneyLineAway));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineAway);
    vm.pick.pickType = "Away Moneyline";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineAway);
  }

  vm.homeML = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineHome;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.MoneyLineHome));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineHome);
    vm.pick.pickType = "Home Moneyline";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineHome);
  }

  vm.totalOver = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' O' + game.TotalNumber);
    vm.pick.activeLine = game.OverLine;
    vm.pick.activePayout = vm.activePayCalc(game.OverLine);
    vm.pick.pickType = "Total Over";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.OverLine);
  }

  vm.totalUnder = function(game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' U' + game.TotalNumber);
    vm.pick.activeLine = game.UnderLine;
    vm.pick.activePayout = vm.activePayCalc(game.UnderLine);
    vm.pick.pickType = "Total Under";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.UnderLine);
  }

  vm.displayPayCalc = function(line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line)
    };
    return payout
  };

  vm.activePayCalc = function(line) {
    var payout;
    if (line < 0) {
      payout = (10000 / -line)
    } else {
      payout = line
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

}
