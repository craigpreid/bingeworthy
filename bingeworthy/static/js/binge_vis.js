// titles=d3.json('/titles')
// console.log(titles)

// function showAttributes(sample) {
//     var defaultURL = `titles/${sample}`;
//     shows = defaultURL;
//     d3.json(defaultURL).then(function(data){
//       var PANEL = d3.select("#sample-metadata");
//       PANEL.html("");
//       Object.entries(data).forEach(function([key, value]){
//         PANEL.append('span').text(`${key}: ${value}`);
//         PANEL.append('br');
//       });
//     })
//   }

var movies = [];


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#sel-data-set");

  // Use the list of sample names to populate the select options


  d3.json("/shows/data").then((sampleNames) => {
    movies = sampleNames;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample.title)
        .property("value", sample._id.$oid);
    });

    // // Use the first sample from the list to build the initial plots
    // const firstSample = sampleNames[0];
    // buildCharts(firstSample);
    // buildMetadata(firstSample);
    // buildMetadata(firstSample);
    // buildWfreq(firstSample);
  });
}
  
 function optionChanged(currentValue) {
   // first find the element from data
   var selected = _.find(movies, function(item) { return item._id.$oid == currentValue; });
   selected = selected.ratings[0].Value? selected.ratings[0].Value: selected.ratings[0].value;
   selected = parseFloat(selected.substring(
    selected.indexOf('/') + 1,
    selected.length
   ))
   // then request for the other ratings
   $.post('/graph/data', {
    id: currentValue,
   }, function(data) {
    data = $.parseJSON(data);
    if (data.success) {
        var mine = data.mine? data.mine.rating: 0.1;
        var other = data.others.pop;

        var svgWidth = 500;
        var svgHeight = 300;
        var svg = d3.select('svg')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("class", "bar-chart");

        d3.selectAll("svg > *").remove();

        var dataset = [selected * 30, mine * 30, other * 30];
        var barPadding = 5;
        var barWidth = (svgWidth / dataset.length);
        var barChart = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("y", function(d) {
                return svgHeight - d
            })
            .attr("height", function(d) {
                return d;
            })
            .attr("width", barWidth - barPadding)
            .attr("transform", function (d, i) {
                 var translate = [barWidth * i, 0];
                 return "translate("+ translate +")";
            });

        // make the graph
    }
   });

 }

// intialize the dashboard
init();
