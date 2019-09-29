// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv")
  .then(function(data1) {


    data1.forEach(function(data2) {
      data2.healthcare = +data2.healthcare;
      data2.poverty = +data2.poverty;
    });


    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data1, d => d.poverty), d3.max(data1, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data1, d => d.healthcare), d3.max(data1, d => d.healthcare)])
      .range([height, 0]);


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
      .data(data1)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "blue")
      .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll(".stateText")
      .data(data1)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .text(d => (d.abbr))
      .attr("class", "stateText")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");



    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty (%): ${d.poverty}<br>Healthcare (%): ${d.healthcare}`);
      });


    chartGroup.call(toolTip);


    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });
