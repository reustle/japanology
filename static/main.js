$('input[type=checkbox]').click(function(){
  console.log($(this).parent('tr').attr('data-id'));
});
