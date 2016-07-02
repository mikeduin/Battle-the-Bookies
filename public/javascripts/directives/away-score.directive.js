angular
  .module('battleBookies')
  .directive('awayScore', ['$interval', awayScore])

function awayScore ($interval) {

  function getAwayScore(scope, element, attrs, controller){
    var refresh;

    function refreshScore () {
      controller.getResult(scope.game).then(function(result){
        game.AwayScore = result[0].AwayScore;
      })
    }

    scope.$watch(attrs.awayScore, function() {
      refreshScore();
    })

    refresh = $interval(function() {
      refreshScore();
    }, 10000)
  }

  return {
    controller: 'PickController',
    controllerAs: 'vm',
    link: getAwayScore,
    scope: {game: "=?"},
    template: "{{game.AwayScore}}"
  }
}
