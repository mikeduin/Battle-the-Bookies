angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', ResultController])

function ResultController (oddsService, picksService, resultsService) {
  var vm = this;
  vm.gameDayFilter = moment().format('MMMM Do, YYYY');
  vm.matchTimeFilter;
  vm.daysOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
  vm.sortOrder = "MatchTime";
  vm.sortOrderTwo = "EventID"
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getResult = getResult;
  vm.resultChecker = resultChecker;
  vm.getDates = getDates;
  vm.activeUserSumToday;
  vm.picks = [];
  vm.users = [
    {
      username: "mikeduin"
    },
    {
      username: "seanstokke"
    }
  ];
  vm.matchTimePull = function(time) {
    vm.matchTimeFilter = time
  }

  vm.sumToday = function(user) {
    username = user.username;
    // console.log(user);
    setTimeout(function() {
      console.log(vm.matchTimeFilter);
      picksService.sumToday(username, vm.matchTimeFilter).then(function(result){
        console.log("total returned is " + result);
        user.sumToday = result
    }, 3000)

    })
  }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      console.log("total returned is " + result);
      user.sumYtd = result
    })
  }

  vm.pickSettle = function(pick) {
    if (pick.pickResult === "win") {
      pick.dollars = pick.activePayout
    } else if (pick.pickResult === "loss") {
      pick.dollars = -100
    } else {
      null
    }
  }

  vm.updateDollars = function(){
    picksService.updateDollars().then(function(){
      console.log('res controller says update dollars')
    })
  }

  function getMlbLines (){
    oddsService.getMlbLines().then(function(games){
      console.log(games)
      vm.mlbLines = games;
    })
  }

  function updateResults () {
    resultsService.updateResults().then(function(){
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
    resultsService.getResult(game.EventID).then(function(result){
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
          resultObj.homeMLBinary = 1;
          resultObj.awayMLResult = "loss";
          resultObj.awayMLBinary = 0;
        } else {
          resultObj.homeMLResult = "loss";
          resultObj.homeMLBinary = 0;
          resultObj.awayMLResult = "win";
          resultObj.awayMLBinary = 1;
        };

        if ((game.HomeScore + game.PointSpreadHome) > game.AwayScore) {
          resultObj.homeSpreadResult = "win";
          resultObj.homeSpreadBinary = 1;
          resultObj.awaySpreadResult = "loss";
          resultObj.awaySpreadBinary = 0;
        } else {
          resultObj.homeSpreadResult = "loss";
          resultObj.homeSpreadBinary = 0;
          resultObj.awaySpreadResult = "win";
          resultObj.awaySpreadBinary = 1;
        };

        if ((game.HomeScore + game.AwayScore) > game.TotalNumber) {
          resultObj.totalOverResult = "win";
          resultObj.totalOverBinary = 1;
          resultObj.totalUnderResult = "loss";
          resultObj.totalUnderBinary = 0;
        } else {
          resultObj.totalOverResult = "loss";
          resultObj.totalOverBinary = 0;
          resultObj.totalUnderResult = "win";
          resultObj.totalUnderBinary = 1;
        }

        // console.log(resultObj);

        // picksService.updateAwayML(resultObj);
        // picksService.updateHomeML(resultObj);
        // picksService.updateAwaySpread(resultObj);
        // picksService.updateHomeSpread(resultObj);
        // picksService.updateTotalOver(resultObj);
        // picksService.updateTotalUnder(resultObj);
        // oddsService.updateStatus(result);
      }
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };

}
