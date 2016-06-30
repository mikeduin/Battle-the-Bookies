angular
  .module('battleBookies')
  .factory('auth', ['$http', '$window', auth])
  .factory('oddsService', ['$http', oddsService])

// function oddsService ($http) {
//   return {
//     getMLBLines: function() {
//       return $http.get('https://jsonodds.com/api/odds/mlb', {
//         headers: {'JsonOdds-API-Key': 'f6e556e5-0092-49d9-9e4f-c7aa591eaecb'}
//       }).then(function(results){
//         var odds = results.data;
//         return odds
//       })
//     }
//   }
// }

function oddsService ($http) {
  return {
    updateDb: function() {
      return $http.get('/updateDb').then(function(results){
        console.log(results);
        console.log("db updated")
      })
    },
    getMLBLines: function() {
      return $http.get('/api').then(function(results){
        return results.data
      })
    },
    getTodayGames: function() {
      return $http.get('/api/today').then(function(results){
        return results.data
      })
    },
    submitPick: function(pick) {
      console.log(pick);
      return $http.post('/picks', pick)
    }
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
