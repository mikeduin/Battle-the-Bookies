angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', 'picksService', 'resultsService', 'usersService', '$scope', '$timeout', ResultController])

function ResultController (oddsService, picksService, resultsService, usersService, $scope, $timeout) {
  var vm = this;
  vm.matchDayFilter;
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
  vm.getDates = getDates;
  vm.activeUserSumToday;
  vm.picks = [];
  vm.users = [];
  // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
  //   vm.showSpinner = false;
  // })
  $timeout(function(){
    vm.showSpinner = false
  }, 10000)

  vm.checkTime = function(gametime) {
    if (moment(gametime).isBefore(vm.currentTime)){
      return true
    } else {
      return false
    }
  }

  vm.currentTime = moment().format();
  console.log('current time is ', vm.currentTime);

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  }

  vm.matchTimePull = function(time) {
    vm.dateNumbFilter = moment(time).format('YYYYMMDD')
  }

  vm.sumDay = function(user, datenumb) {
    username = user.username;
    return picksService.sumToday(username, datenumb).then(function(result){
      // console.log("total returned in controller is " + result);
      return result;
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
    } else if (pick.pickResult === "push"){
      pick.dollars = 0
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
    vm.showSpinner = true;
    oddsService.getMlbLines().then(function(games){
      console.log(games);
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
      console.log(vm.picks);
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
      var dateArray = vm.daysOfGames;
      var lastDay = dateArray[dateArray.length - 1];
      var currentDay = moment().format('MMMM Do, YYYY');
      var currentDateNumb = moment().format('YYYYMMDD');
      // console.log("last day is ", lastDay);
      // console.log("current day is ", currentDay);
      vm.matchDayFilter = currentDay;
      // vm.dateNumbFilter = currentDateNumb;
    })
  };

}
