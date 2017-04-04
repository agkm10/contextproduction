angular.module('contextApp').controller('dashboardCtrl', function($scope, dashboardService, chartService) {
    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = false;
    $scope.panelHide2 = false;
    dashboardService.getWells().then(function(result){
      $scope.wells =  result.data;
      $scope.getWellCharts($scope.wells[0].well_id);
      // $scope.digest;
    })
    $scope.getWellCharts = function(wellId, wellName){
      $scope.currentWellId = wellId
      $scope.currentWellName = wellName
      dashboardService.getWellCharts(wellId).then(function(result){
          $scope.prodData = result;
          $scope.redraw = result;

      })
    }
    $scope.removeWell = function(wellId){
      console.log('removewell Id', wellId)
      dashboardService.removeWell(wellId).then(function(result){
          if(result.data===1){
            Materialize.toast($scope.currentWellName+ ' Removed Successfully!', 4000)
            dashboardService.getWells().then(function(result){
              $scope.wells =  result.data;
              $scope.getWellCharts($scope.wells[0].well_id);
            })
          }
      })
    }
    $scope.plotHyperbolic = function(hProdData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate) {
      if(hProdData) {
        if(initDecline && !bValue){
          window.alert('Please Include a b Value')
        } else {
          $scope.redraw = dashboardService.hyperbolicDeclineCalc(hProdData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate)
        }
      } else {
        window.alert('Please Select A Well')
      }

    }
    $scope.plotExponential = function(hProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1) {
      if(hProdData) {
          $scope.redraw = dashboardService.getExpDeclineCalc(hProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1)
      } else {
        window.alert('Please Select A Well')
      }

    }
    window.addEventListener("resize", function(){
      d3.select("#chart1 svg").remove();
      chartService.chartMaker($scope.redraw)
    });


});
