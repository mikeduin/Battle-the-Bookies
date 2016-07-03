angular
  .module('battleBookies')
  .controller('AuthController', ['$state', 'authService', AuthController])

function AuthController ($state, authService) {
  var vm = this;

  vm.register = function(user) {
    authService.register(user).error(function(error){
      vm.error = error;
    }).then(function(){
      $state.go('home.makepicks');
    })
  };

  vm.login = function() {
    authService.login(vm.user).error(function(error){
      vm.error = error;
    }).then(function(){
      $state.go('home.makepicks');
    })
  }
}
