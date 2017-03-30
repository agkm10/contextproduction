angular.module('contextApp').controller('loginCtrl', function($scope, loginService, $state, dashboardService) {

    $scope.login = function(email, pass1) {
        var loginUser = {
            "email": email,
            "password": pass1
        }
        loginService.loginUser(loginUser).then(function(result) {
            console.log('loginController', result.data)
            $state.go('dashboard')
            dashboardService.setUserInfo(result.data);
        });
    }
});
