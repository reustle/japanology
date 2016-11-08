// Activate the tooltips
$('[data-toggle="tooltip"]').tooltip();

// Update watched on startup
$('tr[data-id]').each(function(){
    var thisEp = $(this).attr('data-id');
    if(thisEp && Session.get('watched-' + thisEp)){
        $(this).addClass('table-success');
        $(this).find('input[type=checkbox]').prop('checked', true);
    }
});

// Hide other season tables
$('table[data-season]').hide();
$('table[data-season=2008]').show();
$('.nav-link').first().addClass('active');

// Handle season tab click
$('a[data-season]').click(function(e){
    e.preventDefault();

    $('.nav-tabs .active').removeClass('active');
    $(this).addClass('active');

    $('table[data-season]').hide();
    $('table[data-season=' + $(this).attr('data-season') + ']').show();

});

// Handle watched toggle
$('input[type=checkbox]').click(function(e){

    var parentTr = $(this).parents('tr');
    var episode = parentTr.attr('data-id');
    var watched = $(this).is(':checked');

    if(watched){
        Session.set('watched-' + episode, true);
        parentTr.addClass('table-success');
    }else{
        Session.set('watched-' + episode, undefined);
        parentTr.removeClass('table-success');
    }

    $(this).blur();
});

