angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', ResultController])

function ResultController (oddsService) {
  var vm = this;
  vm.daysOfGames = [];
  vm.getDates = getDates;
  vm.getGames = getGames;

  function getGames (){
    oddsService.getMlbLines().then(function(games){
      vm.mlbGames = games;
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

}
