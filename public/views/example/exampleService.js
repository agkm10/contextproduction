angular.module('contextApp').service('exampleService', function($http, $q) {
    this.testtest = "service test"
    this.serverTest = function(someNumber) {
        return $http({
            method: "GET",
            url: 'http://localhost:3000/api/wells/:id'
        }).then(function(result) {
            var newArr3 = result.data.map(function(x) {
                var d = new Date(x.date);
                return {
                    date: d,
                    oil: x.oil,
                    gas: x.gas
                }
            })
            newArr3 = sortBy(newArr3, 'date');
            var t0 = newArr3[0].date;
            newArr3 = newArr3.map(function(x) {
                var extraYr = x.date.getYear() - t0.getYear();
                var seqMonth = ((x.date.getMonth() - t0.getMonth()) + extraYr * 12);
                return {
                    date: x.date,
                    oil: parseInt(x.oil),
                    gas: x.gas,
                    mo: seqMonth,
                    type: 'oil'
                }
            })
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
            console.log('b', bOverA*a)
            console.log('a',a)
            console.log('b/a',bOverA)
            console.log('q3',q3)
            console.log('t3',t3)

            var totalError = 0;
            newArr3.forEach(function(x) {
              console.log(x.mo)
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
            console.log('TotalError',totalError)
            var dateCheck = new Date(newArr3[newArr3.length - 1].date.toString());
            var econMo = 24
            qpArr = econTime(qpArr, econMo, q0, bOverA, newArr3, a, dateCheck);
            return chartMaker(newArr3, qpArr);
        })
    }
    //----------------------------Extend function ---------------------------------------------------
    function econTime(arr, tEcon, q0, bOverA, newArr3, a, dateCheck) {
        var tempArr = arr;
        var date = ""
        for (var i = 1; i <= tEcon; ++i) {
            dateCheck.add({
                months: 1
            })

            qp = q0 / (Math.pow((1 + bOverA * (newArr3[newArr3.length - 1].mo + i)), a))
            qp = Math.floor(qp)
            var check3 = {
                date: new Date(dateCheck.toString()),
                mo: newArr3[newArr3.length - 1].mo + i,
                qp: qp,
                type: 'qp'
            }
            tempArr.push(check3)
        }

        console.log(tempArr)
        return tempArr;
    }

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
    //----------------------------Create Chart----------------------------------------------------
    var chartMaker = function(result, qpArr) {
        var data = result
        var data2 = qpArr
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = document.getElementById('chart12').clientWidth-margin.right-margin.left,
            height = 500-margin.bottom-margin.top;
            console.log(width)
            console.log(document.getElementById('chart12'))
        var date_format = d3.time.format("%b %y'");
        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */

        // setup x
        var xValue = function(d) {
                return d.date;
            }, // data -> value
            xScale = d3.time.scale().range([0, width]), // value -> display
            xMap = function(d) {
                return xScale(xValue(d));
            }, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(date_format);

        // setup y
        var yValue = function(d) {
                return d.oil;
            }, // data -> value
            yScale = d3.scale.log().range([height, 0]), // value -> display
            yMap = function(d) {
                return yScale(yValue(d));
            }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(num) {
                return num
            });

        var yValue2 = function(d) {
                return d.qp;
            }, // data -> value
            yMap2 = function(d) {
                return yScale(yValue2(d));
            }; // data -> display


        // setup fill color
        var cValue = function(d) {
                return d.type;
            },
            color = d3.scale.category10();

        // add the graph canvas to the body of the webpage
        var svg = d3.select("#chart12").append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain(d3.extent(data2, function(d) {
            return d.date;
        })).nice();
        yScale.domain(d3.extent(data2, function(d) {
            return d.oil;
        })).nice();

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Date");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Oil Production, bbl/mo");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) {
                return color(cValue(d));
            })
            .on("mouseover", function(d) {
              console.log(d3.event.pageX)
              console.log(d3.event.pageY)
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["oil"] + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("position", "absolute")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

        svg.selectAll(".dot1")
            .data(data2)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap2)
            .style("fill", function(d) {
                return color(cValue(d));
            })
            .on("mouseover", function(d) {
              console.log(d3.event.pageX)
              console.log(d3.event.pageY)
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["qp"] + "<br/> (" + xValue(d)
	        + ", " + yValue2(d) + ")")
               .style("position", "absolute")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            })
    }
});
