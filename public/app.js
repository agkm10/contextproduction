angular.module('contextApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('home', {
            url:'/',
            templateUrl: './views/home/home.html',
            controller:'mainCtrl'
          })
          .state('upload', {
            url:'/upload',
            templateUrl: './views/upload/upload.html',
            controller: 'uploadCtrl'
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
            controller: 'loginCtrl'
          })
          .state('signup', {
            url:'/signup',
            templateUrl: './views/signup/signup.html',
            controller: 'signupCtrl'
          })
          .state('dashboard', {
            url:'/dashboard',
            templateUrl: './views/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
          });

          $urlRouterProvider
              .otherwise('/');
    }]);
