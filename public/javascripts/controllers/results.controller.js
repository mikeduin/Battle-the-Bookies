angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', ResultController])

function ResultController (oddsService, picksService) {
  var vm = this;
  vm.gameDayFilter = moment().format('MMMM Do, YYYY');
  vm.daysOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
  vm.sortOrder = "MatchTime";
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getResult = getResult;
  vm.resultChecker = resultChecker;
  vm.getDates = getDates;
  vm.picks = [];
  vm.users = [
    {
      username: "mikeduin",
      ytd: 1546.98,
      today: 245.69
    },
    {
      username: "seanstokke",
      ytd: 598.35,
      today: -100.59
    }
  ];

  vm.pickSettle = function(pick) {
    if (pick.pickResult === "win") {
      pick.dollars = pick.activePayout
    } else if (pick.pickResult === "loss") {
      pick.dollars = -100
    } else {
      null
    }
  }


  function getMlbLines (){
    oddsService.getMlbLines().then(function(games){
      // console.log(games)
      vm.mlbLines = games;
    })
  }

  function updateResults () {
    oddsService.updateResults().then(function(){
      console.log("results updated")
    })
  };

  function getPicks () {
    oddsService.getPicks().then(function(data){
      vm.picks = data;
      // console.log(vm.picks);
    })
  }

  function resultChecker (game) {
    console.log(game);
    // console.log(game.EventID + game.GameStatus);
    if (game.GameStatus !== "Final") {
      vm.getResult(game);
    }
  }

  function getResult (game) {
    oddsService.getResult(game.EventID).then(function(result){
      console.log("result " + result[0].EventID + result[0].Final);
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      if (result[0].Final === true) {
        var resultObj = {};
        resultObj.EventID = game.EventID;
        resultObj.HomeTeam = game.HomeTeam;
        resultObj.AwayTeam = game.AwayTeam;

        if (game.HomeScore > game.AwayScore) {
          resultObj.homeMLResult = "win";
          resultObj.awayMLResult = "loss";
        } else {
          resultObj.homeMLResult = "loss";
          resultObj.awayMLResult = "win";
        };

        if ((game.HomeScore + game.PointSpreadHome) > game.AwayScore) {
          resultObj.homeSpreadResult = "win";
          resultObj.awaySpreadResult = "loss";
        } else {
          resultObj.homeSpreadResult = "loss";
          resultObj.awaySpreadResult = "win";
        };

        if ((game.HomeScore + game.AwayScore) > game.TotalNumber) {
          resultObj.totalOverResult = "win";
          resultObj.totalUnderResult = "loss";
        } else {
          resultObj.totalOverResult = "loss";
          resultObj.totalUnderResult = "win";
        }

        // console.log(resultObj);

        // picksService.updateAwayML(resultObj);
        // picksService.updateHomeML(resultObj);
        picksService.updateAwaySpread(resultObj);
        picksService.updateHomeSpread(resultObj);
        picksService.updateTotalOver(resultObj);
        // picksService.updateTotalUnder(resultObj);
        oddsService.updateStatus(result);
      }
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

}
