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
          console.log((games[i].MatchDay));
          if (dates.indexOf(games[i].MatchDay) === -1) {
            dates.push(games[i].MatchDay)
          }
        }
        console.log("dates are: " + dates);
        // dates.sort();
        // console.log("sorted dates are: " + dates)
        return dates;
      })
    },
    getDateNumbs: function() {
      return $http.get('/lines')
      .then(function(lines) {
        console.log(lines.data)
        var dateNumbs = [];
        var games = lines.data;
        for (var i in games) {
          if (dateNumbs.indexOf(games[i].DateNumb) === -1) {
            dateNumbs.push(games[i].DateNumb)
          }
        }
        console.log("datenumbs are: " + dateNumbs);
        return dateNumbs;
      })
    }
  }
}
