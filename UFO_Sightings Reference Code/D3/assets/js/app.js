
function makeResponsive() {
// if the SVG area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
  svgArea.remove();
};

var svgWidth = window.innerWidth/1.2;
var svgHeight = window.innerHeight/1.5;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// ------------/ CHART 1 - Static /-------------//

// Append SVG element
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
// The translate() function moves a shape. You pass the x and y value to the
// translate() function inside the parameters.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(census, err){
  if (err) throw err;

  // parse data
  census.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.income = +data.income;
});

  // create scales
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(census, d => d.poverty) * 0.9,
          d3.max(census, d => d.poverty) * 1.1])
  .range([0, width]);


  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(census, d => d.healthcare) * 0.8,
          d3.max(census, d => d.healthcare) * 1.1])
  .range([height, 0]);


  // create axes
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);


  // append axes
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

  chartGroup.append("g")
  .call(yAxis);

// ------- Gradient Pattern ------ //
var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");
// Define the gradient colors
gradient.append("svg:stop")
  .attr("offset", "0%")
  .attr("stop-color", "#FFFF00")
  .attr("stop-opacity", 1);
gradient.append("svg:stop")
  .attr("offset", "100%")
  .attr("stop-color", "#008080")
  .attr("stop-opacity", 1);


// Create circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(census)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", '2%')
  .attr('fill', 'url(#gradient)')
  .attr("stroke-width", "1")
  .attr("opacity", "0.9");

// Create text
  var state = chartGroup.selectAll(".abbr")
  .data(census);

  state.enter()
  .append("text")
  .merge(state)
  .classed('abbr', true)
  // .attr("transform", d => `translate(${xLinearScale(d.poverty)}, ${yLinearScale(d.healthcare)})`)
  .attr("x", d => xLinearScale(d.poverty) - 7)
  .attr("y", d => yLinearScale(d.healthcare) + 4)
  .text(d => d.abbr)
  .style("fill", "white")
  .style("font-weight", "bold")
  .style("font-size", '10px');
  state.exit().remove(); //remove extra objects if htey exist

  // Append axes labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .classed("active", true)
  .text("Poverty (%)");

  labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -(margin.left + width)/2)
    .attr("x", (margin.bottom + height)/2)
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

// --------------/ CHART 2 - Dynamic /--------------//

////////////////////////////////
// Arrange SVG space
////////////////////////////////

var svgArea1 = d3.select("body").select(".chartDynamic").select("svg");

// clear svg is not empty
if (!svgArea1.empty()) {
  svgArea1.remove();
};

// Append SVG element
var svg1 = d3
  .select(".chartDynamic")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup1 = svg1.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

////////////////////////////////
// Interpolate Scales
////////////////////////////////

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Create functions interpolate linear scales (X and Y)
function xScale(census, chosenXAxis) {
  // create scales
  var xLinearScale1 = d3.scaleLinear()
    .domain([d3.min(census, d => d[chosenXAxis]) * 0.9,
            d3.max(census, d => d[chosenXAxis]) * 1.1])
    .range([0, width]);

  return xLinearScale1;
}

function yScale(census, chosenYAxis) {
  // create scales
  var yLinearScale1 = d3.scaleLinear()
    .domain([d3.min(census, d => d[chosenYAxis]) * 0.8,
            d3.max(census, d => d[chosenYAxis]) * 1.1])
    .range([height, 0]);

  return yLinearScale1;
}
///////////////////////////////////////////
// Udate axis var upon click on axis label
///////////////////////////////////////////

function renderXAxes(newXScale, xAxis1) {
  var bottomAxis1 = d3.axisBottom(newXScale);

  xAxis1.transition()
    .duration(1000)
    .call(bottomAxis1);

  return xAxis1;
}

function renderYAxes(newYScale, yAxis1) {
  var leftAxis1 = d3.axisLeft(newYScale);

  yAxis1.transition()
    .duration(1000)
    .call(leftAxis1); // calling leftAxex func for leftAxis1

  return yAxis1;
}

///////////////////////////////////////////
// Udate with Circles and Text
///////////////////////////////////////////

// Update Circles Group
function renderCircles(circlesGroup1, newXScale,
  newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup1.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup1;
}

// Update Text
function renderAbbr(state1, newXScale,
  newYScale, chosenXAxis, chosenYAxis) {

  state1.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]) - 7)
    .attr("y", d => newYScale(d[chosenYAxis]) + 4);

  return state1;
}

///////////////////////////////////////////
// Udate Tooltip
///////////////////////////////////////////

