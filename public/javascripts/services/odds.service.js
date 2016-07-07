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
    },
    getDateNumbs: function() {
      return $http.get('/lines')
      .then(function(lines) {
        var dateNumbs = [];
        var games = lines.data;
        for (var i in games) {
          for (var j in games[i].DateNumb) {
            if (dateNumbs.indexOf(games[i].DateNumb) === -1) {
              dateNumbs.push(games[i].DateNumb)
            }
          }
        }
        return dateNumbs;
      })
    }
  }
}
