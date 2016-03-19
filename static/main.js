$('input[type=checkbox]').click(function(){
  console.log($(this).parents('tr').attr('data-id'));
});
