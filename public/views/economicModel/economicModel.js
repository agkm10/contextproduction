angular.module('contextApp').component('economicModel', {
    controllerAs: 'vmEcon',
    templateUrl: "./views/economicModel/economicModel.html",
    controller: ['dashboardService', function(dashboardService) {
        var self = this;
        self.getEconomicModel = function(investment, oilPrice, nRI, sevTax, opCost, nPV) {
            self.econArr = dashboardService.economicModelCalc(dashboardService.redraw, investment, oilPrice, nRI, sevTax, opCost, nPV);
            dashboardService.setEconArr(econArr);
        };
        self.printEconomicModel = function() {
          // console.log($('#printContainer').find('.print-table').html());
            var mywindow = window.open('', 'new div', 'height=700,width=800');
            mywindow.document.write('<html><head><title></title>');

            mywindow.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css" type="text/css" media="print">>');
            mywindow.document.write(' <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons type="text/css" media="print">');
            mywindow.document.write(' <link rel="stylesheet" href="./style.css" type="text/css" media="print">');
            mywindow.document.write('</head><body >');
            mywindow.document.write($('#printContainer').html());
            // mywindow.document.write($('#printContainer').find('.chart-card').html());

            // mywindow.document.write($('#printContainer').find('.print-table').html());

            mywindow.document.write('<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>');
            mywindow.document.write('<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular.min.js"></script>');
            mywindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.4.2/angular-ui-router.js"></script>');
            mywindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/js/materialize.min.js"></script>');
            mywindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js"></script>');
            mywindow.document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js"></script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close();
            mywindow.focus();
            setTimeout(function() {
                mywindow.print();
                setTimeout(function() {
                mywindow.close();
                }, 1500);
            }, 1500);


            return true;
        };
    }]
});
