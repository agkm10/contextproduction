angular.module('contextApp').controller('loginCtrl', ['$scope', '$location', 'loginService', '$state', 'dashboardService', function($scope, $location, loginService, $state, dashboardService) {

    $scope.login = function(email, pass1) {
        var loginUser = {
            "email": email,
            "password": pass1
        }
        loginService.loginUser(loginUser).then(function(res) {
            $location.path('dashboard')
            dashboardService.setUserInfo(res.data);

        }, function(err){
          console.log(err.data)
          window.alert('Incorrect Login')
        });
    }
}]);
