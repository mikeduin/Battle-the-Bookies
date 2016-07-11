angular
  .module('battleBookies', [
    'ui.router',
    'ngAnimate',
    'zingchart-angularjs'
  ])
  .config(['$stateProvider', '$urlRouterProvider', siteConfig])

function siteConfig ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'views/header.html',
          controller: 'NavController',
          controllerAs: 'vm'
        },
        'content': {
          templateUrl: 'views/content.html',
          controller: 'MainController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.login', {
      url: 'login',
      views: {
        'content@': {
          templateUrl: 'views/login.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.register', {
      url: 'register',
      views: {
        'content@': {
          templateUrl: 'views/register.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.makepicks', {
      url: 'makepicks',
      views: {
        'content@': {
          templateUrl: 'views/makepicks.html',
          controller: 'PickController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.results', {
      url: 'results',
      views: {
        'content@': {
          templateUrl: 'views/results.html',
          controller: 'ResultController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.standings', {
      url: 'standings',
      views: {
        'content@': {
          templateUrl: 'views/standings.html',
          controller: 'StandingsController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.user', {
      url: 'user/:username',
      views: {
        'content@': {
          templateUrl: 'views/user.html',
          controller: 'UserController',
          controllerAs: 'vm'
        }
      }
    })
}
