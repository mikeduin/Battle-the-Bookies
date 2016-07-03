angular
  .module('battleBookies')
  .controller('NavController', ['authService', NavController])

function NavController (authService) {
  var vm = this;

  vm.isLoggedIn = function(){
    authService.isLoggedIn()
  }

  vm.logOut = function(){
    authService.logOut()
  }

  vm.currentUser = function(){
    authService.currentUser()
  }

}
