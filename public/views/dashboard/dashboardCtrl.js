angular.module('contextApp').controller('dashboardCtrl', function($scope,$state, dashboardService, chartService) {
    console.log('new controller instance');

    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = false;
    $scope.panelHide2 = false;
    $scope.panelHide3 = false;
    $scope.panelHide4 = false;

    if (!$scope.wells) {
        dashboardService.getWells().then(function(result) {
            $scope.wells = result.data;
            $scope.getWellCharts($scope.wells[0].well_id);
            $scope.currentWellId = $scope.wells[0].well_id
            $scope.currentWellName = $scope.wells[0].well_name
            // $scope.digest;
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
        $scope.currentWellName = wellName
        dashboardService.getWellCharts(wellId).then(function(result) {
            $scope.prodData = result;
            dashboardService.setRedraw(result);

        })
    }
    $scope.removeWell = function(wellId) {
        console.log('removewell Id', wellId)
        dashboardService.removeWell(wellId).then(function(result) {
            if (result.data === 1) {
                Materialize.toast($scope.currentWellName + ' Removed Successfully!', 4000)
                dashboardService.getWells().then(function(result) {
                    $scope.wells = result.data;
                    $scope.getWellCharts($scope.wells[0].well_id);
                })
            }
        })
    }
    $scope.plotHyperbolic = function(hProdData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate) {
        if (hProdData) {
            var result = dashboardService.hyperbolicDeclineCalc(hProdData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate)
            dashboardService.setRedraw(result);
            console.log('hypredraw', dashboardService.redraw)
        } else {
            window.alert('Please Select A Well')
        }
    }
    $scope.plotExponential = function(eProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1) {
        if (eProdData) {
            var result = dashboardService.getExpDeclineCalc(eProdData, q0Value, declineRate, econTimeInput, startDate1, endDate1)
            dashboardService.setRedraw(result);
        } else {
            window.alert('Please Select A Well')
        }
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
