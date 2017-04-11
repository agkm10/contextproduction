
angular.module('contextApp').component('exponentialPlot', {
  controllerAs: 'vmExp',
    templateUrl: "./views/exponentialPlot/exponentialPlot.html",
    controller: ['dashboardService', function(dashboardService) {
        var self = this;
        self.plotExponential = function(q0Value, declineRate, econTimeInput, startDate1, endDate1) {
                var result = dashboardService.getExpDeclineCalc(dashboardService.prodData, q0Value, declineRate, econTimeInput, startDate1, endDate1)
                dashboardService.setRedraw(result);
        }
        self.panelShow4 = false;
    }]
});
