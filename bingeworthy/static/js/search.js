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
            // initial html string
            htmlStr = '';
            // parse the json
            movies = $.parseJSON(movies);
            // build the html string
            _.forEach(movies, function(movie) {
                if (!movie.poster || movie.poster.toLowerCase() == 'n/a') {
                    movie.poster = 'https://via.placeholder.com/136x200?text=Poster';
                }

                htmlStr += '<div class="col-md-6 movie">';
                htmlStr += '<img src="' + movie.poster + '" alt="">';
                htmlStr += '<h5>' + movie.title + '</h5>';
                htmlStr += '<div>' + movie.year + ', ' +  movie.type + '</div>';
                htmlStr += '<input type="hidden" name="imdb_id" value="' + movie.imdb_id + '">';
                htmlStr += '<label><input type="checkbox" name="bingeworthy" value="1"> Bingeworthy?</label>';
                htmlStr += '<input type="hidden" name="rating" value="7.5">';
                htmlStr += '<div class="rate-box" id="' + movie.imdb_id + '"></div> <button class="add-button" type="submit">Add</button></div>';
            });
            // update the html
            $('#movies-holder').html(htmlStr);

            // release the form
            $('#input-btn-register').prop('disabled', false);
            $('.lds-css').hide();
            busy = false;

            // the rating control
            $(".rate-box").rate({
                readonly: false,
                length: 10,
                text: false,
                value: 7.5,

                callback: function(object) {
                    $('input[name=imdb_id][value=' + object.id + ']')
                        .parent()
                        .find('input[name=rating]')
                        .val(object.index + 1);
                }
            });

            // the add button js bindings
            $('.add-button').click(function(e) {
                var imdb_id = $(this).parent().find('input[name=imdb_id]').val();
                var bingeworthy = $(this).parent().find('input[name=bingeworthy]').prop('checked')? true: false;
                var rating = $(this).parent().find('input[name=rating]').val();

                $.post('/show/add/mine', {
                    imdb_id: imdb_id,
                    bingeworthy: bingeworthy,
                    rating: rating
                }, function(data) {
                    data = $.parseJSON(data);

                    if (data.success) {
                        $.growl.notice({ message: data.message });
                        return true;
                    }

                    $.growl.error({ message: data.message });
                });
                e.preventDefault();
            });

        });

        // stop the form
        return false;
    });
});
