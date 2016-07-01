angular
  .module('battleBookies')
  .directive('updateLines', ['$interval', updateLines])

function updateLines ($interval) {

  function oneMinuteRefresh (scope, element, attrs, controller) {
    var refresh;

    function refreshLines () {
      controller.updateDb();
      controller.getMlbLines();
    };

    scope.$watch(attrs.updateLines, function() {
      refreshLines();
      alert("lines should have refreshed");
    })

    refresh = $interval(function() {
      refreshLines();
    }, 10000)
  };

  return {
    controller: 'PickController',
    controllerAs: 'vm',
    link: oneMinuteRefresh

  };
}
