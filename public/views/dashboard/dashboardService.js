angular.module('contextApp').service('dashboardService', function($http, $q) {
    this.test = "dashboard Service working"
    this.setUserInfo = function(info){
      this.userInfo = info;
    };
    this.getWells = function(userId){
      return $http({
          method: "GET",
          url: 'http://localhost:3000/wells/wellsbyuser'

      })
    }
});
