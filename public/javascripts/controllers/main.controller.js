angular
  .module('battleBookies')
  .controller('MainController', ['$location', '$anchorScroll', MainController])


function MainController($location, $anchorScroll) {
  var vm = this;
  // vm.sayHello = function(){
  //   console.log('hello')
  // }
  // vm.sayHello();

  vm.goToId = function(id) {
    console.log('working');
    var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    $location.hash(old);
  };

  // vm.gotoTop = function() {
  //   $location.hash('top');
  //   $anchorScroll();
  // }


}
