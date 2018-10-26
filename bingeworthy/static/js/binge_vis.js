var movies = [];

function init() {
    var selector = d3.select("#sel-data-set");
    d3.json("/shows/data").then((sampleNames) => {
        movies = sampleNames;
        d3.selectAll("#sel-data-set > *").remove();
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample.title)
                .property("value", sample._id.$oid);
        });
    });
}

$('#filter-form').submit(function(e) {
    var currentValue = $("#sel-data-set").val();
    // first find the element from data
    var selected = _.find(movies, function(item) { return item._id.$oid == currentValue; });
    selected = selected.ratings[0].Value? selected.ratings[0].Value: selected.ratings[0].value;
    selected = parseFloat(selected.substring(
        0,
        selected.indexOf('/')
    ))
    // then request for the other ratings
    $.post('/graph/data', {
        id: currentValue,
    }, function(data) {
        data = $.parseJSON(data);
        if (data.success) {
            var mine = data.mine? data.mine.rating: 0.1;
            var other = data.others.pop;
            var dataSet = [selected, mine, other];

            var trace1 = {
                type: 'bar',
                x: ['IMDB Rating', 'My Rating', 'User Rating'],
                y: dataSet,
                marker: {
                    color: '#C8A2C8',
                    line: {
                        width: 2.5
                    }
                }
            };

            var data = [ trace1 ];

            var layout = {
              title: 'Rating Chart',
              font: {size: 18}
            };

            Plotly.newPlot('graph', data, layout, {responsive: true});
        }
    });

    e.preventDefault();
    return false;
});


// initialize the graph
init();
