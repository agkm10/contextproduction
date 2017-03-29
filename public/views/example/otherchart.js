// var margin = {top: 20, right: 20, bottom: 30, left: 40},
// width = 960 - margin.left - margin.right,
// height = 500 - margin.top - margin.bottom;
// var  date_format = d3.time.format("%b %y'");
//
//
// var x = d3.time.scale()
// .range([40, width]);
//
// var y = d3.scale.log()
// .range([height, 0]);
//
// var color = d3.scale.category10();
//
// var xAxis = d3.svg.axis()
// .scale(x)
// .orient("bottom")
// .tickFormat(date_format);
//
// var yAxis = d3.svg.axis()
// .scale(y)
// .orient("left")
// .tickFormat(function(num){return num});
//
//
//
// var svg = d3.select("#chart1").append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var data = result;
// console.log('data',data);
//
// x.domain(d3.extent(data, function(d) { return d.date; })).nice();
// y.domain(d3.extent(data, function(d) { return d.oil; })).nice();
//
// svg.append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis)
// .append("text")
//   .attr("class", "label")
//   .attr("x", width)
//   .attr("y", -6)
//
//   .style("text-anchor", "end")
//   .text("Date");
//
// svg.append("g")
//   .attr("class", "y axis")
//   .call(yAxis)
// .append("text")
//   .attr("class", "label")
//   .attr("transform", "rotate(-90)")
//   .attr("y", 6)
//   .attr("dy", ".71em")
//   .style("text-anchor", "end")
//   .text("Oil Production (bbl/mo)")
//
// svg.selectAll(".dot")
//   .data(data)
// .enter().append("circle")
//   .attr("class", "dot")
//   .attr("r", 3.5)
//   .attr("cx", function(d) { return x(d.date); })
//   .attr("cy", function(d) { return y(d.oil); })
//   .style("fill", 'green');
//
// var legend = svg.selectAll(".legend")
//   .data(['Oil', 'Pred Oil'])
// .enter().append("g")
//   .attr("class", "legend")
//   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
// legend.append("rect")
//   .attr("x", width - 18)
//   .attr("width", 18)
//   .attr("height", 18)
//   .style("fill", 'green');
//
// legend.append("text")
//   .attr("x", width - 24)
//   .attr("y", 9)
//   .attr("dy", ".35em")
//   .style("text-anchor", "end")
//   .text(function(d) { return d; });
//
// };
