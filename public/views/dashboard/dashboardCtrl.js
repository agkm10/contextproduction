angular.module('contextApp').controller('dashboardCtrl', function($scope, dashboardService) {
    $scope.test = dashboardService.test;
    $scope.user = dashboardService.userInfo;
    dashboardService.getWells().then(function(result){
      console.log(result.data)
      $scope.wells =  result.data;
      console.log($scope.user)
      $scope.digest;
    })
    $scope.getWellCharts = function(wellId){
      console.log(wellId)
      dashboardService.getWellCharts(wellId).then(function(result){
          
      })
    }


});
