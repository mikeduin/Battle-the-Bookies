angular
  .module('battleBookies')
  .controller('StandingsController', ['picksService', 'oddsService', StandingsController])

function StandingsController (picksService, oddsService) {
  var vm = this;
  vm.getDates = getDates;
  vm.daysOfGames = [];
  vm.pageArray = [1];

  function getDates () {
    oddsService.getDates().then(function(dates){
      // console.log(dates);
      vm.daysOfGames = dates;
    }).then(function(){
      getPageArray(vm.daysOfGames)
    })
  };

  function getPageArray (games) {
    console.log(games)
    var pageArray = [1];
    for (i = 1; i<games.length; i++) {
      if ((i % 4) === 0) {
        pageArray.push((i/4)+1)
      }
    }
    console.log(pageArray)
    vm.pageArray = pageArray
  }
}
