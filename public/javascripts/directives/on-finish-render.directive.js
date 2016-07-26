angular
  .module('battleBookies')
  .directive('onFinishRender', ['$timeout', onFinishRender])

function onFinishRender ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function(){
          scope.$emit(attr.onFinishRender)
        })
      }
    }
  }
}
