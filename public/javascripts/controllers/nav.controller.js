angular
  .module('battleBookies')
  .controller('NavController', ['authService', '$state', NavController])

function NavController (authService, $state) {
  var vm = this;

  vm.isLoggedIn = function(){
    return authService.isLoggedIn();
  }

  vm.logOut = function(){
    authService.logOut()
  }

  vm.currentUser = function(){
    return authService.currentUser();
  }

}
