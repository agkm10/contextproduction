angular.module('contextApp').component('hyperbolicPlot', {
    controllerAs: 'vmHyp',
    templateUrl: "./views/hyperbolicPlot/hyperbolicPlot.html",
    controller: ['dashboardService', function(dashboardService) {
      var self = this;
      self.plotHyperbolic = function(q0Value, bValue, econTimeInput, initDecline, startDate, endDate) {
              var result = dashboardService.hyperbolicDeclineCalc(dashboardService.prodData, q0Value, bValue, econTimeInput, initDecline, startDate, endDate)
              dashboardService.setRedraw(result);
      }
      self.panelShow4 = false;
    }]
});
