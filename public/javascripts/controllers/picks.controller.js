angular
  .module('battleBookies')
  .controller('PickController', ['oddsService', PickController])

function PickController (oddsService) {
  var vm = this;
  vm.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  vm.pick = {};
  vm.mlbLines = [];
  vm.mlbResults = [];
  vm.daysOfGames = [];
  vm.pick.activeGame = {};
  vm.pick.activePick = {};
  vm.pick.activeLine = {};
  vm.pick.activePayout = {};
  vm.pick.username = "mikeduin";
  vm.sortOrder = "MatchTime";
  vm.getMlbLines = getMlbLines;
  vm.getMlbResults = getMlbResults;
  vm.getTodayGames = getTodayGames;
  vm.getDates = getDates;
  vm.getResult = getResult;
  vm.updateOdds = updateOdds;
  vm.updateResults = updateResults;
  vm.submitPick = submitPick;
  vm.timeCheck = timeCheck;
  vm.awaySpread = awaySpread;
  vm.homeSpread = homeSpread;
  vm.awayML = awayML;
  vm.homeML = homeML;
  vm.totalOver = totalOver;
  vm.totalUnder = totalUnder;
  // vm.checkActiveStatus = checkActiveStatus;
  vm.displayPayCalc = displayPayCalc;
  vm.activePayCalc = activePayCalc;
  vm.mlFormat = mlFormat;

  function getMlbLines() {
    oddsService.getMlbLines().then(function(lines){
      vm.mlbLines = lines;
    })
  };

  function getMlbResults() {
    oddsService.getMlbResults().then(function(results){
      vm.mlbResults = results;
    })
  }

  function getTodayGames () {
    oddsService.getTodayGames().then(function(lines){
      vm.mlbLines = lines;
    })
  };

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

  function getResult (game) {
    oddsService.getResult(game.EventID).then(function(result){
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      game.status;
      function checkStatus (result) {
        if(result.Final === true) {
          game.status = "In Progress"
        } else {
          game.status = "Final"}
        };
      checkStatus(result);
    })
  }

  function updateOdds () {
    oddsService.updateOdds().then(function(){
      console.log("odds updated")
    })
  };

  function updateResults () {
    oddsService.updateResults().then(function(){
      console.log("results updated")
    })
  };

  function submitPick () {
    oddsService.submitPick(vm.pick).then(function(){
      console.log('pick submitted!');
      vm.pick.activeGame = {};
    });
  };

  function timeCheck (game) {
    if(moment(game.MatchTime).isBefore(moment())) {
      game.locked = true;
    }
  }

  function awaySpread (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.PointSpreadAwayLine;
    vm.pick.activePick = (game.AwayAbbrev + ' ' +      vm.mlFormat(game.PointSpreadAway));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadAwayLine);
    vm.pick.pickType = "Away Spread";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadAwayLine);
  }

  function homeSpread (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.PointSpreadHomeLine;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.PointSpreadHome));
    vm.pick.activePayout = vm.activePayCalc(game.PointSpreadHomeLine);
    vm.pick.pickType = "Home Spread";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.PointSpreadHomeLine);
  }

  function awayML (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineAway;
    vm.pick.activePick = (game.AwayAbbrev + ' ' + vm.mlFormat(game.MoneyLineAway));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineAway);
    vm.pick.pickType = "Away Moneyline";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineAway);
  }

  function homeML (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activeLine = game.MoneyLineHome;
    vm.pick.activePick = (game.HomeAbbrev + ' ' + vm.mlFormat(game.MoneyLineHome));
    vm.pick.activePayout = vm.activePayCalc(game.MoneyLineHome);
    vm.pick.pickType = "Home Moneyline";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.MoneyLineHome);
  }

  function totalOver (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' O' + game.TotalNumber);
    vm.pick.activeLine = game.OverLine;
    vm.pick.activePayout = vm.activePayCalc(game.OverLine);
    vm.pick.pickType = "Total Over";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.OverLine);
  }

  function totalUnder (game) {
    vm.pick.activeGame = game.EventID;
    vm.pick.activePick = (game.AwayAbbrev + '/' + game.HomeAbbrev + ' U' + game.TotalNumber);
    vm.pick.activeLine = game.UnderLine;
    vm.pick.activePayout = vm.activePayCalc(game.UnderLine);
    vm.pick.pickType = "Total Under";
    game.pick = vm.pick.activePick;
    game.displayPayout = vm.displayPayCalc(game.UnderLine);
  }
  //
  // function checkActiveStatus (game) {
  //   console.log('hello');
  //   if (vm.pick.activeGame === game.EventID) {
  //     game.pick = vm.pick.activePick;
  //     game.displayPayout = vm.displayPayCalc(vm.pick.activePayout)
  //   };
  // }

  function displayPayCalc (line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line).toFixed(2)
    };
    return payout
  };

  function activePayCalc (line) {
    var payout;
    if (line < 0) {
      payout = (10000 / -line)
    } else {
      payout = line
    };
    return payout
  };

  function mlFormat (ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }
}
