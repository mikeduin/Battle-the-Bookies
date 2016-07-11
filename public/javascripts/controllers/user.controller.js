angular
  .module('battleBookies')
  .controller('UserController', ['$stateParams', 'picksService', 'usersService',  UserController])

function UserController ($stateParams, picksService, usersService) {
  var vm = this;
  vm.user = {};

  vm.getUser = function(){
    usersService.getUser($stateParams.username).then(function(user){
      vm.user = user[0];
      var username = vm.user.username;
      vm.sumAllPicks(user[0].username);
      vm.getPickStats(user[0].username);
      vm.getDailyStats(user[0].username)
    })
  }

  vm.sumAllPicks = function(username) {
    picksService.sumAllPicks(username).then(function(result){
      console.log(result);
      vm.user.sumYtd = result.totalDollars;
      vm.user.ytdW = result.totalW;
      vm.user.ytdL = result.totalG - result.totalW;
      vm.user.ytdPct = result.totalW / result.totalG;
    })
  }

  vm.getDailyStats = function(username){
    picksService.getDailyStats(username).then(function(result){
      console.log(result.data);
      stats = result.data;

    })
  }

  vm.getPickStats = function(username) {
    picksService.getPickStats(username).then(function(stats){
      stats = stats.data;
      console.log(stats);
      vm.user.awayMlPicks = stats.awayMlPicks;
      vm.tendencyData.series[0].values.push(stats.awayMlPicks);
      vm.user.homeMlPicks = stats.homeMlPicks;
      vm.tendencyData.series[1].values.push(stats.homeMlPicks);
      vm.user.combMlPicks = stats.awayMlPicks + stats.homeMlPicks;
      vm.pickTypeData.series[0].values.push(vm.user.combMlPicks);
      vm.user.awaySpreadPicks = stats.awaySpreadPicks;
      vm.tendencyData.series[2].values.push(stats.awaySpreadPicks);
      vm.user.homeSpreadPicks = stats.homeSpreadPicks;
      vm.tendencyData.series[3].values.push(stats.homeSpreadPicks);
      vm.user.combSpreadPicks = stats.awaySpreadPicks + stats.homeSpreadPicks;
      vm.pickTypeData.series[1].values.push(vm.user.combSpreadPicks);
      vm.user.totalOverPicks = stats.totalOverPicks;
      vm.tendencyData.series[4].values.push(stats.totalOverPicks);
      vm.user.totalUnderPicks = stats.totalUnderPicks;
      vm.tendencyData.series[5].values.push(stats.totalUnderPicks);
      vm.user.combTotalPicks = stats.totalOverPicks + stats.totalUnderPicks;
      vm.pickTypeData.series[2].values.push(vm.user.combTotalPicks);
      vm.user.favPicks = stats.favPicks;
      vm.favData.series[0].values.push(stats.favPicks);
      vm.user.dogPicks = stats.dogPicks;
      vm.favData.series[1].values.push(stats.dogPicks);
      console.log(vm.user)
    })
  }

  vm.dailyData = {
    'type':'mixed',
    'title': {
      'text':'Daily Progression',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"2",
          "delay":"1000",
          "speed":"500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Away ML',
        "background-color": "#2196f3"
      },
      {
        "values":[],
        "text": "Home ML",
        "background-color": "#90caf9"
      },
      {
        "values":[],
        "text": "Away Spread",
        "background-color": "#4caf50"
      },
      {
        "values":[],
        "text": "Home Spread",
        "background-color": "#a5d6a7"
      },
      {
        "values":[],
        "text": "Total Over",
        "background-color": "#ff5722"
      },
      {
        "values":[],
        "text": "Total Under",
        "background-color": "#ffab91"
      }
    ]
  }

  vm.tendencyData = {
    'type':'pie',
    'title': {
      'text':'Tendency Drill-Down',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"2",
          "delay":"1000",
          "speed":"500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Away ML',
        "background-color": "#2196f3"
      },
      {
        "values":[],
        "text": "Home ML",
        "background-color": "#90caf9"
      },
      {
        "values":[],
        "text": "Away Spread",
        "background-color": "#4caf50"
      },
      {
        "values":[],
        "text": "Home Spread",
        "background-color": "#a5d6a7"
      },
      {
        "values":[],
        "text": "Total Over",
        "background-color": "#ff5722"
      },
      {
        "values":[],
        "text": "Total Under",
        "background-color": "#ffab91"
      }
    ]
  }

  vm.pickTypeData = {
    'type':'pie',
    'title': {
      'text':'Pick Tendencies',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"2",
          "delay":"1000",
          "speed":"500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Moneylines',
        "background-color": "#1A237E"
      },
      {
        "values":[],
        "text": "Spreads",
        "background-color": "#1B5E20"
      },
      {
        "values":[],
        "text": "Totals",
        "background-color": "#BF360C"
      }
    ]
  }

  vm.favData = {
    'type':'ring',
    'title': {
      'text':'David or Goliath?',
      "fontFamily": "Raleway"
    },
    'plot':{
      "animation":{
          "effect":"4",
          "delay":"2000",
          "speed":"500",
          "method":"5",
          "sequence":"1"
      },
      "valueBox": {
 	    "placement": 'in',
 	    "text": '%t\n%npv%',
 	    "fontFamily": "Raleway",
      "font-size": 12,
      "shadow": true,
      "padding": "10%"
      }
    },
    'series':[
      {
        "values": [],
        "text": 'Favorites',
        "background-color": "#4A148C"
      },
      {
        "values":[],
        "text": "Underdogs",
        "background-color": "#B71C1C"
      }
    ]
  }

}
