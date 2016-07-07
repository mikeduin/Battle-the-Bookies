angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope) {
  var vm = this;
  vm.matchDayFilter = moment().format('MMMM Do, YYYY');
  vm.dateNumbFilter;
  vm.daysOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
  vm.updatePicks = updatePicks;
  vm.gameSort = "MatchTime";
  vm.gameSortTwo = "EventID";
  vm.userSort = "-sumYtd";
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getResult = getResult;
  vm.resultChecker = resultChecker;
  vm.getDates = getDates;
  vm.activeUserSumToday;
  vm.picks = [];
  vm.users = [];

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  }

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

  function updatePicks() {
    picksService.updatePicks();
  }

  function updateResults () {
    resultsService.updateResults().then(function(){
    })
  };

  function getPicks () {
    oddsService.getPicks().then(function(data){
      vm.picks = data;
      // console.log(vm.picks);
    })
  }

  function resultChecker (game) {
    // console.log(game);
    // console.log(game.EventID + game.GameStatus);
    if (game.GameStatus !== "Final") {
      vm.getResult(game);
    }
  }

  function getResult (game) {
    resultsService.getResult(game.EventID).then(function(result){
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      if (result[0].Final === true) {
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
