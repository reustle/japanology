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
$('table[data-season=1]').show();

// Handle season tab click

// Handle watched toggle
$('input[type=checkbox]').click(function(){
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
