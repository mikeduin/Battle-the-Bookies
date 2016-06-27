angular
  .module('battleBookies')
  .controller('MainController', [MainController])
  .controller('AuthController', [AuthController])


function MainController () {
  var vm = this;
  vm.name = 'mike';
}

function AuthController () {
  var vm = this;
}
