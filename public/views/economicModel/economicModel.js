angular.module('contextApp').component('economicModel', {
    controllerAs: 'vmEcon',
    templateUrl: "./views/economicModel/economicModel.html",
    controller: ['dashboardService', function(dashboardService) {
      var self = this;
      self.getEconomicModel = function(investment, oilPrice, nRI, sevTax, opCost, nPV) {
          console.log('econ prod data', dashboardService.redraw)
          self.econArr = dashboardService.economicModelCalc(dashboardService.redraw, investment, oilPrice, nRI, sevTax, opCost, nPV)
          dashboardService.setEconArr(econArr);
      }
    }]
});
