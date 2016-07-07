angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', '$scope', ResultController])

function ResultController (oddsService, picksService, resultsService, $scope) {
  var vm = this;
  vm.matchDayFilter = moment().format('MMMM Do, YYYY');
  vm.dateNumbFilter;
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
      username: "mikeduin",
    },
    {
      username: "seanstokke"
    }
  ];

  vm.matchTimePull = function(time) {
    vm.dateNumbFilter = moment(time).format('YYYYMMDD')
  }

  vm.sumToday = function(user, datenumb) {
    username = user.username;
    console.log('datenumb in controller is ' + datenumb);
    picksService.sumToday(username, vm.matchTimeFilter).then(function(result){
      console.log("total returned is " + result);
      user.sumToday = result
  })

  }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      console.log("returned from sumAllPicks is " + result);
      user.sumYtd = result.totalDollars
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
      console.log(vm.picks);
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
      // console.log("result " + result[0].EventID + result[0].Final);
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      if (result[0].Final === true) {
        // var finalObj = {};
        // finalObj.EventID = game.EventID;
        // finalObj.HomeTeam = game.HomeTeam;
        // finalObj.AwayTeam = game.AwayTeam;
        //
        // if (game.HomeScore > game.AwayScore) {
        //   finalObj.homeMLResult = "win";
        //   finalObj.homeMLBinary = 1;
        //   finalObj.awayMLResult = "loss";
        //   finalObj.awayMLBinary = 0;
        // } else {
        //   finalObj.homeMLResult = "loss";
        //   finalObj.homeMLBinary = 0;
        //   finalObj.awayMLResult = "win";
        //   finalObj.awayMLBinary = 1;
        // };
        //
        // if ((game.HomeScore + game.PointSpreadHome) > game.AwayScore) {
        //   finalObj.homeSpreadResult = "win";
        //   finalObj.homeSpreadBinary = 1;
        //   finalObj.awaySpreadResult = "loss";
        //   finalObj.awaySpreadBinary = 0;
        // } else {
        //   finalObj.homeSpreadResult = "loss";
        //   finalObj.homeSpreadBinary = 0;
        //   finalObj.awaySpreadResult = "win";
        //   finalObj.awaySpreadBinary = 1;
        // };
        //
        // if ((game.HomeScore + game.AwayScore) > game.TotalNumber) {
        //   finalObj.totalOverResult = "win";
        //   finalObj.totalOverBinary = 1;
        //   finalObj.totalUnderResult = "loss";
        //   finalObj.totalUnderBinary = 0;
        // } else {
        //   finalObj.totalOverResult = "loss";
        //   finalObj.totalOverBinary = 0;
        //   finalObj.totalUnderResult = "win";
        //   finalObj.totalUnderBinary = 1;
        // }

        // console.log(finalObj);
        //
        // picksService.updateAwayML(finalObj);
        // picksService.updateHomeML(finalObj);
        // picksService.updateAwaySpread(finalObj);
        // picksService.updateHomeSpread(finalObj);
        // picksService.updateTotalOver(finalObj);
        // picksService.updateTotalUnder(finalObj);
        oddsService.updateStatus(result);
      }
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };

}
