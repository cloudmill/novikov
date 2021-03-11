$(function() {
    restaurantsFilter();
});

function restaurantsFilter() {
    $('[data-type=filter-restaurants]').on('click', function () {
        console.log('click');
    });
}