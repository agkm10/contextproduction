angular.module('contextApp').controller('mainCtrl', ['$scope', function($scope) {
    $(document).ready(function() {
        $('.parallax').parallax();
        $(".button-collapse").sideNav();
        $(".side-nav").click(function(){
          $('.button-collapse').sideNav('hide');
        });
    });

  }]);
