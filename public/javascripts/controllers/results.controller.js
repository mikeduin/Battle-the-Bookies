angular
  .module('battleBookies')
  .controller('ResultController', ['oddsService', ResultController])

function ResultController (oddsService) {
  var vm = this;
  vm.gameDayFilter = moment().format('MMMM Do, YYYY');
  vm.daysOfGames = [];
  vm.mlbLines = [];
  vm.getMlbLines = getMlbLines;
  vm.sortOrder = "MatchTime";
  // vm.getMlbResults = getMlbResults;
  vm.updateResults = updateResults;
  vm.getPicks = getPicks;
  vm.getResult = getResult;
  vm.getDates = getDates;
  vm.picks = [];
  vm.users = [
    {
      username: "mikeduin",
      ytd: 1546.98,
      today: 245.69
    },
    {
      username: "seanstokke",
      ytd: 598.35,
      today: -100.59
    }
  ];


  function getMlbLines (){
    oddsService.getMlbLines().then(function(games){
      console.log(games)
      vm.mlbLines = games;
    })
  }
  //
  // function getMlbResults() {
  //   oddsService.getMlbResults().then(function(results){
  //     vm.mlbResults = results;
  //   })
  // }

  function updateResults () {
    oddsService.updateResults().then(function(){
      console.log("results updated")
    })
  };

  function getPicks () {
    oddsService.getPicks().then(function(data){
      vm.picks = data;
      console.log(vm.picks);
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
