angular.module('contextApp').service('loginService', ['$http', '$q', function($http, $q) {
  this.test = 'logintest'
    this.loginUser = function(loginUser) {
        return $http({
            method: "POST",
            url: 'https://www.contextproduction.com/api/login',
            data: loginUser
        }).then(function(result){
          return result;
        })
    }
}]);
