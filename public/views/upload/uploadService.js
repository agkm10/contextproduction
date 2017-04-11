angular.module('contextApp').service('uploadService', ['$http', '$q', function($http, $q) {

    this.getAsText = function(fileToRead, wellName) {
        var reader = new FileReader();
        reader.readAsText(fileToRead);
        reader.onerror = function(evt) {
            if (evt.target.error.name == "NotReadableError") {
                alert("Canno't read file !");
            }
        };
        reader.onloadend = function(event) {
            var csv = event.target.result;
            fileUpload(processData(csv), wellName)
        };
    };

    var processData = function(csv) {
        var columns = ["prod_date", "prod_oil"];
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        for (var i = 0; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            var tarr = {};
            for (var j = 0; j < data.length; j++) {
                if (columns[j] === 'prod_oil') {
                    tarr[columns[j]] = parseInt(data[j])
                }else if (columns[j] === 'prod_date') {
                    tarr[columns[j]] = new Date(data[j])
                }

            }
            lines.push(tarr);
        }
        // console.log(lines);
        lines.pop(lines.length - 1)
        return lines;
    }

    var fileUpload = function(uploadFile, wellName) {
      uploadFileFinal = {wellname: wellName, wellinfo: uploadFile}
        console.log('Example Service - fileUpload running: ', uploadFile)
        return $http({
            method: "POST",
            url: 'https://contextproduction.com/wells/upload',
            data: uploadFileFinal
        })
    }
}]);
