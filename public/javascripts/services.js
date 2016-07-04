angular
  .module('battleBookies')
  .factory('authService', ['$http', '$window', authService])
  .factory('oddsService', ['$http', oddsService])
  .factory('picksService', ['$http', picksService])

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

function picksService ($http) {
  return {
    checkSubmission: function(game){
      return $http.get('/picks/' + game.EventID).then(function(result){
        return result.data
      })
    },
    updateAwayML: function(resultObj) {
      $http.put('/picks/awayML', resultObj).then(function(){
        console.log('away ML updated')
      })
    },
    updateHomeML: function(resultObj) {
      $http.put('/picks/homeML', resultObj).then(function(){
        console.log('home ML updated')
      })
    },
    updateHomeSpread: function(resultObj) {
      $http.put('/picks/homeSpread', resultObj).then(function(){
        console.log('home spread updated')
      })
    },
    updateAwaySpread: function(resultObj) {
      $http.put('/picks/awaySpread', resultObj).then(function(){
        console.log('away spread updated')
      })
    },
    updateTotalOver: function(resultObj) {
      $http.put('/picks/totalOver', resultObj).then(function(){
        console.log('total over updated')
      })
    },
    updateTotalUnder: function(resultObj) {
      $http.put('/picks/totalUnder', resultObj).then(function(){
        console.log('total under updated')
      })
    }
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
