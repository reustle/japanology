// Update watched on startup
$('tr[data-id]').each(function(){
  var thisEp = $(this).attr('data-id');
  if(thisEp && Session.get('watched' + thisEp)){
    $(this).addClass('table-success');
  }
});

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
  
});
