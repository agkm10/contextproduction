angular.module('contextApp').service('dashboardService', function($http, $q, chartService) {
    this.test = "dashboard Service working"
    this.setRedraw = function(redrawData) {
        this.redraw = redrawData;
    }
    this.setEconArr = function(econArr) {
        this.econArr = econArr;
    }
    this.setUserInfo = function(info) {
        this.userInfo = info;
    };
    this.logout = function(){
      return $http({
        method: 'GET',
        url: 'http://localhost:3000/logout'
      })
    }
    this.createPdf = function() {
        // var check = document.getElementById('exportthis')
        // console.log(check)
        // html2canvas(check, {
        //     onrendered: function(canvas) {
        //       var data = canvas.toDataURL('image/jpeg', 1.0);
        //       var img  = document.createElement('img');
        //       img.setAttribute('download','myImage.png');
        //       img.src  = data;
        //       document.body.appendChild(img);
        //
        //       var docDefinition = {
        //           content: [{
        //               image: data
        //           }]
        //       };
        //       window.open(img)
        //         // pdfMake.createPdf(docDefinition).download("Prod_test.pdf");
        //     }
        // });
    }
    this.getWells = function(userId) {
        return $http({
            method: "GET",
            url: 'http://localhost:3000/wells/wellsbyuser'
        })
    }
    this.removeWell = function(wellId) {
        return $http({
            method: "DELETE",
            url: 'http://localhost:3000/wells/removewell?well_id=' + wellId
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
                if (parseFloat(x.prod_oil) === 0) {
                    x.prod_oil = '.01'
                }
                return {
                    date: d,
                    oil: parseFloat(x.prod_oil),
                    mo: seqMonth,
                    type: 'oil'
                }
            })
            prodData = sortBy(prodData, 'date');
            console.log('prodData', prodData)
            if (d3.select("#chart1 svg")) {
                d3.select("#chart1 svg").remove();
            }
            chartService.chartMaker(prodData)
            return prodData;
            // hyperbolidDeclineCalc(result);
        })
    }
    this.economicModelCalc = function(result, investment, oilPrice, nRI, sevTax, opCost, nPV) {
        console.log(result)
        var checkArr = result.filter(function(x) {
            return x.forecast === 'y'
        })
        console.log('checkArr', checkArr)
        checkArr = sortBy(checkArr, 'date')
        var Np = 0,
            cumOilRev = 0,
            cumPresValue = 0;
        for (var i = 0; i < checkArr.length; i++) {
            Np += checkArr[i].qp;
            checkArr[i].mo = i + 1;
            checkArr[i].mNp = Np;
            checkArr[i].oilPrice = oilPrice;
            checkArr[i].revGross = Math.round(checkArr[i].qp * oilPrice);
            checkArr[i].nRI = nRI;
            checkArr[i].royalty = Math.round(checkArr[i].revGross * (1 - nRI));
            checkArr[i].wIR = Math.round(checkArr[i].revGross - checkArr[i].royalty);
            checkArr[i].sevTax = sevTax;
            checkArr[i].sevAdVel = Math.round(checkArr[i].wIR * sevTax);
            checkArr[i].OilRev = Math.round(checkArr[i].wIR - sevTax);
            checkArr[i].netOilRev = Math.round(checkArr[i].OilRev - opCost);
            checkArr[i].opCost = opCost;
            cumOilRev += checkArr[i].netOilRev;
            checkArr[i].cumOilRev = Math.round(cumOilRev);
            checkArr[i].presValue = Math.round(checkArr[i].netOilRev * ((1 / Math.pow((1 + (nPV / 12)), checkArr[i].mo))))
            cumPresValue += checkArr[i].presValue;
            checkArr[i].cumPresValue = Math.round(cumPresValue - investment)
            if (((checkArr[i].mo % 12 === 0 && checkArr[i].presValue > 0) || (i === checkArr.length - 1 && checkArr[i].presValue > 0)) || (i > 0 && (checkArr[i - 1].presValue > 0 && checkArr[i].presValue < 0))) {
                checkArr[i].yr = Math.round(((checkArr[i].mo / 12) * 100)) / 100
            }

        }
        econArr = checkArr.filter(function(x) {
            return (x.yr)
        })
        console.log('checkArr', checkArr)
        console.log('econArr', econArr)
        return econArr;

    }



    this.hyperbolicDeclineCalc = function(result, q0Value, bValue, econTimeInput, initDecline, startDate1, endDate1) {
        if (d3.select("#chart1 svg")) {
            d3.select("#chart1 svg").remove();
        }
        var startDate = new Date(startDate1);
        var endDate = new Date(endDate1);
        var newArr3 = result;
        if (startDate1 && !endDate1) {
            newArr3 = newArr3.filter(function(x) {
                return x.date >= startDate
            })
        } else if (!startDate1 && endDate1) {
            newArr3 = newArr3.filter(function(x) {
                return x.date <= endDate
            })
        } else if (startDate1 && endDate1) {
            newArr3 = newArr3.filter(function(x) {
                return x.date >= startDate && x.date <= endDate
            })
        }
        newArr3 = sortBy(newArr3, 'date');
        for (var i = 0; i < newArr3.length; ++i) {
            newArr3[i].mo = i;
        }
        var t0 = new Date(newArr3[0].date.toString());
        if (q0Value) {
            var q0 = q0Value;
        } else {
            var q0 = newArr3[0].oil;
        }
        console.log('q0', q0);
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
        var tStar = newArr3.length - 1;
        if (initDecline) {
            var initDeclineNom = (-1 * Math.log(1 - initDecline)) / 12
            var qStar = (newArr3[newArr3.length - 1].oil + newArr3[newArr3.length - 2].oil + newArr3[newArr3.length - 1].oil) / 3
        } else {
            var qStar = (newArr3[newArr3.length - 1].oil + newArr3[newArr3.length - 2].oil + newArr3[newArr3.length - 1].oil) / 3
        }
        console.log('initdeclineNom', initDeclineNom)
        console.log('qStar', qStar)
        console.log('tstar', tStar)
        if (bValue) {
            var a = bValue / bOverA
        } else {
            var a = (Math.log(q0 / qStar)) / (Math.log(1 + bOverA * tStar));
            var bValue = bOverA * a
        }
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
            if (initDecline) {
                var qp = q0 / (Math.pow(1 + (bValue * initDeclineNom * x.mo), (1 / bValue)))
            } else {
                var qp = q0 / (Math.pow((1 + bOverA * x.mo), a))
            }

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
        if (econTimeInput) {
            var econMo = econTimeInput
        } else {
            var econMo = 24
        }
        for (var i = 1; i <= econMo; ++i) {
            dateCheck.add({
                months: 1
            })
            if (initDecline) {
                qp = q0 / (Math.pow(1 + (bValue * initDeclineNom * (lastMo + i)), (1 / bValue)))
            } else {
                qp = q0 / (Math.pow((1 + bOverA * (lastMo + i)), a))
            }

            qp = Math.floor(qp)
            var check3 = {
                date: new Date(dateCheck.toString()),
                mo: lastMo + i,
                qp: qp,
                type: 'qp',
                forecast: 'y'
            }
            newArr4.push(check3)
        }
        chartService.chartMaker(newArr4);
        return newArr4;
    }
    //----------------------------Exponential Function----------------------------------------------
    this.getExpDeclineCalc = function(result, q0Value, declineRate, econTimeInput, startDate1, endDate1) {
        if (d3.select("#chart1 svg")) {
            d3.select("#chart1 svg").remove();
        }
        var startDate = new Date(startDate1);
        var endDate = new Date(endDate1);
        var expInitArr = result;
        if (startDate1 && !endDate1) {
            expInitArr = expInitArr.filter(function(x) {
                if (x.date >= startDate) {
                    return x;
                }
            })
        } else if (!startDate1 && endDate1) {
            expInitArr = expInitArr.filter(function(x) {
                if (x.date <= endDate) {
                    return x;
                }
            })
        } else if (startDate1 && endDate1) {
            expInitArr = expInitArr.filter(function(x) {
                if (x.date >= startDate && x.date <= endDate) {
                    return x;
                }
            })
        }

        expInitArr = sortBy(expInitArr, 'date');
        for (var i = 0; i < expInitArr.length; ++i) {
            expInitArr[i].mo = i;
        }
        console.log('expinitarr', expInitArr);
        if (q0Value) {
            var q0 = q0Value
        } else {
            var q0 = expInitArr[0].oil
        }
        console.log('q0', q0)
        var qEnd = expInitArr[expInitArr.length - 1].oil,
            tEnd = expInitArr[expInitArr.length - 1].mo
        if (declineRate) {
            var aValue = (-1 * Math.log(1 - declineRate)) / 12
        } else {
            var aValue = (Math.log(q0) - Math.log(qEnd)) / tEnd
        }
        console.log('aValue', aValue)
        console.log('a', aValue)
        expArr = [];
        expInitArr.forEach(function(x) {
            var qp = q0 * Math.pow((Math.E), -1 * aValue * x.mo)
            expArr.push(x)
            expArr.push({
                date: new Date(x.date.toString()),
                mo: x.mo,
                qp: qp,
                type: 'qp'
            })
        })
        var dateCheck = new Date(expInitArr[expInitArr.length - 1].date.toString());
        var lastMo = expInitArr[expInitArr.length - 1].mo
        if (econTimeInput) {
            var econMo = econTimeInput
        } else {
            var econMo = 24
        }
        for (var i = 1; i <= econMo; ++i) {
            dateCheck.add({
                months: 1
            })
            var qp = q0 * Math.pow((Math.E), -1 * aValue * (lastMo + i))
            qp = Math.floor(qp)
            var check3 = {
                date: new Date(dateCheck.toString()),
                mo: lastMo + i,
                qp: qp,
                type: 'qp',
                forecast: 'y'
            }
            expArr.push(check3)
        }


        console.log('expArr', expArr)
        chartService.chartMaker(expArr);
        return (expArr)


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
