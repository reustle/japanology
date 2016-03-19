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
