angular
  .module('battleBookies')
  .controller('NavController', ['authService', NavController])

function NavController (authService) {
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
