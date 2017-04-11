angular.module('contextApp').service('chartService', ['$http', '$q', function($http, $q) {
    //----------------------------Create Chart----------------------------------------------------


    this.chartMaker = function(result) {
      d3.select("#chart1 svg").remove();
        // console.log('chartmaker', result)
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var data1 = [];
        var  data2 = [];

        result.forEach(function(x) {
            if (x.type === 'oil') {
                data1.push(x);
            } else {
                data2.push(x);
            }
        })

        var margin = {
                top: 10,
                right: 100,
                bottom: 40,
                left: 40
            }
        var width = document.getElementById('chart1').clientWidth;
        var height = document.getElementById('chart1').clientHeight;
        var yaxist = height - margin.bottom;
        var xaxist = width - margin.right;

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
            xScale = d3.time.scale().range([0, xaxist]), // value -> display
            xMap = function(d) {
                return xScale(xValue(d));
            }, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(date_format);

        // setup y
        var ticks = [1, 10, 100, 1000, 10000, 100000]
        var yValue = function(d) {
                return d[d.type];
            }, // data -> value
            yScale = d3.scale.log().range([yaxist, 1]), // value -> display
            yMap = function(d) {
                return yScale(yValue(d));
            }, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function(num) {
                if (ticks.indexOf(num) !== -1) {
                    return num
                } else {
                    return ''
                }
            });

        var yValue2 = function(d) {
                return d[d.type];
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



        var svg = d3.select("#chart1").append("svg")
            .attr("id", 'chart1svg')
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)

        // don't want dots overlapping axis, so add in buffer to data domain

        if (data2.length > data1.length) {
            var scaleData = data2
        } else {
            var scaleData = data1
        }
        xScale.domain(d3.extent(scaleData, function(d) {
            return d.date;
        })).nice();
        yScale.domain(d3.extent(scaleData, function(d) {
            if (d[d.type] === 0) {
                return 1
            } else {
                return d[d.type];
            }
        })).nice();
        // x-axis


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + yaxist + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", height)
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
            .data(data1)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) {
                return color(cValue(d));
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(Math.floor(yValue(d)) + " bbl/mo <br/> (" + monthNames[xValue(d).getMonth()] + "-" + xValue(d).getFullYear() +
                        ")")
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
            .attr("r", 2)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) {
                return color(cValue(d));
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(yValue(d) + " bbl/mo <br/> (" + monthNames[xValue(d).getMonth()] + "-" + xValue(d).getFullYear() +
                        ")")
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
            .attr("x", xaxist - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", xaxist - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            })
    }

}]);
