angular.module('contextApp').controller('dashboardCtrl', function($scope,$state, dashboardService, chartService) {
    console.log('new controller instance');

    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = false;
    $scope.panelHide2 = false;
    $scope.panelHide3 = false;
    $scope.panelHide4 = false;
    // $scope.wells = dashboardService.wells;

    if (!$scope.wells) {
        dashboardService.getWells().then(function(result) {
            dashboardService.setWells(result.data)
            $scope.wells = dashboardService.wells
            $scope.getWellCharts(dashboardService.wells[0].well_id, dashboardService.wells[0].well_name);
            dashboardService.setCurrentWellId(dashboardService.wells[0].well_id)
            $scope.currentWellId = dashboardService.wells.well_id
            dashboardService.setCurrentWellName(dashboardService.wells[0].well_name)
            $scope.currentWellName = dashboardService.wells.well_name
        })
    }

    $scope.logout = function() {
      dashboardService.logout().then(function(result){
        console.log('should be logged out')
        $state.go('home');
      });
    }
    $scope.getWellCharts = function(wellId, wellName) {
        $scope.currentWellId = wellId
        dashboardService.setCurrentWellId(wellId)
        $scope.currentWellName = wellName
        dashboardService.setCurrentWellName(wellName)
        $scope.currentWellName = dashboardService.currentWellName;
        dashboardService.getWellCharts(wellId).then(function(result) {
            // $scope.prodData = result;
            dashboardService.setProdData(result)
            dashboardService.setRedraw(result)

        })
    }
    $scope.removeWell = function(wellId) {
        console.log('removewell Id', wellId)
        dashboardService.removeWell(wellId).then(function(result) {
            if (result.data === 1) {
                Materialize.toast(dashboardService.currentWellName + ' Removed Successfully!', 4000)
                dashboardService.getWells().then(function(result) {
                    // $scope.wells = result.data;
                    dashboardService.setWells(result.data)
                    $scope.getWellCharts(dashboardService.wells[0].well_id);
                })
            }
        })
    }
    $scope.plotHyperbolic = function(q0Value, bValue, econTimeInput, initDecline, startDate, endDate) {
            var result = dashboardService.hyperbolicDeclineCalc(dashboardService.prodData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate)
            dashboardService.setRedraw(result);
    }
    $scope.plotExponential = function(q0Value, declineRate, econTimeInput, startDate1, endDate1) {
            var result = dashboardService.getExpDeclineCalc(dashboardService.prodData, q0Value, declineRate, econTimeInput, startDate1, endDate1)
            dashboardService.setRedraw(result);

    }
    $scope.getEconomicModel = function(investment, oilPrice, nRI, sevTax, opCost, nPV) {
        console.log('econ prod data', dashboardService.redraw)
        $scope.econArr = dashboardService.economicModelCalc(dashboardService.redraw, investment, oilPrice, nRI, sevTax, opCost, nPV)
        dashboardService.setEconArr(econArr);
    }
    window.addEventListener("resize", function() {
        console.log(dashboardService.redraw)
        chartService.chartMaker(dashboardService.redraw)
    });


});
