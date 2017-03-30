angular.module('contextApp').controller('signupCtrl', function($scope, signupService) {
  $scope.Signup = function(name, email, pass1, pass2) {
    console.log('running signup')
    var newUser = {
      "name": name,
      "email": email,
      "password": pass1
    }
    console.log(newUser)
    if(pass1 !== pass2) {
      window.alert('Passwords do not match')
    } else {
      signupService.createUser(newUser).then(function(result) {
          console.log('signupControlelr', result)
      });
    }
  }
});
