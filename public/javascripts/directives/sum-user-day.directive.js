angular
  .module('battleBookies')
  .directive('sumUserDay', [sumUserDay])

function sumUserDay () {

  function getDailyTotal (scope, element, attrs, controller) {

    var dateNumbFilter = moment().format('YYYYMMDD');

    scope.$watch('datenumb', function(newValue, oldValue){
      controller.sumDay(scope.user, scope.datenumb).then(function(userDayTotal){
        console.log("scope.datenumb is " + scope.datenumb)
        scope.user.sumDay = userDayTotal;
      })
    })
  }

  return {
    controller: 'ResultController',
    controllerAs: 'vm',
    link: getDailyTotal,
    scope: {user: "=?", datenumb: "=?"},
    template: "{{user.sumDay | currency:$:0}}"
  }
}
