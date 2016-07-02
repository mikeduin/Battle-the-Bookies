angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', ResultController])

function ResultController (oddsService) {
  var vm = this;
  vm.gameDayFilter = moment().format('MMMM Do, YYYY');
  vm.daysOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
  vm.getResult = getResult;
  vm.getDates = getDates;


  function getMlbLines (){
    oddsService.getMlbLines().then(function(games){
      console.log(games)
      vm.mlbLines = games;
    })
  }

  function getResult (game) {
    oddsService.getResult(game.EventID).then(function(result){
      game.HomeScore = result[0].HomeScore;
      game.AwayScore = result[0].AwayScore;
      function checkStatus (result) {
        if(result[0].Final === true) {
          game.status = "Final";
        }
      }
      checkStatus(result);
    })
  }

  function getDates () {
    oddsService.getDates().then(function(dates){
      vm.daysOfGames = dates;
    })
  };
  vm.getDates();

}
