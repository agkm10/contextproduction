angular.module('contextApp').service('signupService', function($http, $q) {
    this.createUser = function(newUser) {
      return $http({
          method: "POST",
          url: 'http://localhost:3000/users',
          data: newUser
      })
    }
});
