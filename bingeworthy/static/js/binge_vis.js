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



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options


  d3.json("/titles").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // // Use the first sample from the list to build the initial plots
    // const firstSample = sampleNames[0];
    // buildCharts(firstSample);
    // buildMetadata(firstSample);
    // buildMetadata(firstSample);
    // buildWfreq(firstSample);
  });
}
  
// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
//   buildWfreq(newSample);
// }

// intialize the dashboard
init();
