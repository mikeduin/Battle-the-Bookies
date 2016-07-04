angular
  .module('battleBookies')
  .factory('oddsService', ['$http', oddsService])

function oddsService ($http) {
  return {
    updateOdds: function() {
      return $http.get('/updateOdds').then(function(){
        console.log("odds updated")
      })
    },
    getMlbLines: function() {
      return $http.get('/lines').then(function(lines){
        return lines.data
      })
    },
    updateStatus: function(result){
      return $http.put('/lines/updateStatus', result).then(function(){
        console.log('status updated')
      })
    },
    getPicks: function(){
      return $http.get('/picks').then(function(picks){
        return picks.data
      })
    },
    // settlePicks: function(){
    //   return $http.put('/picks/' + eventToSettle).then(function(){
    //     console.log('picks settled')
    //   })
    // },
    getDates: function() {
      return $http.get('/lines')
      .then(function(lines) {
        var dates = [];
        var games = lines.data;
        for (var i in games) {
          for (var j in games[i].MatchDay) {
            if (dates.indexOf(games[i].MatchDay) === -1) {
              dates.push(games[i].MatchDay)
            }
          }
        }
        return dates;
      })
    }
  }
}
