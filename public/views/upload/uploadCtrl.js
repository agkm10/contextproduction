angular.module('contextApp').controller('uploadCtrl', function($scope, exampleService, uploadService) {
    $scope.check = function() {
        var uploadedFile = document.getElementById('file1').files[0]
        var wellName = document.getElementById('newWellName').value
        Materialize.toast(wellName+ ' Uploaded Successfully!', 4000)
        uploadService.getAsText(uploadedFile, wellName);
    };




});
