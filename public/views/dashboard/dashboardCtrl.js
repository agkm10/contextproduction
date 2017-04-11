angular.module('contextApp').controller('dashboardCtrl', ['$scope', '$state', 'dashboardService', 'chartService', function($scope, $state, dashboardService, chartService) {
    $scope.user = dashboardService.userInfo;
    $scope.panelHide1 = false;
    $scope.panelHide2 = false;
    $scope.panelHide3 = false;
    // $scope.panelHide4 = false;
    // $scope.wells = dashboardService.wells;

    if (!$scope.wells) {
        dashboardService.getWells().then(function(result) {
            dashboardService.setWells(result.data)
            $scope.wells = dashboardService.wells
            $scope.getWellCharts(dashboardService.wells[0].well_id, dashboardService.wells[0].well_name);
            dashboardService.setCurrentWellId(dashboardService.wells[0].well_id)
            $scope.currentWellId = dashboardService.wells[0].well_id
            dashboardService.setCurrentWellName(dashboardService.wells[0].well_name)
            $scope.currentWellName = dashboardService.wells[0].well_name
        })
    }

    $scope.logout = function() {
      dashboardService.logout().then(function(result){
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
                    $scope.wells = result.data;
                    dashboardService.setWells(result.data)
                    $scope.getWellCharts(dashboardService.wells[0].well_id);

                })
            }
        })
    }
    window.addEventListener("resize", function() {
        chartService.chartMaker(dashboardService.redraw)
    });


}]);
