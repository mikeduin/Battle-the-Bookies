angular
  .module('battleBookies')
  .directive('updateLines', ['$interval', updateLines])

function updateLines ($interval) {

  function oneMinuteRefresh (scope, element, attrs, controller) {
    var refresh;

    function refreshLines () {
      controller.updateOdds();
      controller.getMlbLines();
    };

    scope.$watch(attrs.updateLines, function() {
      refreshLines();
    })

    refresh = $interval(function() {
      refreshLines();
    }, 30000)
  };

  return {
    controller: 'PickController',
    controllerAs: 'vm',
    link: oneMinuteRefresh
  };
}
