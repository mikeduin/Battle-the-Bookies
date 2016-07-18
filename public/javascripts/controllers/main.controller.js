angular
  .module('battleBookies')
  .controller('MainController', ['$location', '$anchorScroll', MainController])


function MainController($location, $anchorScroll) {
  var vm = this;

  vm.goToId = function(id) {
    console.log('working');
    var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    $location.hash(old);
  };

}
