angular
  .module('battleBookies')
  .factory('picksService', ['$http', 'authService', picksService])

function picksService ($http, authService) {
  return {
    submitPick: function(pick) {
      return $http.put('/picks', pick, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      })
    },
    addTemplate: function(game) {
      return $http.post('/picks/addTemp', game, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      })
    },
    checkSubmission: function(game){
      return $http.get('/picks/checkSubmission/' + game.EventID, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      }).then(function(result){
        return result.data
      })
    },
    updateDollars: function() {
      return $http.put('/updateDollars').then(function(){
        console.log ('dollars updated')
      })
    },
    updatePicks: function() {
      return $http.get('/updatePicks').then(function(){
      })
    },
    sumToday: function(username, datenumb) {
      console.log('datenumb is ' + datenumb)
      return $http.get('/picks/' + username + '/' + datenumb).then(function(result){
        var dayPicks = result.data;
        // console.log(dayPicks);
        var total = 0;
        for (i=0; i<dayPicks.length; i++) {
          var pickPayout = dayPicks[i].finalPayout;
          total += pickPayout;
        }
        return total;
      })
    },
    sumAllPicks: function(username, date) {
      return $http.get('/picks/' + username + '/all').then(function(result){
        var ytdPicks = result.data;
        var totalDollars = 0;
        var totalW = 0;
        var totalG = 0;
        for (i=0; i<ytdPicks.length; i++) {
          var pickPayout = ytdPicks[i].finalPayout;
          var resultBinary = ytdPicks[i].resultBinary;
          if (typeof resultBinary === 'number') {
            totalDollars += pickPayout;
            totalW += resultBinary;
            totalG += 1;
          };
        }
        return {
          totalDollars: totalDollars,
          totalW: totalW,
          totalG: totalG
        }
      })
    }
  }
}
