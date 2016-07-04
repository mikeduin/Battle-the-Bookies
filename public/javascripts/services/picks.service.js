angular
  .module('battleBookies')
  .factory('picksService', ['$http', picksService])

function picksService ($http) {
  return {
    submitPick: function(pick) {
      console.log(pick);
      return $http.post('/picks', pick)
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
