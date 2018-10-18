$(function() {
    // DOM is ready
    var busy = false;

    $('#search-form').submit(function() {
        if (busy) {
            return false;
        }
        // make the form busy
        busy = true;
        data = $(this).serialize();
        $.post($(this).prop('action'), data, function(movies) {
            // release the form
            busy = false;
        });

        // stop the form
        return false;
    });
});
