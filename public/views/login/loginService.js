angular.module('contextApp').service('loginService', function($http, $q) {
  this.test = 'logintest'
    this.loginUser = function(loginUser) {
        return $http({
            method: "POST",
            url: 'http://localhost:3000/api/login',
            data: loginUser
        }).then(function(result){
          return result;
        })

    }



});
