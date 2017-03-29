angular.module('contextApp').controller('mainCtrl', function($scope) {
    $scope.test = "hello world"
    $(document).ready(function() {
        $('.parallax').parallax();
    });
  });
