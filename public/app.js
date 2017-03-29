angular.module('contextApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('home', {
            url:'/',
            templateUrl: './views/home/home.html',
            controller:'mainCtrl'
          })
          .state('example', {
            url:'/example',
            templateUrl: './views/example/example.html',
            controller: 'exampleCtrl'
          })
          .state('about', {
            url:'/about',
            templateUrl: './views/about/about.html',
            controller: 'mainCtrl'
          })
          .state('contact', {
            url:'/contact',
            templateUrl: './views/contact/contact.html',
            controller: 'mainCtrl'
          })
          .state('login', {
            url:'/login',
            templateUrl: './views/login/login.html',
            controller: 'mainCtrl'
          })
          $urlRouterProvider
              .otherwise('/');
    });
