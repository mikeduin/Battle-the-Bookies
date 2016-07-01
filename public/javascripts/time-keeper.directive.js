angular
  .module('battleBookies')
  .directive('timeKeeper', ['$interval', timeKeeper])

function timeKeeper ($interval) {

  function oneSecondRefresh (scope, element, attrs) {
    var refresh;

    function updateTime() {
      element.text(moment().format('MMMM Do YYYY, h:mm:ss a'))
    };

    scope.$watch(attrs.timeKeeper, function() {
      updateTime()
    });

    refresh = $interval(function() {
      updateTime();
    }, 1000)
  };

  return {
    link: oneSecondRefresh
  };

}
