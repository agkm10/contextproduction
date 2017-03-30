angular.module('contextApp').controller('dashboardCtrl', function($scope, dashboardService) {
    $scope.test = dashboardService.test;
    $scope.user = dashboardService.userInfo;
    dashboardService.getWells().then(function(result){
      console.log(result.data)
      $scope.wells =  result.data;
      $scope.digest;
    })


});
