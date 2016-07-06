angular
  .module('battleBookies')
  .factory('picksService', ['$http', picksService])

function picksService ($http) {
  return {
    submitPick: function(pick) {
      return $http.put('/picks', pick)
    },
    addTemplate: function(game) {
      return $http.post('/picks/addTemp', game)
    },
    checkSubmission: function(game){
      return $http.get('/picks/' + game.EventID).then(function(result){
        return result.data
      })
    },
    updateDollars: function() {
      return $http.put('/updateDollars').then(function(){
        console.log ('dollars updated')
      })
    },
    sumToday: function(username, datenumb) {
      console.log('datenumb is ' + datenumb)
      return $http.get('/picks/' + username + '/' + datenumb).then(function(result){
        var dayPicks = result.data;
        console.log(dayPicks);
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
        console.log(result);
        var ytdPicks = result.data;
        var totalDollars = 0;
        var totalW = 0;
        var totalG = 0;
        for (i=0; i<ytdPicks.length; i++) {
          var pickPayout = ytdPicks[i].finalPayout;
          var resultBinary = ytdPicks[i].resultBinary;
          if (typeof pickPayout === 'number') {
            totalDollars += pickPayout;
            totalW += resultBinary;
            totalG += 1
          };
        }
        return {
          totalDollars: totalDollars,
          totalW: totalW,
          totalG: totalG
        }
      })
    },
    updateAwayML: function(resultObj) {
      return $http.put('/picks/awayML', resultObj)
    },
    updateHomeML: function(resultObj) {
      return $http.put('/picks/homeML', resultObj)
    },
    updateHomeSpread: function(resultObj) {
      return $http.put('/picks/homeSpread', resultObj)
    },
    updateAwaySpread: function(resultObj) {
      return $http.put('/picks/awaySpread', resultObj)
    },
    updateTotalOver: function(resultObj) {
      return $http.put('/picks/totalOver', resultObj)
    },
    updateTotalUnder: function(resultObj) {
      return $http.put('/picks/totalUnder', resultObj)
    }
  }
}
