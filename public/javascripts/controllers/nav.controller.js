angular
  .module('battleBookies')
  .controller('NavController', ['authService', NavController])

function NavController (authService) {
  var vm = this;

  vm.isLoggedIn = function(){
    var value = authService.isLoggedIn();
    return value
  }

  vm.logOut = function(){
    authService.logOut()
  }

  vm.currentUser = function(){
    var value = authService.currentUser();
    return value
  }

}
