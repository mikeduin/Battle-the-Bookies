angular
  .module('battleBookies')
  .directive('stateLoadingIndicator', ['$rootScope', stateLoadingIndicator])

function stateLoadingIndicator ($rootScope) {

  function loadingIndicator (scope, elem, attrs) {
    scope.isStateLoading = false;

    $rootScope.$on('$routeChangeStart', function(){
      scope.isStateLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function(){
      scope.isStateLoading = false;
    })
  }

  return {
    restrict: 'E',
    template: "<div ng-show='isStateLoading' class='loading-indicator'>" +
    "<div class='loading-indicator-body'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='spinner'><chasing-dots-spinner></chasing-dots-spinner></div>" +
    "</div>" +
    "</div>",
    replace: true,
    link: loadingIndicator
  }
}
