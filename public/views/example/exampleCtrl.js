angular.module('contextApp').controller('exampleCtrl', function($scope, exampleService, uploadService) {
    var x = $scope.someNumber;

    $scope.check = function() {
        var uploadedFile = document.getElementById('file1').files[0]
        console.log('File Uploaded: ', uploadedFile)
        uploadService.getAsText(uploadedFile);
    };

});
