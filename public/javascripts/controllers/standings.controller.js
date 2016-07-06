angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', StandingsController])

function StandingsController (picksService, oddsService) {
  var vm = this;
  vm.getDates = getDates;
  vm.daysOfGames = [];
  vm.dayArrayLength;
  vm.pageArray = [1];
  vm.activePage = 1;
  vm.pageView;
  vm.users = [
    {
      username: "mikeduin",
      buyin: 200
    },
    {
      username: "seanstokke",
      buyin: 200
    }
  ];

  vm.sumDayPicks = function(user) {
    username = user.username;
    // console.log(user);
    console.log(vm.matchTimeFilter);
    picksService.sumToday(username, vm.matchTimeFilter).then(function(result){
      console.log("total returned is " + result);
      user.sumToday = result
    })

  }

  vm.sumAllPicks = function(user) {
    username = user.username;
    picksService.sumAllPicks(username).then(function(result){
      console.log(result);
      user.sumYtd = result.totalDollars;
      user.ytdW = result.totalW;
      user.ytdL = result.totalG - result.totalW;
      user.ytdPct = result.totalW / result.totalG;
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
