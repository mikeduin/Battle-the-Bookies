angular
  .module('battleBookies')
  .factory('auth', ['$http', '$window', auth])
  .factory('oddsService', ['$http', oddsService])

function oddsService ($http) {
  return {
    updateDb: function() {
      return $http.get('/updateDb').then(function(results){
        console.log("db updated")
      })
    },
    getMlbLines: function() {
      return $http.get('/api').then(function(lines){
        return lines.data
      })
    },
    getTodayGames: function() {
      return $http.get('/api/today').then(function(lines){
        return lines.data
      })
    },
    submitPick: function(pick) {
      console.log(pick);
      return $http.post('/picks', pick)
    },
    getDates: function() {
      return $http.get('/api')
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
        console.log(dates);
        return dates;
      })
    },
  }
}


function auth ($http, $window) {
  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['btb-token'] = token;
  }

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

      return payload.username;
    }
  }

  auth.register = function(user) {
    return $http.post('/register', user)
    .success(function(data){
      auth.saveToken(data.token);
    })
  }

  auth.login = function(user) {
    return $http.post('/login', user)
    .success(function(data){
      auth.saveToken(data.token);
    })
  }

  auth.logout = function() {
    $window.localStorage.removeItem('btb-token');
  }

  return auth;
}
