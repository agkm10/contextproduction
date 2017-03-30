angular.module('contextApp').controller('exampleCtrl', function($scope, exampleService) {
    var x = $scope.someNumber;
    exampleService.serverTest().then(function(result) {
        return result;
    });
});
