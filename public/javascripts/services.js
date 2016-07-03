angular
  .module('battleBookies')
  .factory('authService', ['$http', '$window', authService])
  .factory('oddsService', ['$http', oddsService])

function oddsService ($http) {
  return {
    updateOdds: function() {
      return $http.get('/updateOdds').then(function(){
        console.log("odds updated")
      })
    },
    updateResults: function() {
      return $http.get('/updateResults').then(function(){
        console.log("results updated")
      })
    },
    getMlbLines: function() {
      return $http.get('/lines').then(function(lines){
        return lines.data
      })
    },
    getMlbResults: function() {
      return $http.get('/results').then(function(results){
        console.log(results.data);
        return results.data
      })
    },
    getTodayGames: function() {
      return $http.get('/lines/today').then(function(lines){
        return lines.data
      })
    },
    submitPick: function(pick) {
      console.log(pick);
      return $http.post('/picks', pick)
    },
    getResult: function(EventID){
      return $http.get('/results/' + EventID).then(function(result){
        return result.data
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
  }
}

function authService ($http, $window) {

    var auth = {};

    // Method saves JWT Token to local storage; btb-token functions as the unique key that we will read and write from. Note that if we ever change this key, everyone logged in will get logged out. Don't change unless you're intentionally changing to log everyone out.
    auth.saveToken = function(token) {
      $window.localStorage['btb-token'] = token;
    }

    // Method gets JWT Token from local storage
    auth.getToken = function() {
      return $window.localStorage['btb-token']
    }

    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp = Date.now() / 1000;
      } else {
        return false;
      }
    }

    auth.currentUser = function() {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        // This gets us the username of the currently logged in user from the payload
        return payload.username;
      }
    }

    auth.register = function(user) {
      console.log(user);
      return $http.post('/register', user)
      .success(function(data){
        auth.saveToken(data.token);
      })
    }

    auth.logIn = function(user) {
      return $http.post('/login', user)
      .success(function(data){
        auth.saveToken(data.token);
      })
    }

    auth.logOut = function() {
      $window.localStorage.removeItem('btb-token');
    }

    return auth;
}
