angular.module('contextApp').service('dashboardService', function($http, $q, chartService) {
    this.test = "dashboard Service working"
    this.setUserInfo = function(info) {
        this.userInfo = info;
    };
    this.getWells = function(userId) {
        return $http({
            method: "GET",
            url: 'http://localhost:3000/wells/wellsbyuser'

        })
    }
    this.getWellCharts = function(wellId) {
        var wellIdQuery = wellId.toString();
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/wells?well_id=' + wellIdQuery
        }).then(function(result) {

            console.log('well query results', result.data)


            var t0 = new Date(sortBy(result.data, 'date')[0].prod_date.toString());
            console.log('t0', t0)
            var prodData = result.data.map(function(x) {
                var d = new Date(x.prod_date);
                var extraYr = d.getYear() - t0.getYear();
                var seqMonth = ((d.getMonth() - t0.getMonth()) + extraYr * 12);
                if(parseFloat(x.prod_oil) ===0) {x.prod_oil = '.01'}
                return {
                    date: d,
                    oil: parseFloat(x.prod_oil),
                    mo: seqMonth,
                    type: 'oil'
                }
            })
            prodData = sortBy(prodData, 'date');
            console.log('prodData', prodData)
            if(d3.select("#chart1 svg")){
            d3.select("#chart1 svg").remove();
          }

            chartService.chartMaker(prodData)
            return prodData;
            // hyperbolidDeclineCalc(result);
        })
    }


    this.hyperbolicDeclineCalc = function(result) {
      if(d3.select("#chart1 svg")){
      d3.select("#chart1 svg").remove();
    }

        var newArr3 = result;
        newArr3 = sortBy(newArr3, 'date');
        var t0 = new Date(newArr3[0].date.toString());
        var q0 = newArr3[0].oil;
        var q1 = newArr3[0].oil;
        var t1 = 0;
        var q2 = newArr3[newArr3.length - 1].oil;
        var t2 = newArr3.length - 1;
        var q3 = Math.floor(Math.sqrt(q1 * q2))
        var t3 = 13;
        newArr3 = sortBy(newArr3, 'oil');
        t3 = interpolateArr(newArr3, q3, 'mo', 'oil');
        newArr3 = sortBy(newArr3, 'date');
        var bOverA = (t1 + t2 - 2 * t3) / (t3 * t3 - t1 * t2);
        var qStar = (newArr3[newArr3.length - 1].oil + newArr3[newArr3.length - 2].oil + newArr3[newArr3.length - 1].oil) / 3
        var tStar = newArr3.length - 1;

        var a = (Math.log(q0 / qStar)) / (Math.log(1 + bOverA * tStar));
        qpArr = [];
        console.log('b', bOverA * a)
        console.log('a', a)
        console.log('b/a', bOverA)
        console.log('q3', q3)
        console.log('t3', t3)
        var lastMo = newArr3[newArr3.length - 1].mo
        console.log(lastMo)
        var totalError = 0;
        var newArr4 = [];
        newArr3.forEach(function(x) {
            newArr4.push(x);
            var qp = q0 / (Math.pow((1 + bOverA * x.mo), a))
            qp = Math.floor(qp)
            newArr4.push({
                date: new Date(x.date.toString()),
                mo: x.mo,
                qp: qp,
                type: 'qp'
            })
            totalError += Math.abs(qp - x.oil);
        })
        console.log('TotalError', totalError)

        var dateCheck = new Date(newArr3[newArr3.length - 1].date.toString());
        var econMo = 24
        for (var i = 1; i <= econMo; ++i) {
            dateCheck.add({
                months: 1
            })

            qp = q0 / (Math.pow((1 + bOverA * (lastMo + i)), a))
            qp = Math.floor(qp)
            var check3 = {
                date: new Date(dateCheck.toString()),
                mo: lastMo + i,
                qp: qp,
                type: 'qp'
            }
            newArr4.push(check3)
        }



        // return chartMaker(newArr3, qpArr);
        console.log('newArr4', newArr4);
        var chartArr = newArr3.map(function(x){
          return {x: x.date, y: x.oil}
        })
        var chartArr = {key: 'Oil', values: chartArr}
        console.log('chart Arr',chartArr)

        chartService.chartMaker(newArr4);
        return newArr4;
    }
    //----------------------------Extend function ---------------------------------------------------
    // function econTime(arr, tEcon, q0, bOverA, newArr3, a, dateCheck, lastMo, new) {
    //     var tempArr = arr;
    //     var date = ""
    //     for (var i = 1; i <= tEcon; ++i) {
    //         dateCheck.add({
    //             months: 1
    //         })
    //
    //         qp = q0 / (Math.pow((1 + bOverA * (lastMo + i)), a))
    //         qp = Math.floor(qp)
    //         var check3 = {
    //             date: new Date(dateCheck.toString()),
    //             mo: lastMo + i,
    //             qp: qp,
    //             type: 'qp'
    //         }
    //         tempArr.push(check3)
    //     }
    //
    //     console.log(tempArr)
    //     return tempArr;
    // }

    //----------------------------Optimize function ---------------------------------------------------
    var hyperbolicDecline = function() {
        // var qStarMax =  Math.max(sortBy(newArr3, 'oil')[0].oil);
        // var qStarMin = Math.max(sortBy(newArr3, 'oil')[newArr3.length-1].oil);
        // var tStarMin = 0;
        // var tStarMax = Math.max(sortBy(newArr3, 'mo')[0].mo);
        sortBy(newArr3, 'oil')
        qStar = (newArr3[newArr3.length - 1].oil + newArr3[newArr3.length - 2].oil + newArr3[newArr3.length - 1].oil) / 3
        a = (Math.log(q0 / qStar)) / (Math.log(1 + bOverA * tStar));
        var checkErr;
        newArr3.forEach(function(x) {
            var qp = q0 / (Math.pow((1 + bOverA * x.mo), a))
            qp = Math.floor(qp)
            qpArr.push({
                date: x.date,
                mo: x.mo,
                qp: qp,
                oil: x.oil,
                type: 'qp'
            })
            totalError += Math.abs(qp - x.oil);
        })
    }

    //----------------------------sort function ---------------------------------------------------
    var sortBy = function(arr, sortVal) {
        arr = arr.sort(function(acc, val) {
            if (sortVal === 'date') {
                return acc[sortVal] - val[sortVal]
            } else {
                return val[sortVal] - acc[sortVal]
            }
        })
        return arr;
    }
    //----------------------------Interpolate t3----------------------------------------------------
    var interpolateArr = function(arr, num, findBy, intBy) {
        arr = arr.sort(function(acc, val) {
            return parseInt(val[intBy]) - parseInt(acc[intBy]);
        })
        var check1, check2, check3, check4 = 0;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i][intBy] < num) {
                check1 = arr[i - 1][intBy];
                check2 = arr[i][intBy];
                check3 = arr[i - 1][findBy];
                check4 = arr[i][findBy];
                i = arr.length;
            }
        }
        var interpolatedValue = check3 + ((check1 - num) / (check1 - check2)) * (check3 - check4);
        console.log('interpolatedValue', interpolatedValue)
        return interpolatedValue

    }


});
