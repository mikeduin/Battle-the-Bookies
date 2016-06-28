angular
  .module('battleBookies')
  .controller('MainController', [MainController])
  .controller('AuthController', [AuthController])
  .controller('PickController', ['oddsService', PickController])


function MainController () {
  var vm = this;
  vm.name = 'mike';
}

function AuthController () {
  var vm = this;
}

function PickController (oddsService) {
  var vm = this;
  vm.MLBLines = {};

  vm.getMLBLines = function() {
    oddsService.getMLBLines().then(function(lines){
      vm.MLBLines = lines;
      console.log(vm.MLBLines)
    })
  }
}
