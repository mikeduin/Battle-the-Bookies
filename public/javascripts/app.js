angular
  .module('battleBookies', [
    'ui.router',
    'ngAnimate'
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
          controller: 'MainController',
          controllerAs: 'main'
        },
        'content': {
          templateUrl: 'views/content.html'
        }
      }
    })
}
