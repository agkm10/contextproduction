angular.module('contextApp').controller('dashboardCtrl', function($scope, dashboardService, chartService) {
    $scope.test = dashboardService.test;
    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = true;
    dashboardService.getWells().then(function(result){
      console.log(result.data)
      $scope.wells =  result.data;
      console.log($scope.user)
      $scope.digest;
    })
    $scope.getWellCharts = function(wellId){
      console.log(wellId)
      dashboardService.getWellCharts(wellId).then(function(result){
          $scope.prodData = result;
          $scope.redraw = result;
      })
    }
    $scope.plotHyperbolic = function(hProdData) {
      if(hProdData) {
        $scope.redraw = dashboardService.hyperbolicDeclineCalc(hProdData)
      } else {
        window.alert('Please Select A Well')
      }

    }
    window.addEventListener("resize", function(){
      d3.select("#chart1 svg").remove();
      chartService.chartMaker($scope.redraw)
    });


});
