angular
  .module('battleBookies')
  .controller('StandingsConroller', ['picksService', StandingsConroller])

function StandingsConroller (picksService) {
  var vm = this;
  var getDates = getDates;

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

}
