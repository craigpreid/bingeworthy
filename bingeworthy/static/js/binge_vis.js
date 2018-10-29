var movies = [];

// the init function for d3.js
function init() {
    // select the html element
    var selector = d3.select("#sel-data-set");
    // make the ajax request
    d3.json("/shows/data").then((sampleNames) => {
        // store the data so that we don't need to call again
        movies = sampleNames;
        // remove all the child elements, that means the loading text
        d3.selectAll("#sel-data-set > *").remove();
        // travers the result which has returned from ajax call
        sampleNames.forEach((sample) => {
            // append <option> element to the select box
            selector
                .append("option")
                // with the text 'movie.title'
                .text(sample.title)
                // and the value object id / id in MongoDB
                .property("value", sample._id.$oid);
        });
    });
}

// on the form with id 'filter-form' submit, call this function
$('#filter-form').submit(function(e) {
    // get the current value from the select box
    var currentValue = $("#sel-data-set").val();
    // first find the selected item from data
    var selected = _.find(movies, function(item) { return item._id.$oid == currentValue; });

    // now fill the movie info section ------------->
    // make the string / html
    var movie_rating = selected.ratings[0].Value? selected.ratings[0].Value: selected.ratings[0].value;
    var htmlStr = '<li class="filter list-group-item"><img src="' + selected.poster + '" alt="" width="100"></li>';
    htmlStr += '<li class="filter list-group-item">' + selected.title + '</li>';
    htmlStr += '<li class="filter list-group-item">Type: ' + selected.type + '</li>';
    htmlStr += '<li class="filter list-group-item">Year: ' + selected.year + '</li>';
    htmlStr += '<li class="filter list-group-item">Rating: ' + movie_rating + '</li>';
    htmlStr += '<li class="filter list-group-item">Genre: ' + selected.genre + '</li>';
    htmlStr += '<li class="filter list-group-item">Actors: ' + selected.actors + '</li>';
    // set the html to the movie info element
    $('#movie-info').html(htmlStr);
    // the movie info section code ends here ------------->

    // check if 'V' is capital or small
    selected = selected.ratings[0].Value? selected.ratings[0].Value: selected.ratings[0].value;
    // convert '8.8/10' to '8.8'
    selected = parseFloat(selected.substring(
        0,
        selected.indexOf('/')
    ))
    // now that we have the IMDB rating with the data
    // we should request for the other ratings (own and other users')
    $.post('/graph/data', {
        id: currentValue,
    }, function(data) {
        data = $.parseJSON(data);
        if (data.success) {
            // if I have no rating then keep it 0.1 so that something is visible to the chart
            var mine = data.mine? data.mine.rating: 0.1;
            // find the average rating (other people's rating)
            var other = data.others.pop;
            // make an array from the values
            var dataSet = [selected, other, mine];

            var trace1 = {
                type: 'bar',
                // labels of the bars
                x: ['IMDB', 'Bingers', 'Your Rating'],
                y: dataSet,
                marker: {
                    // colors of the bars
                    color: ['#4472c4', '#c55a11', '#385723'],
                    line: {
                        width: 1.5
                    }
                }
            };

            // assign to data variable
            var data = [ trace1 ];

            // set the other chart options
            var layout = {
                title: 'Comparison of Show Ratings',
                font: {size: 18}
            };

            // call ployly to make a new graph
            Plotly.newPlot('graph', data, layout, {responsive: true});
        }
    });

    // stop going to another page, stop the form submit
    e.preventDefault();
    // return false to polyfill old browsers to stop going to another page
    return false;
});


// initialize / fill the select box
init();
