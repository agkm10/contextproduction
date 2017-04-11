angular.module('contextApp').service('signupService', ['$http', '$q', function($http, $q) {
    this.createUser = function(newUser) {
      return $http({
          method: "POST",
          url: 'https://contextproduction.com/users',
          data: newUser
      })
    }
}]);
