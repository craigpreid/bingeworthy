$(function() {
    // DOM is ready
    var busy = false;

    $('#search-form').submit(function() {
        if (busy) {
            return false;
        }
        // clear the items first
        $('#movies-holder').html('');

        // make the form busy
        $('.lds-css').show();
        $('#input-btn-register').prop('disabled', true);
        busy = true;
        data = $(this).serialize();
        $.post($(this).prop('action'), data, function(movies) {
            htmlStr = '';
            movies = $.parseJSON(movies);
            _.forEach(movies, function(movie) {
                if (!movie.poster || movie.poster.toLowerCase() == 'n/a') {
                    movie.poster = 'https://via.placeholder.com/136x200?text=Poster';
                }

                htmlStr += '<div class="col-md-4 movie">';
                htmlStr += '<img src="' + movie.poster + '" alt="">';
                htmlStr += '<input type="hidden" name="imdb_id" value="' + movie.imdb_id + '">';
                htmlStr += '<input type="checkbox" name="bingeworthy" value="1">';
                htmlStr += '<input type="hidden" name="rating" value="10">';
                htmlStr += '<h5>' + movie.title + '</h5>';
                htmlStr += '<div>' + movie.year + ', ' +  movie.type + '</div></div>';
            });
            $('#movies-holder').html(htmlStr);

            // release the form
            $('#input-btn-register').prop('disabled', false);
            $('.lds-css').hide();
            busy = false;
        });

        // stop the form
        return false;
    });
});
