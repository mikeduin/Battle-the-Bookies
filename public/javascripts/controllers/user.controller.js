angular
  .module('battleBookies')
  .controller('UserController', ['$stateParams', 'picksService', 'usersService',  UserController])

function UserController ($stateParams, picksService, usersService) {
  var vm = this;
  vm.user = {};

  vm.getUser = function(){
    usersService.getUser($stateParams.username).then(function(user){
      vm.user = user[0];
      var username = vm.user.username;
      vm.sumAllPicks(user[0].username);
      vm.getPickStats(user[0].username);
    })
  }

  vm.sumAllPicks = function(username) {
    picksService.sumAllPicks(username).then(function(result){
      console.log(result);
      vm.user.sumYtd = result.totalDollars;
      vm.user.ytdW = result.totalW;
      vm.user.ytdL = result.totalG - result.totalW;
      vm.user.ytdPct = result.totalW / result.totalG;
    })
  }

  vm.getPickStats = function(username) {
    picksService.getPickStats(username).then(function(stats){
      stats = stats.data;
      vm.user.awayMlPicks = stats.awayMlPicks;
      vm.user.awaySpreadPicks = stats.awaySpreadPicks;
      vm.user.homeMlPicks = stats.homeMlPicks;
      vm.user.homeSpreadPicks = stats.homeSpreadPicks;
      vm.user.totalOverPicks = stats.totalOverPicks;
      vm.user.totalUnderPicks = stats.totalUnderPicks;
    })
  }
}
