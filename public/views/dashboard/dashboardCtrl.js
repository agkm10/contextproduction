angular.module('contextApp').controller('dashboardCtrl', function($scope, dashboardService, chartService) {
    console.log('new controller instance');

    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = false;
    $scope.panelHide2 = false;
    $scope.panelHide3 = false;
    $scope.panelHide4 = false;

    // $scope.redraw = null;
    //
    // $scope.$watch('redraw', (newVal, oldVal) => {
    //   if (oldVal) {
    //     console.log(`changing from ${oldVal.length} to ${newVal.length}`);
    //   }
    // })

    if(!$scope.wells) {
    dashboardService.getWells().then(function(result){
      $scope.wells =  result.data;
      $scope.getWellCharts($scope.wells[0].well_id);
      // $scope.digest;
    })
  }
    $scope.getWellCharts = function(wellId, wellName){
      $scope.currentWellId = wellId
      $scope.currentWellName = wellName
      dashboardService.getWellCharts(wellId).then(function(result){
          $scope.prodData = result;
          dashboardService.setRedraw(result);

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
          var result = dashboardService.hyperbolicDeclineCalc(hProdData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate)
          dashboardService.setRedraw(result);
          console.log('hypredraw', dashboardService.redraw)
        }
      } else {
        window.alert('Please Select A Well')
      }

    }
    $scope.plotExponential = function(eProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1) {
      if(eProdData) {
          var result = dashboardService.getExpDeclineCalc(eProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1)
          dashboardService.setRedraw(result);
      } else {
        window.alert('Please Select A Well')
      }

    }
    $scope.getEconomicModel = function(investment, oilPrice, nRI, sevTax, opCost, nPV) {
      console.log('econ prod data', dashboardService.redraw)
      $scope.econModel = dashboardService.economicModelCalc(dashboardService.redraw, investment, oilPrice, nRI, sevTax, opCost, nPV)
    }
    window.addEventListener("resize", function(){
      console.log(dashboardService.redraw)
      chartService.chartMaker(dashboardService.redraw)
    });


});
