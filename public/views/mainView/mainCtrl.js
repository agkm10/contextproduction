angular.module('contextApp').controller('mainCtrl', function($scope) {
    $scope.test = "hello world"
    $(document).ready(function() {
        $('.parallax').parallax();
        $(".button-collapse").sideNav();
        $(".side-nav").click(function(){
          $('.button-collapse').sideNav('hide');
        })
    });
  });
