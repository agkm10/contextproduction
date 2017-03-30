angular.module('contextApp').service('loginService', function($http, $q) {
  this.loginUser = function(loginUser) {
    return $http({
        method: "POST",
        url: 'http://localhost:3000/api/login',
        data: loginUser
    })
  }


});