// Update after changing X-axis
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1) {

  if (chosenXAxis === "poverty") {
    var labelX = "Poverty: ";}
  else if (chosenXAxis === "age") {
    var labelX = "Age: ";}
  else {var labelX = "Income: ";}

  if (chosenYAxis === "healthcare") {
    var labelY = "Healthcare: ";}
  else if (chosenYAxis === "smokes") {
    var labelY = "Smokers: ";}
  else {var labelY = "Obesety: ";}

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}
      <br>${labelY} ${d[chosenYAxis]}`);
    });

  circlesGroup1.call(toolTip);

  circlesGroup1.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup1;
}

///////////////////////////////////////
// Create and append updated axeses
///////////////////////////////////////

 var xLinearScale1 = xScale(census, chosenXAxis);
 var yLinearScale1 = yScale(census, chosenYAxis);

 var bottomAxis1 = d3.axisBottom(xLinearScale1);
 var leftAxis1 = d3.axisLeft(yLinearScale1);

 // append X axix
 var xAxis1 = chartGroup1.append("g")
 .classed("x-axis", true)
 .attr("transform", `translate(0, ${height})`)
 .call(bottomAxis1); // invokes a callback function on a selection itself

// append Y axix
var yAxis1 = chartGroup1.append("g")
 .classed("y-axis", true)
 .call(leftAxis1);

////////////////////////////////
// Gradient Pattern
////////////////////////////////

var gradient = svg1.append("svg:defs")
  .append("svg:linearGradient")
  .attr("id", "gradient1")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");
// Define the gradient colors
gradient.append("svg:stop")
  .attr("offset", "0%")
  .attr("stop-color", "#000000")
  .attr("stop-opacity", 0.9);
gradient.append("svg:stop")
  .attr("offset", "100%")
  .attr("stop-color", "#FF0000")
  .attr("stop-opacity", '1');

////////////////////////////////
// Append Circles and state abbr
////////////////////////////////

var circlesGroup1 = chartGroup1.selectAll(".dynamic")
  .data(census)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale1(d[chosenXAxis]))
  .attr("cy", d => yLinearScale1(d[chosenYAxis]))
  .attr("r", "2%")
  .attr("fill", "url(#gradient1)")
  .attr("opacity", "1");

  var state1 = chartGroup1.selectAll(".abbr")
  .data(census)
  .enter()
  .append("text")
  .merge(state)
  .classed('abbr', true)
  .attr("x", d => xLinearScale1(d.poverty) - 7)
  .attr("y", d => yLinearScale1(d.healthcare) + 4)
  .text(d => d.abbr)
  .style("fill", "white")
  .style("font-weight", "bold")
  .style("font-size", '10px');

  state1.exit().remove();

  ///////////////////////////
  // append X axis- labeles
  /////////////////////////

  var labelsGroup1 = chartGroup1.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var poverty = labelsGroup1.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var age = labelsGroup1.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var income = labelsGroup1.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  ///////////////////////////
  // append Y axis- labeles
  ///////////////////////////

  var labelsGroup2 = chartGroup1.append("g")

  var healthcare = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 50 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokes = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 30 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesity = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity")
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Obese (%)");

  var circlesGroup1 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1);

  ///////////////////////////////
  // X axis labels event listener
  ///////////////////////////////

  labelsGroup1.selectAll("text")
  .on("click", function() {
    // get value of selection
    var valueX = d3.select(this).attr("value");

    switch(valueX) {
      case "poverty":
        chosenXAxis = 'poverty';
        poverty
        .classed("active", true)
        .classed("inactive", false);
        age
        .classed("active", false)
        .classed("inactive", true);
        income
        .classed("active", false)
        .classed("inactive", true);
        break;

      case "age":
        chosenXAxis = 'age';
        poverty
        .classed("active", false)
        .classed("inactive", true);
        age
        .classed("active", true)
        .classed("inactive", false);
        income
        .classed("active", false)
        .classed("inactive", true);
        break;

      case "income":
        chosenXAxis = "income";
        poverty
        .classed("active", false)
        .classed("inactive", true);
        age
        .classed("active", false)
        .classed("inactive", true);
        income
        .classed("active", true)
        .classed("inactive", false);
        break;
    };

    xLinearScale1 = xScale(census, chosenXAxis);
    xAxis1 = renderXAxes(xLinearScale1, xAxis1);
    circlesGroup1 = renderCircles(circlesGroup1, xLinearScale1, yLinearScale1, chosenXAxis, chosenYAxis);
    state1 = renderAbbr(state1, xLinearScale1, yLinearScale1, chosenXAxis, chosenYAxis);
    circlesGroup1 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1);
  });

///////////////////////////////
// Y axis labels event listener
///////////////////////////////

labelsGroup2.selectAll("text")
  .on("click", function() {
    // get value of selection
    var valueY = d3.select(this).attr("value");

    switch(valueY) {
      case "healthcare":
        chosenYAxis = 'healthcare';
        healthcare
        .classed("active", true)
        .classed("inactive", false);
        smokes
        .classed("active", false)
        .classed("inactive", true);
        obesity
        .classed("active", false)
        .classed("inactive", true);
        break;

      case "smokes":
        chosenYAxis = 'smokes';
        healthcare
        .classed("active", false)
        .classed("inactive", true);
        smokes
        .classed("active", true)
        .classed("inactive", false);
        obesity
        .classed("active", false)
        .classed("inactive", true);
        break;

      case "obesity":
        chosenYAxis = "obesity";
        healthcare
        .classed("active", false)
        .classed("inactive", true);
        smokes
        .classed("active", false)
        .classed("inactive", true);
        obesity
        .classed("active", true)
        .classed("inactive", false);
        break;
    };

    yLinearScale1 = yScale(census, chosenYAxis);
    yAxis1 = renderYAxes(yLinearScale1, yAxis1);
    circlesGroup1 = renderCircles(circlesGroup1, xLinearScale1, yLinearScale1, chosenXAxis, chosenYAxis);
    state1 = renderAbbr(state1, xLinearScale1, yLinearScale1, chosenXAxis, chosenYAxis);
    circlesGroup1 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1);
  });

}) // closing read CSV function
}; // closing responsive function

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
