angular.module('contextApp').controller('uploadCtrl', function($scope, exampleService, uploadService) {
    var x = $scope.someNumber;

    $scope.check = function() {
        var uploadedFile = document.getElementById('file1').files[0]
        var wellName = document.getElementById('newWellName').value
        console.log('well name', wellName)
        console.log('File Uploaded: ', uploadedFile)
        uploadService.getAsText(uploadedFile, wellName);
        $state.go('dashboard')
    };




});
