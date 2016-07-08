angular
  .module('battleBookies')
  .directive('sumUserDay', [sumUserDay])

function sumUserDay () {

  // function getDailyTotal (scope, element, attrs, controller) {
  //   scope.$watch(attrs.matchDay, function(){
  //     console.log(controller.matchDayFilter);
  //     // controller.sumDay(scope.user, value)
  //   })
  // }

  function getDailyTotal (scope, element, attrs, controller) {
    scope.$watch(attrs.matchDay, function(value){
      console.log(value);

    })
  }

  return {
    // controller: 'ResultController',
    // controllerAs: 'vm',
    link: getDailyTotal
    // scope: {user: "=?"}
  }
}
