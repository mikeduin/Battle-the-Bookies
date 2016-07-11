angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', 'usersService', StandingsController])

function StandingsController (picksService, oddsService, usersService) {
  var vm = this;
  vm.getDates = getDates;
  vm.getDateNumbs = getDateNumbs;
  vm.daysOfGames = [];
  vm.dateNumbs = [];
  vm.dayArrayLength;
  vm.pageArray = [1];
  vm.activePage = 1;
  vm.pageView;
  vm.sortOrder = "-sumYtd";
  vm.users = [];
  vm.username = "mikeduin";
  vm.user = {};
  vm.dailyStats = [];

  vm.getDailyStats = function(user){
    username = user.username;
    picksService.getDailyStats(username).then(function(result){
      console.log(result.data);
      vm.dailyStats = result.data
    })
  }

  vm.updateDailys = function(){
    picksService.updateDailys();
  }

  vm.getAllUsers = function(){
    usersService.getAllUsers().then(function(result){
      vm.users = result
    })
  }

  // vm.sumDayPicks = function(user, datenumb) {
  //   user.results = {};
  //   // var userResults = user.results;
  //   username = user.username;
  //   // console.log('datenumb in controller is ' + datenumb);
  //   picksService.sumToday(username, datenumb).then(function(result){
  //     // console.log("datenumb is " + datenumb);
  //     // console.log("total returned is " + result);
  //     user.results.datenumb = result;
  //     // user.results = userResults;
  //     // console.log(user.results);
  //   })
  // }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      // console.log(result);
      user.sumYtd = result.totalDollars;
      user.ytdW = result.totalW;
      user.ytdL = result.totalG - result.totalW;
      user.ytdPct = result.totalW / result.totalG;
    }).then(function(){
      console.log(user);
      username = user.username;
      picksService.getDailyStats(username).then(function(result){
        user.dailyStats = result.data
      })
    })
  }

  vm.pageClick = function (i) {
    vm.activePage = i;
    vm.standingsView();
  }

  vm.standingsView = function () {
    vm.pageView = 4*(vm.activePage -1)
  }

  vm.pageUp = function() {
    vm.activePage += 1;
    vm.standingsView();
  }

  vm.pageDown = function() {
    vm.activePage -= 1;
    vm.standingsView();
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      // console.log(dates);
      vm.daysOfGames = dates;
      vm.dayArrayLength = dates.length;
    }).then(function(){
      getPageArray(vm.daysOfGames)
    })
  };

  function getDateNumbs () {
    oddsService.getDateNumbs().then(function(dates){
      console.log("datenumbs are: " + dates);
      vm.dateNumbs = dates;
    })
  };

  function getPageArray (games) {
    var pageArray = [1];
    for (i = 1; i<games.length; i++) {
      if ((i % 4) === 0) {
        pageArray.push((i/4)+1)
      }
    }
    vm.pageArray = pageArray;
  }
}
